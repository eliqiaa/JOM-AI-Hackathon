"""Ingestion tests. No API key required — embeddings are local (sentence-transformers via Chroma)."""

from __future__ import annotations

import pickle
from pathlib import Path

import pytest

from src.ingest import (
    build_bm25_index,
    build_chroma_index,
    flatten_service_for_chroma,
    load_services,
    tokenize,
    unflatten_service_from_chroma,
)
from src.schema import Service


@pytest.fixture
def services() -> list[Service]:
    return load_services()


def test_load_services_returns_at_least_three(services: list[Service]):
    assert len(services) >= 3
    assert all(isinstance(s, Service) for s in services)
    ids = [s.service_id for s in services]
    assert ids == sorted(ids)


def test_flatten_unflatten_round_trip(services: list[Service]):
    for s in services:
        flat = flatten_service_for_chroma(s)
        for k, v in flat.items():
            assert isinstance(v, (str, int, float, bool)), f"{k} is {type(v).__name__}"
        rebuilt = unflatten_service_from_chroma(flat)
        assert rebuilt == s


def test_tokenize_basic():
    assert tokenize("Hello, World!") == ["hello", "world"]
    assert tokenize("HDB BTO 2026") == ["hdb", "bto", "2026"]
    assert tokenize("") == []


def test_bm25_build_and_query(services: list[Service], tmp_path: Path):
    output = tmp_path / "bm25.pkl"
    bm25, service_ids = build_bm25_index(services, output_path=output)
    assert output.exists()
    assert len(service_ids) == len(services)

    with output.open("rb") as fh:
        loaded = pickle.load(fh)
    assert loaded["service_ids"] == service_ids

    scores = bm25.get_scores(tokenize("HDB mortgage"))
    top_idx = scores.argmax()
    assert service_ids[top_idx] == "HDB-001"


def test_bm25_uses_acronym_expander(services: list[Service], tmp_path: Path):
    """The expander is called once per service; its output is what gets tokenized."""
    calls: list[str] = []

    def spy(text: str) -> str:
        calls.append(text)
        return text + " EXTRATOKEN"

    output = tmp_path / "bm25.pkl"
    bm25, _ = build_bm25_index(services, output_path=output, acronym_expander=spy)

    assert len(calls) == len(services)
    scores = bm25.get_scores(tokenize("extratoken"))
    assert all(s > 0 for s in scores)


def test_chroma_idempotent(services: list[Service], tmp_path: Path):
    """Two consecutive ingests must not duplicate documents."""
    persist = tmp_path / "chroma"
    collection_name = "test_idempotent"

    build_chroma_index(services, persist_dir=persist, collection_name=collection_name)
    first_count = len(services)

    collection = build_chroma_index(services, persist_dir=persist, collection_name=collection_name)
    assert collection.count() == first_count

    fetched = collection.get(ids=[s.service_id for s in services])
    assert sorted(fetched["ids"]) == sorted(s.service_id for s in services)


def test_chroma_metadata_round_trips_through_collection(services: list[Service], tmp_path: Path):
    """Pull a service back out via Chroma's `get` and unflatten — should equal original."""
    collection = build_chroma_index(
        services,
        persist_dir=tmp_path / "chroma",
        collection_name="test_roundtrip",
    )
    target = services[0]
    got = collection.get(ids=[target.service_id])
    assert got["ids"] == [target.service_id]
    rebuilt = unflatten_service_from_chroma(got["metadatas"][0])
    assert rebuilt == target


def test_chroma_semantic_query(services: list[Service], tmp_path: Path):
    """Semantic query routes the mortgage-loss prompt to HDB or MSF in top results."""
    collection = build_chroma_index(
        services,
        persist_dir=tmp_path / "chroma",
        collection_name="test_semantic",
    )
    query = "I lost my job and need help paying my mortgage"
    results = collection.query(query_texts=[query], n_results=3)
    top_ids = results["ids"][0]
    assert {"HDB-001", "MSF-001"} & set(top_ids), f"unexpected top results: {top_ids}"
