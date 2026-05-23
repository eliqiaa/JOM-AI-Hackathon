"""Build the two indices that power retrieval.

- ChromaDB: dense vector index over `Service.rich_description`. Each service
  is stored with `service_id` as the doc ID (so re-ingesting is idempotent
  via upsert) and the full Service flattened into Chroma metadata. Embedding
  is done locally with Chroma's bundled `all-MiniLM-L6-v2` (ONNX runtime) —
  no API key required.
- BM25: sparse lexical index over `service_name + agency + rich_description`,
  with `src.acronyms.expand_acronyms` applied so the BM25 corpus also
  contains the expanded SG-specific phrases. Pickled to disk.

Run with:   python -m src.ingest
"""

from __future__ import annotations

import json
import logging
import pickle
import re
from collections.abc import Callable, Iterable
from pathlib import Path

import chromadb
from chromadb.api.models.Collection import Collection
from chromadb.utils.embedding_functions import DefaultEmbeddingFunction
from rank_bm25 import BM25Okapi

from src.acronyms import expand_acronyms
from src.config import (
    BM25_INDEX_PATH,
    CHROMA_COLLECTION_NAME,
    CHROMA_PERSIST_DIR,
    DATA_PROCESSED,
)
from src.schema import Service

# chromadb 0.5.x has a broken posthog integration that spams ERROR logs on
# every client/collection event. Settings(anonymized_telemetry=False) doesn't
# fully suppress it because PostHog is initialized at module import. Silence
# the logger directly.
logging.getLogger("chromadb.telemetry.product.posthog").setLevel(logging.CRITICAL)

logger = logging.getLogger(__name__)

# Chroma metadata only stores primitives. Nested fields are JSON-stringified
# under these keys; retrieve.py parses them back into a Service.
_JSON_METADATA_FIELDS = (
    "eligibility",
    "required_documents",
    "operating_hours",
    "contact",
)


def load_services(directory: Path = DATA_PROCESSED) -> list[Service]:
    """Load and validate every Service JSON in `directory`. Sorted by service_id."""
    fixtures = sorted(directory.glob("*.json"))
    if not fixtures:
        raise FileNotFoundError(f"No service JSON files found in {directory}")
    services = [Service.model_validate_json(p.read_text(encoding="utf-8")) for p in fixtures]
    services.sort(key=lambda s: s.service_id)
    return services


def flatten_service_for_chroma(service: Service) -> dict[str, str | int | float | bool]:
    """Flatten a Service into a Chroma-metadata-safe dict (primitives only)."""
    dump = service.model_dump(mode="json")
    flat: dict[str, str | int | float | bool] = {}
    for key, value in dump.items():
        if key in _JSON_METADATA_FIELDS:
            flat[key] = json.dumps(value, ensure_ascii=False)
        elif isinstance(value, (str, int, float, bool)):
            flat[key] = value
        else:
            flat[key] = json.dumps(value, ensure_ascii=False)
    return flat


def unflatten_service_from_chroma(metadata: dict) -> Service:
    """Inverse of `flatten_service_for_chroma`."""
    rebuilt = dict(metadata)
    for field in _JSON_METADATA_FIELDS:
        if field in rebuilt and isinstance(rebuilt[field], str):
            rebuilt[field] = json.loads(rebuilt[field])
    return Service.model_validate(rebuilt)


def _get_collection(persist_dir: Path, collection_name: str) -> Collection:
    persist_dir.mkdir(parents=True, exist_ok=True)
    chroma = chromadb.PersistentClient(path=str(persist_dir))
    return chroma.get_or_create_collection(
        name=collection_name,
        embedding_function=DefaultEmbeddingFunction(),
        metadata={"hnsw:space": "cosine"},
    )


def build_chroma_index(
    services: Iterable[Service],
    *,
    persist_dir: Path = CHROMA_PERSIST_DIR,
    collection_name: str = CHROMA_COLLECTION_NAME,
) -> Collection:
    """Build / refresh the ChromaDB collection. Idempotent via `service_id` upsert.

    Embeddings are computed locally by Chroma using all-MiniLM-L6-v2 (ONNX).
    First call downloads the model (~80MB); subsequent calls reuse the cache.
    """
    services = list(services)
    collection = _get_collection(persist_dir, collection_name)

    ids = [s.service_id for s in services]
    documents = [s.rich_description for s in services]
    metadatas = [flatten_service_for_chroma(s) for s in services]

    stale = sorted(set(collection.get(include=[])["ids"]) - set(ids))
    if stale:
        collection.delete(ids=stale)
        logger.info("Chroma delete stale: %d ids (%s)", len(stale), ", ".join(stale))

    collection.upsert(ids=ids, documents=documents, metadatas=metadatas)
    logger.info("Chroma upsert: %d services into collection %r", len(ids), collection_name)
    return collection


_TOKEN_RE = re.compile(r"[a-z0-9]+")


def tokenize(text: str) -> list[str]:
    """Lowercase, alphanumeric word split. Stable & deterministic."""
    return _TOKEN_RE.findall(text.lower())


def build_bm25_index(
    services: Iterable[Service],
    *,
    output_path: Path = BM25_INDEX_PATH,
    acronym_expander: Callable[[str], str] = expand_acronyms,
) -> tuple[BM25Okapi, list[str]]:
    """Build the BM25 index and pickle it. Returns (bm25, ordered service_ids).

    Each service's text (name + agency + rich_description) is run through the
    acronym expander before tokenizing. Default expander is
    `src.acronyms.expand_acronyms` (SG-specific). Tests inject a stub to
    verify the hook is called.
    """
    services = list(services)
    service_ids: list[str] = []
    tokenized_corpus: list[list[str]] = []
    for s in services:
        raw = f"{s.service_name} {s.agency} {s.rich_description}"
        expanded = acronym_expander(raw)
        tokenized_corpus.append(tokenize(expanded))
        service_ids.append(s.service_id)

    bm25 = BM25Okapi(tokenized_corpus)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("wb") as fh:
        pickle.dump(
            {"bm25": bm25, "service_ids": service_ids, "tokenized_corpus": tokenized_corpus},
            fh,
        )
    logger.info("BM25 index written: %d services -> %s", len(service_ids), output_path)
    return bm25, service_ids


def main() -> None:
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
    services = load_services()
    logger.info("Loaded %d services from %s", len(services), DATA_PROCESSED)
    build_chroma_index(services)
    build_bm25_index(services)
    logger.info("Done. Chroma at %s, BM25 at %s", CHROMA_PERSIST_DIR, BM25_INDEX_PATH)


if __name__ == "__main__":
    main()
