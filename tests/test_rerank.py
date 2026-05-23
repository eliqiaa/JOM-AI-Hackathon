"""Phase 6 reranker unit tests.

No network calls — `_build_prompt` and `_parse_response` are pure
functions; `rerank()` is exercised against monkey-patched clients.
"""

from __future__ import annotations

import json

import pytest

from src import rerank as rerank_mod
from src.ingest import load_services
from src.rerank import RerankItem, _build_prompt, _parse_response, rerank
from src.schema import Service


@pytest.fixture
def services() -> list[Service]:
    return load_services()


# ---------- _build_prompt ---------------------------------------------------


def test_prompt_contains_query_and_every_candidate(services: list[Service]):
    prompt = _build_prompt("I lost my job and need help", services)
    assert "I lost my job and need help" in prompt
    for s in services:
        assert s.service_id in prompt
        assert s.service_name in prompt
        # rich_description is the actual reranker signal — must be present
        assert s.rich_description[:60] in prompt


def test_prompt_specifies_json_response_format(services: list[Service]):
    prompt = _build_prompt("query", services[:1])
    assert "JSON" in prompt
    assert "service_id" in prompt
    assert "score" in prompt
    assert "justification" in prompt


def test_prompt_specifies_out_of_scope_behavior(services: list[Service]):
    prompt = _build_prompt("query", services[:1])
    assert "out-of-scope" in prompt
    assert "< 0.3" in prompt


# ---------- _parse_response -------------------------------------------------


def test_parse_well_formed_response():
    content = json.dumps(
        {
            "results": [
                {"service_id": "MSF-001", "score": 0.9, "justification": "Strong match"},
                {"service_id": "WSG-001", "score": 0.3, "justification": "Tangential"},
            ]
        }
    )
    items = _parse_response(content, {"MSF-001", "WSG-001", "HDB-001"})
    assert len(items) == 2
    assert items[0] == RerankItem("MSF-001", 0.9, "Strong match")
    assert items[1] == RerankItem("WSG-001", 0.3, "Tangential")


def test_parse_clamps_scores_outside_range():
    content = json.dumps(
        {
            "results": [
                {"service_id": "A", "score": 1.5, "justification": ""},
                {"service_id": "B", "score": -0.4, "justification": ""},
            ]
        }
    )
    items = _parse_response(content, {"A", "B"})
    assert items[0].score == 1.0
    assert items[1].score == 0.0


def test_parse_drops_unknown_service_ids():
    content = json.dumps(
        {"results": [{"service_id": "GHOST-999", "score": 0.7, "justification": ""}]}
    )
    assert _parse_response(content, {"REAL-001"}) == []


def test_parse_dedupes_repeated_ids():
    content = json.dumps(
        {
            "results": [
                {"service_id": "A", "score": 0.8, "justification": "first"},
                {"service_id": "A", "score": 0.9, "justification": "duplicate"},
            ]
        }
    )
    items = _parse_response(content, {"A"})
    assert len(items) == 1
    assert items[0].justification == "first"


def test_parse_garbage_returns_empty():
    assert _parse_response("not json at all", {"A"}) == []
    assert _parse_response(json.dumps({"no": "results key"}), {"A"}) == []
    assert _parse_response(json.dumps({"results": "not a list"}), {"A"}) == []


def test_parse_skips_entries_with_non_numeric_score():
    content = json.dumps(
        {
            "results": [
                {"service_id": "A", "score": "high", "justification": "bad"},
                {"service_id": "B", "score": 0.5, "justification": "good"},
            ]
        }
    )
    items = _parse_response(content, {"A", "B"})
    assert len(items) == 1
    assert items[0].service_id == "B"


# ---------- rerank() with patched client -----------------------------------


def test_rerank_returns_empty_without_client(monkeypatch, services):
    monkeypatch.setattr(rerank_mod, "_get_client", lambda: None)
    assert rerank("any query", services) == []


def test_rerank_returns_empty_for_empty_candidates(monkeypatch):
    class _FakeClient:
        pass

    monkeypatch.setattr(rerank_mod, "_get_client", lambda: _FakeClient())
    assert rerank("any query", []) == []


def test_rerank_sorts_results_descending(monkeypatch, services):
    """Even if the LLM returns items out of order, we sort them."""
    payload = json.dumps(
        {
            "results": [
                {"service_id": services[0].service_id, "score": 0.4, "justification": "mid"},
                {"service_id": services[1].service_id, "score": 0.9, "justification": "top"},
                {"service_id": services[2].service_id, "score": 0.1, "justification": "low"},
            ]
        }
    )

    class _FakeChoice:
        def __init__(self, content):
            self.message = type("M", (), {"content": content})

    class _FakeChat:
        def create(self, **kw):
            return type("R", (), {"choices": [_FakeChoice(payload)]})

    class _FakeCompletions:
        completions = _FakeChat()

    class _FakeClient:
        chat = _FakeCompletions()

    monkeypatch.setattr(rerank_mod, "_get_client", lambda: _FakeClient())
    items = rerank("a query", services)
    assert [i.score for i in items] == [0.9, 0.4, 0.1]
    assert items[0].service_id == services[1].service_id


def test_rerank_swallows_api_exceptions(monkeypatch, services):
    """If the OpenAI call throws, we return [] so the caller falls back."""

    class _BoomChat:
        def create(self, **kw):
            raise RuntimeError("rate limited")

    class _BoomCompletions:
        completions = _BoomChat()

    class _BoomClient:
        chat = _BoomCompletions()

    monkeypatch.setattr(rerank_mod, "_get_client", lambda: _BoomClient())
    assert rerank("a query", services) == []
