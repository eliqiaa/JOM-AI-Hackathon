"""Phase 6 — LLM-based reranker over the RRF top-N.

Sends `(query, [top-10 services])` to gpt-4o-mini and gets back a per-
candidate (score, justification). The top reranked score drives the
`confidence_low` flag in `retrieve_services` — if the LLM rates the best
candidate poorly, the chatbot escalates to a human/hotline.

Why a reranker on top of hybrid retrieval:
- RRF gives a strong recall-oriented top-N, but its score is geometric
  (rank-based), not semantic. It can't tell "perfect match" from
  "vaguely related".
- The LLM has the full query semantics and can reason about negation,
  multi-intent, and out-of-scope cases that BM25 + cosine cannot.
- The per-result justifications are also a nice debug + demo affordance
  (judges see *why* each result was picked).

Graceful degradation: if `OPENAI_API_KEY` is missing or the API call
fails, `rerank()` returns `[]` and `retrieve_services` falls back to
RRF order with `confidence_low=False`. Phase 5 still works without an
API key; Phase 6 just won't be active.
"""

from __future__ import annotations

import json
import logging
from dataclasses import dataclass
from functools import lru_cache

from openai import OpenAI

from src.config import Settings
from src.schema import Service

logger = logging.getLogger(__name__)

# Per brief. Cheap, fast, native JSON-mode support (response_format).
_MODEL = "gpt-4o-mini"

# How many RRF candidates we send to the LLM. More burns tokens for
# diminishing returns; 10 matches the brief.
RERANK_CANDIDATE_LIMIT = 10

# If the top reranked score is below this, mark the whole result as
# low-confidence so the chatbot can escalate. Matches the "poor match"
# cutoff we tell the LLM about in the prompt.
CONFIDENCE_THRESHOLD = 0.3


@dataclass(frozen=True)
class RerankItem:
    """One LLM verdict per candidate. Returned in descending-score order."""

    service_id: str
    score: float          # 0.0 - 1.0
    justification: str    # one short sentence


@lru_cache(maxsize=1)
def _get_client() -> OpenAI | None:
    """Lazy singleton. Returns None if no API key is configured — callers
    must handle this without crashing (Phase 6 is optional)."""
    settings = Settings()
    if not settings.openai_api_key:
        logger.info("OPENAI_API_KEY not set; reranker disabled (RRF order only).")
        return None
    return OpenAI(api_key=settings.openai_api_key)


def is_available() -> bool:
    return _get_client() is not None


def _build_prompt(query: str, candidates: list[Service]) -> str:
    blocks: list[str] = []
    for i, c in enumerate(candidates, 1):
        blocks.append(
            f"[{i}] service_id={c.service_id}  agency={c.agency}\n"
            f"    name: {c.service_name}\n"
            f"    description: {c.rich_description}"
        )
    candidate_section = "\n\n".join(blocks)
    return f"""You evaluate which Singapore government services best match a resident's query.

QUERY: "{query}"

CANDIDATES:
{candidate_section}

Return JSON ONLY in this exact shape — no prose, no markdown:
{{
  "results": [
    {{"service_id": "...", "score": 0.95, "justification": "one short sentence"}},
    ...
  ]
}}

Scoring rules:
- score is a float from 0.0 to 1.0 — how well does this service answer the query?
  - 0.7 - 1.0  strong match (clearly designed for this situation)
  - 0.4 - 0.69 partial match (related but not the primary service)
  - 0.0 - 0.39 poor match (off-topic, wrong life stage, wrong audience, or out-of-scope)
- justification: ONE short sentence, max 20 words, explaining the score
- Include EVERY candidate in the results array; order by score descending
- If the QUERY is out-of-scope (e.g. food court hours, weather, tourism), give ALL candidates score < 0.3
"""


def _parse_response(content: str, expected_ids: set[str]) -> list[RerankItem]:
    """Parse the LLM JSON response. Tolerate missing/extra ids; clamp scores."""
    try:
        data = json.loads(content)
    except json.JSONDecodeError as e:
        logger.warning("Reranker JSON parse failed: %s | content=%.200s", e, content)
        return []

    raw_results = data.get("results")
    if not isinstance(raw_results, list):
        logger.warning("Reranker response missing 'results' list: %.200s", content)
        return []

    items: list[RerankItem] = []
    seen: set[str] = set()
    for entry in raw_results:
        if not isinstance(entry, dict):
            continue
        sid = entry.get("service_id")
        if sid not in expected_ids or sid in seen:
            continue
        try:
            score = float(entry.get("score", 0.0))
        except (TypeError, ValueError):
            continue
        score = max(0.0, min(1.0, score))
        justification = str(entry.get("justification") or "").strip()
        items.append(RerankItem(service_id=sid, score=score, justification=justification))
        seen.add(sid)
    return items


def rerank(query: str, candidates: list[Service]) -> list[RerankItem]:
    """Rerank `candidates` for `query`. Returns sorted-desc items, or `[]`
    if the reranker is unavailable or the call failed.

    Callers (retrieve.py) treat `[]` as "fall back to upstream order".
    """
    client = _get_client()
    if client is None or not candidates:
        return []

    truncated = candidates[:RERANK_CANDIDATE_LIMIT]
    prompt = _build_prompt(query, truncated)

    try:
        response = client.chat.completions.create(
            model=_MODEL,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.0,
        )
    except Exception as e:
        logger.warning("Reranker API call failed: %s", e)
        return []

    content = response.choices[0].message.content or ""
    expected_ids = {c.service_id for c in truncated}
    items = _parse_response(content, expected_ids)
    items.sort(key=lambda x: x.score, reverse=True)
    return items
