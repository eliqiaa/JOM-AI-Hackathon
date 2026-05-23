"""Phase 9 — evaluation harness.

Reads `tests/golden_set.json`, runs every labelled query through
`retrieve_services`, and computes:

- Recall@3, Recall@5: fraction of non-OOS queries where at least one
  `expected_top_ids` appears in the top-K
- MRR: mean reciprocal rank of the FIRST matching expected id within
  top-5 (0 if none of the expected ids are in top-5)
- OOS rejection rate: fraction of OOS queries where `confidence_low`
  fires (only reliably non-zero when the LLM reranker is enabled, since
  the below-threshold trigger lives there)

Targets (per the brief): Recall@3 ≥ 0.85, OOS rejection = 1.0.

Usage:
    python -m src.evaluate                 # uses tests/golden_set.json
    python -m src.evaluate --golden P.json # alternate set
    python -m src.evaluate --json          # machine-readable summary
"""

from __future__ import annotations

import argparse
import json
import logging
import sys
from dataclasses import dataclass
from pathlib import Path

from src.retrieve import RetrievalResult, UserContext, retrieve_services

GOLDEN_PATH = Path(__file__).resolve().parent.parent / "tests" / "golden_set.json"

RECALL_AT_3_TARGET = 0.85
OOS_TARGET = 1.0


@dataclass
class QueryResult:
    """One golden-set query's measured outcome."""
    id: str
    query: str
    category: str
    expected_top_ids: list[str]
    expect_oos: bool
    top_ids: list[str]
    confidence_low: bool
    reranker_available: bool
    first_match_rank: int | None
    in_top_3: bool
    in_top_5: bool
    oos_correct: bool | None


def _load_golden(path: Path) -> dict:
    with path.open(encoding="utf-8") as fh:
        return json.load(fh)


def _build_user_context(raw: dict | None) -> UserContext | None:
    if not raw:
        return None
    return UserContext(**raw)


def _score_query(entry: dict) -> QueryResult:
    """Run one golden-set query end-to-end and measure outcomes."""
    ctx = _build_user_context(entry.get("user_context"))
    result: RetrievalResult = retrieve_services(
        entry["query"], user_context=ctx, top_k=5
    )
    top_ids = [r.service.service_id for r in result.services]
    expected = entry["expected_top_ids"]
    expect_oos = bool(entry["expect_oos"])

    first_match_rank: int | None = None
    for i, sid in enumerate(top_ids, 1):
        if sid in expected:
            first_match_rank = i
            break

    in_top_3 = first_match_rank is not None and first_match_rank <= 3
    in_top_5 = first_match_rank is not None and first_match_rank <= 5

    oos_correct: bool | None = None
    if expect_oos:
        oos_correct = bool(result.confidence_low)

    return QueryResult(
        id=entry["id"],
        query=entry["query"],
        category=entry["category"],
        expected_top_ids=expected,
        expect_oos=expect_oos,
        top_ids=top_ids,
        confidence_low=bool(result.confidence_low),
        reranker_available=bool(result.debug_info.get("reranker_available")),
        first_match_rank=first_match_rank,
        in_top_3=in_top_3,
        in_top_5=in_top_5,
        oos_correct=oos_correct,
    )


def _aggregate(results: list[QueryResult]) -> dict:
    """Mean Recall@3/@5, MRR over non-OOS queries; OOS-rejection over OOS."""
    non_oos = [r for r in results if not r.expect_oos]
    oos = [r for r in results if r.expect_oos]

    recall_at_3 = (
        sum(1 for r in non_oos if r.in_top_3) / len(non_oos) if non_oos else 0.0
    )
    recall_at_5 = (
        sum(1 for r in non_oos if r.in_top_5) / len(non_oos) if non_oos else 0.0
    )
    mrr = (
        sum(1.0 / r.first_match_rank for r in non_oos if r.first_match_rank)
        / len(non_oos)
        if non_oos
        else 0.0
    )
    oos_rejection = (
        sum(1 for r in oos if r.oos_correct) / len(oos) if oos else 0.0
    )

    return {
        "n_total": len(results),
        "n_non_oos": len(non_oos),
        "n_oos": len(oos),
        "recall_at_3": recall_at_3,
        "recall_at_5": recall_at_5,
        "mrr": mrr,
        "oos_rejection_rate": oos_rejection,
    }


def _print_per_query(results: list[QueryResult]) -> None:
    print("\nPer-query results")
    print("-" * 80)
    for r in results:
        if r.expect_oos:
            mark = "OK" if r.oos_correct else "FAIL"
            print(
                f"  {mark:4s} {r.id} [{r.category:13s}] OOS   confidence_low={r.confidence_low}"
                f"  top1={r.top_ids[0] if r.top_ids else '-'}"
            )
        else:
            if r.in_top_3:
                mark = "OK"
            elif r.in_top_5:
                mark = "WARN"
            else:
                mark = "FAIL"
            rank_str = f"@{r.first_match_rank}" if r.first_match_rank else "miss"
            print(
                f"  {mark:4s} {r.id} [{r.category:13s}] {rank_str:5s}"
                f"  expected={r.expected_top_ids}"
                f"  top3={r.top_ids[:3]}"
            )


def _print_summary(agg: dict) -> None:
    print("\nAggregate")
    print("-" * 80)
    print(f"  total queries:        {agg['n_total']}")
    print(f"  non-OOS queries:      {agg['n_non_oos']}")
    print(f"  OOS queries:          {agg['n_oos']}")
    print(f"  Recall@3:             {agg['recall_at_3']:.3f}   (target >= {RECALL_AT_3_TARGET:.2f})")
    print(f"  Recall@5:             {agg['recall_at_5']:.3f}")
    print(f"  MRR:                  {agg['mrr']:.3f}")
    print(f"  OOS rejection rate:   {agg['oos_rejection_rate']:.3f}   (target = {OOS_TARGET:.2f})")


def _category_breakdown(results: list[QueryResult]) -> None:
    """Per-category Recall@3 to surface which slice is weak."""
    print("\nBy category (non-OOS)")
    print("-" * 80)
    cats: dict[str, list[QueryResult]] = {}
    for r in results:
        if r.expect_oos:
            continue
        cats.setdefault(r.category, []).append(r)
    for cat, rs in sorted(cats.items()):
        n = len(rs)
        ok = sum(1 for r in rs if r.in_top_3)
        print(f"  {cat:14s}  {ok}/{n}  Recall@3={ok/n:.3f}")


def _did_pass(agg: dict, reranker_seen: bool) -> bool:
    """OOS rejection requires the LLM reranker; without it, only Recall counts."""
    if agg["recall_at_3"] < RECALL_AT_3_TARGET:
        return False
    if agg["n_oos"] > 0 and reranker_seen:
        return agg["oos_rejection_rate"] >= OOS_TARGET
    return True


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Digital OTH retrieval eval")
    parser.add_argument(
        "--golden", type=Path, default=GOLDEN_PATH,
        help=f"path to golden set JSON (default: {GOLDEN_PATH})",
    )
    parser.add_argument(
        "--json", action="store_true",
        help="emit machine-readable JSON summary (single line) and exit",
    )
    args = parser.parse_args(argv)

    logging.basicConfig(level=logging.WARNING, format="%(levelname)s %(message)s")

    golden = _load_golden(args.golden)
    queries = golden["queries"]
    print(f"Loaded {len(queries)} queries from {args.golden}")

    results = [_score_query(q) for q in queries]
    agg = _aggregate(results)
    reranker_seen = any(r.reranker_available for r in results)

    if args.json:
        print(json.dumps({"summary": agg, "reranker_available": reranker_seen}))
        return 0 if _did_pass(agg, reranker_seen) else 1

    _print_per_query(results)
    _category_breakdown(results)
    _print_summary(agg)

    if not reranker_seen and agg["n_oos"] > 0:
        print(
            "\nNote: OPENAI_API_KEY not set - reranker disabled. The OOS rejection\n"
            "metric requires the LLM (the 'below threshold' confidence_low trigger\n"
            "lives in rerank.py). Set OPENAI_API_KEY and re-run to score OOS."
        )

    passed = _did_pass(agg, reranker_seen)
    print(f"\nVerdict: {'PASS' if passed else 'FAIL'}")
    return 0 if passed else 1


if __name__ == "__main__":
    sys.exit(main())
