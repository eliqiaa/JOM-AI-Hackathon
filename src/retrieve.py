"""Phase 7 — hybrid retrieval + metadata filter + LLM rerank + confidence.

Public API consumed by the chatbot engineer:

    retrieve_services(query, user_context=None, top_k=3) -> RetrievalResult

The contract (UserContext / RetrievedService / RetrievalResult) is stable.
Pipeline:

    query
      ├─ dense leg (Chroma cosine on rich_description)        → top 10
      └─ BM25 leg  (rank_bm25 on name+agency+desc+expansions)  → top 10
                 │
                 └── RRF fuse (k=60) → top 10
                                │
                                └── Metadata filter (UserContext, opt)
                                          │
                                          └── LLM rerank (gpt-4o-mini)
                                                    → top_k + justifications
                                                    → confidence_low = top_score < 0.3

If `OPENAI_API_KEY` is unset or the reranker call fails, the pipeline
falls back to RRF (post-filter) order with `confidence_low=False`. If
`user_context` filters everything out, returns empty + `confidence_low=
True` with `reason=unmet_user_context` so the caller can either relax
the filter or escalate.
"""

from __future__ import annotations

import logging
import pickle
import sys
from functools import lru_cache
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field
from rank_bm25 import BM25Okapi

from src.acronyms import expand_acronyms
from src.config import (
    BM25_INDEX_PATH,
    CHROMA_COLLECTION_NAME,
    CHROMA_PERSIST_DIR,
)
from src.ingest import tokenize, unflatten_service_from_chroma
from src.rerank import CONFIDENCE_THRESHOLD, is_available as reranker_available, rerank
from src.schema import Service

# chromadb 0.5.x posthog telemetry spams ERROR logs — same silencer as ingest.
logging.getLogger("chromadb.telemetry.product.posthog").setLevel(logging.CRITICAL)

logger = logging.getLogger(__name__)

# Pool size from both retrieval legs feeding into RRF, and from RRF into
# the reranker. Matches the brief.
_CANDIDATE_POOL = 10

# Standard RRF k. Cormack/Clarke 2009 found 60 robust across collections.
_RRF_K = 60

_STRICT = ConfigDict(extra="forbid")


class UserContext(BaseModel):
    """Optional signals the chatbot may extract from conversation.

    Phase 7 uses `citizenship` and `age` for hard eligibility filtering
    (a foreigner asking about citizen-only schemes shouldn't see them).
    `employment_status` is recorded but not filtered on yet — most
    services list 3-5 statuses, so a hard filter is too noisy. The
    reranker can use the conversation context softly instead."""

    model_config = _STRICT

    citizenship: Literal["citizen", "PR", "foreigner"] | None = None
    age: int | None = None
    employment_status: str | None = None


class RetrievedService(BaseModel):
    """One result for the chatbot. The chatbot reads `service.*` fields
    *directly* — required_documents, oth_location, operating_hours,
    source_url — and does not re-parse rich_description."""

    model_config = _STRICT

    service: Service
    relevance_score: float
    rerank_justification: str | None = None


class RetrievalResult(BaseModel):
    model_config = _STRICT

    services: list[RetrievedService]
    confidence_low: bool
    query_decomposition: list[str]
    debug_info: dict[str, Any] = Field(default_factory=dict)


# ---------- index access (lazy singletons) ----------------------------------


@lru_cache(maxsize=1)
def _get_collection():
    """First call loads the ONNX MiniLM model (~80MB); subsequent calls
    reuse the same handle."""
    import chromadb
    from chromadb.utils.embedding_functions import DefaultEmbeddingFunction

    client = chromadb.PersistentClient(path=str(CHROMA_PERSIST_DIR))
    return client.get_or_create_collection(
        name=CHROMA_COLLECTION_NAME,
        embedding_function=DefaultEmbeddingFunction(),
    )


@lru_cache(maxsize=1)
def _get_bm25() -> tuple[BM25Okapi, list[str]]:
    """Load the pickled BM25 index produced by `src.ingest`."""
    with BM25_INDEX_PATH.open("rb") as fh:
        payload = pickle.load(fh)
    return payload["bm25"], payload["service_ids"]


# ---------- per-leg retrieval -----------------------------------------------


def _dense_search(query: str, n: int) -> list[tuple[Service, float, float]]:
    """Return (service, similarity, distance) triples ordered best-first."""
    collection = _get_collection()
    pool = min(n, collection.count())
    if pool == 0:
        return []
    res = collection.query(
        query_texts=[query],
        n_results=pool,
        include=["metadatas", "distances"],
    )
    out: list[tuple[Service, float, float]] = []
    for meta, dist in zip(res["metadatas"][0], res["distances"][0], strict=True):
        service = unflatten_service_from_chroma(meta)
        similarity = max(0.0, min(1.0, 1.0 - dist))
        out.append((service, similarity, dist))
    return out


def _bm25_search(query: str, n: int) -> list[tuple[str, float]]:
    """Return (service_id, bm25_score) pairs ordered best-first, length <= n.

    Applies the same acronym expansion as ingest, so query-side and
    corpus-side expansions are symmetric."""
    bm25, service_ids = _get_bm25()
    expanded = expand_acronyms(query)
    tokens = tokenize(expanded)
    if not tokens:
        return []
    scores = bm25.get_scores(tokens)
    ranked = sorted(zip(service_ids, scores, strict=True), key=lambda x: x[1], reverse=True)
    return ranked[:n]


# ---------- fusion ----------------------------------------------------------


def _rrf_fuse(
    *ranked_id_lists: list[str],
    k: int = _RRF_K,
    n: int = _CANDIDATE_POOL,
) -> list[tuple[str, float, dict[int, int]]]:
    """Reciprocal Rank Fusion.

    Each input is an ordered list of service_ids (best first). Each list
    contributes 1 / (k + rank) per id; ids not in a list contribute 0
    from that list. Returns `[(service_id, fused_score, ranks_per_list)]`
    sorted best-first, truncated to `n`."""
    ranks_by_id: dict[str, dict[int, int]] = {}
    scores: dict[str, float] = {}
    for list_idx, ranked in enumerate(ranked_id_lists):
        for zero_based, service_id in enumerate(ranked):
            rank = zero_based + 1
            ranks_by_id.setdefault(service_id, {})[list_idx] = rank
            scores[service_id] = scores.get(service_id, 0.0) + 1.0 / (k + rank)
    ordered = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    return [(sid, score, ranks_by_id[sid]) for sid, score in ordered[:n]]


# ---------- public API ------------------------------------------------------


def _materialize_fused_services(
    fused: list[tuple[str, float, dict[int, int]]],
    dense_by_id: dict[str, Service],
) -> list[Service]:
    """Return Service objects in fused order.

    BM25-only ids are batch-fetched from Chroma. Pure read — does not
    mutate `dense_by_id`; callers can build their own id->service map
    from the returned list when they need lookup."""
    out: list[Service] = []
    missing_ids = [sid for sid, _, _ in fused if sid not in dense_by_id]
    fetched: dict[str, Service] = {}
    if missing_ids:
        got = _get_collection().get(ids=missing_ids)
        for meta in got["metadatas"]:
            svc = unflatten_service_from_chroma(meta)
            fetched[svc.service_id] = svc
    for sid, _, _ in fused:
        out.append(dense_by_id.get(sid) or fetched[sid])
    return out


def _filter_by_user_context(
    services: list[Service],
    ctx: UserContext,
) -> tuple[list[Service], list[tuple[str, str]]]:
    """Drop services the user is structurally ineligible for.

    Returns `(kept, dropped_with_reasons)` so the caller can surface the
    drops in `debug_info` — useful for explaining to the chatbot why a
    service the user mentioned by name didn't appear. A field of `None`
    on `ctx` skips that check entirely; a missing constraint on the
    service (e.g. `age_max=None`) means "no upper bound"."""
    kept: list[Service] = []
    dropped: list[tuple[str, str]] = []
    for svc in services:
        elig = svc.eligibility
        if ctx.citizenship is not None and ctx.citizenship not in elig.citizenship:
            dropped.append(
                (svc.service_id, f"citizenship {ctx.citizenship!r} not in {elig.citizenship}")
            )
            continue
        if ctx.age is not None:
            if elig.age_min is not None and ctx.age < elig.age_min:
                dropped.append(
                    (svc.service_id, f"age {ctx.age} < age_min {elig.age_min}")
                )
                continue
            if elig.age_max is not None and ctx.age > elig.age_max:
                dropped.append(
                    (svc.service_id, f"age {ctx.age} > age_max {elig.age_max}")
                )
                continue
        kept.append(svc)
    return kept, dropped


def retrieve_services(
    query: str,
    user_context: UserContext | None = None,
    top_k: int = 3,
) -> RetrievalResult:
    """Main entry point for the chatbot engineer.

    Takes a natural-language query, returns structured service data. The
    chatbot LLM reads `RetrievedService.service.*` fields directly — do
    not re-parse `rich_description` for documents or eligibility.
    """
    if not query or not query.strip():
        return RetrievalResult(
            services=[],
            confidence_low=True,
            query_decomposition=[],
            debug_info={"reason": "empty_query"},
        )

    processed = query.strip()

    # --- Hybrid retrieval -------------------------------------------------
    dense_candidates = _dense_search(processed, n=_CANDIDATE_POOL)
    bm25_candidates = _bm25_search(processed, n=_CANDIDATE_POOL)

    dense_ids = [svc.service_id for svc, _, _ in dense_candidates]
    bm25_ids = [sid for sid, _ in bm25_candidates]
    fused = _rrf_fuse(dense_ids, bm25_ids, k=_RRF_K, n=_CANDIDATE_POOL)

    dense_by_id: dict[str, Service] = {svc.service_id: svc for svc, _, _ in dense_candidates}
    fused_services = _materialize_fused_services(fused, dense_by_id)

    # --- Eligibility filter (optional) ------------------------------------
    pre_filter_count = len(fused_services)
    dropped_by_filter: list[tuple[str, str]] = []
    if user_context is not None:
        fused_services, dropped_by_filter = _filter_by_user_context(
            fused_services, user_context
        )

    # --- Rerank (optional) ------------------------------------------------
    # Only rerank what survived the filter — saves tokens and prevents
    # the LLM from picking an ineligible service.
    rerank_items = rerank(query=processed, candidates=fused_services)
    is_reranker_on = reranker_available()

    # Defensive: id-allowlist filter. `rerank._parse_response` already
    # does this against the truncated candidate list; this catches
    # post-filter mismatches and lets test doubles stay simple.
    fused_by_id = {svc.service_id: svc for svc in fused_services}
    rerank_items = [it for it in rerank_items if it.service_id in fused_by_id]

    debug_info: dict[str, Any] = {
        "preprocessed_query": processed,
        "dense_candidates": [
            {"service_id": svc.service_id, "similarity": sim, "distance": dist}
            for svc, sim, dist in dense_candidates
        ],
        "bm25_candidates": [
            {"service_id": sid, "bm25_score": score} for sid, score in bm25_candidates
        ],
        "rrf_fused": [
            {
                "service_id": sid,
                "rrf_score": score,
                "dense_rank": ranks.get(0),
                "bm25_rank": ranks.get(1),
            }
            for sid, score, ranks in fused
        ],
        "reranker_available": is_reranker_on,
        "user_context_received": user_context is not None,
        "filter_pre_count": pre_filter_count,
        "filter_post_count": len(fused_services),
        "filter_dropped": [
            {"service_id": sid, "reason": reason} for sid, reason in dropped_by_filter
        ],
    }

    # If the filter removed everything, surface that explicitly so the
    # chatbot can either relax the filter or escalate. We do NOT silently
    # show ineligible services.
    if user_context is not None and not fused_services:
        return RetrievalResult(
            services=[],
            confidence_low=True,
            query_decomposition=[processed],
            debug_info={**debug_info, "reason": "unmet_user_context"},
        )

    debug_info["confidence_threshold"] = CONFIDENCE_THRESHOLD

    if rerank_items:
        # Reranker spoke — its order + scores are authoritative.
        services_out = [
            RetrievedService(
                service=fused_by_id[it.service_id],
                relevance_score=it.score,
                rerank_justification=it.justification or None,
            )
            for it in rerank_items[:top_k]
        ]
        top_score = rerank_items[0].score
        confidence_low = top_score < CONFIDENCE_THRESHOLD
        debug_info["rerank_items"] = [
            {"service_id": it.service_id, "score": it.score, "justification": it.justification}
            for it in rerank_items
        ]
        debug_info["rerank_top_score"] = top_score
    else:
        # Fall back to post-filter RRF order — never include a service
        # the filter dropped. We don't claim a confidence verdict
        # without the semantic signal.
        rrf_score_by_id = {sid: score for sid, score, _ in fused}
        services_out = [
            RetrievedService(
                service=svc,
                relevance_score=rrf_score_by_id[svc.service_id],
                rerank_justification=None,
            )
            for svc in fused_services[:top_k]
        ]
        confidence_low = False
        debug_info["rerank_items"] = []
        debug_info["rerank_top_score"] = None

    return RetrievalResult(
        services=services_out,
        confidence_low=confidence_low,
        query_decomposition=[processed],
        debug_info=debug_info,
    )


# ---------- manual CLI smoke ------------------------------------------------


def _cli() -> None:
    """Manual smoke:  python -m src.retrieve "kena retrenched cannot pay HDB" """
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
    if len(sys.argv) < 2:
        print('usage: python -m src.retrieve "<query>"')
        sys.exit(2)
    query = " ".join(sys.argv[1:])
    result = retrieve_services(query)
    print(f"\nquery: {query!r}")
    print(f"confidence_low: {result.confidence_low}")
    print(f"reranker_available: {result.debug_info.get('reranker_available')}\n")
    for i, r in enumerate(result.services, 1):
        print(f"  #{i}  {r.service.service_id}  {r.service.service_name}")
        print(f"        score={r.relevance_score:.4f}   {r.service.oth_location}")
        if r.rerank_justification:
            print(f"        why:  {r.rerank_justification}")

    print("\ndebug.dense_candidates:")
    for c in result.debug_info["dense_candidates"]:
        print(f"  {c['service_id']:10s}  sim={c['similarity']:.4f}")
    print("\ndebug.bm25_candidates:")
    for c in result.debug_info["bm25_candidates"]:
        print(f"  {c['service_id']:10s}  bm25={c['bm25_score']:.4f}")
    print("\ndebug.rrf_fused:")
    for c in result.debug_info["rrf_fused"]:
        d = c["dense_rank"] if c["dense_rank"] is not None else "-"
        b = c["bm25_rank"] if c["bm25_rank"] is not None else "-"
        print(f"  {c['service_id']:10s}  rrf={c['rrf_score']:.6f}  (dense={d}, bm25={b})")
    if result.debug_info.get("rerank_items"):
        print("\ndebug.rerank_items:")
        for r in result.debug_info["rerank_items"]:
            print(f"  {r['service_id']:10s}  score={r['score']:.3f}  | {r['justification']}")


if __name__ == "__main__":
    _cli()
