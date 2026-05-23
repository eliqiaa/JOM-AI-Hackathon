"""Phase 6 retrieval tests (hybrid + rerank + confidence threshold).

Hermetic — both the Chroma collection and the BM25 index are built into a
tmp dir, and the module-level lazy loaders in `src.retrieve` are
monkey-patched to return them. The on-disk `chroma_db/` and
`bm25_index.pkl` are never touched. The reranker is auto-stubbed off by
default (returns `[]`) so we don't hit OpenAI during the suite; Phase 6
tests opt in explicitly with `enable_fake_reranker`.
"""

from __future__ import annotations

import pytest

from src import retrieve as retrieve_mod
from src.ingest import build_bm25_index, build_chroma_index, load_services
from src.rerank import CONFIDENCE_THRESHOLD, RerankItem
from src.retrieve import (
    RetrievalResult,
    RetrievedService,
    UserContext,
    _filter_by_user_context,
    _rrf_fuse,
    retrieve_services,
)
from src.schema import Service


# ---------- shared fixtures -------------------------------------------------


@pytest.fixture(scope="module")
def _populated_indices(tmp_path_factory):
    """Build both indices in tmp once per test module."""
    persist = tmp_path_factory.mktemp("retrieve_chroma")
    bm25_path = tmp_path_factory.mktemp("retrieve_bm25") / "bm25.pkl"

    services = load_services()
    collection = build_chroma_index(
        services,
        persist_dir=persist,
        collection_name="test_retrieve_phase6",
    )
    bm25, service_ids = build_bm25_index(services, output_path=bm25_path)
    return collection, bm25, service_ids


@pytest.fixture(autouse=True)
def _patch_loaders(monkeypatch, _populated_indices):
    """Point both lazy loaders at the test indices and **stub the reranker
    off by default** — tests that need an active reranker opt in via
    `enable_fake_reranker`."""
    collection, bm25, service_ids = _populated_indices

    retrieve_mod._get_collection.cache_clear()
    retrieve_mod._get_bm25.cache_clear()
    monkeypatch.setattr(retrieve_mod, "_get_collection", lambda: collection)
    monkeypatch.setattr(retrieve_mod, "_get_bm25", lambda: (bm25, service_ids))
    monkeypatch.setattr(retrieve_mod, "rerank", lambda query, candidates: [])
    monkeypatch.setattr(retrieve_mod, "reranker_available", lambda: False)
    yield


@pytest.fixture
def enable_fake_reranker(monkeypatch):
    """Yields a `set_items(items)` callable for Phase 6 tests."""

    def _setter(items: list[RerankItem]):
        monkeypatch.setattr(retrieve_mod, "rerank", lambda query, candidates: list(items))
        monkeypatch.setattr(retrieve_mod, "reranker_available", lambda: True)

    return _setter


# ---------- _rrf_fuse unit tests --------------------------------------------


def test_rrf_fuse_basic_two_lists():
    fused = _rrf_fuse(["A", "B", "C"], ["A", "C", "B"], k=60, n=3)
    ids = [sid for sid, _, _ in fused]
    assert ids[0] == "A"
    a_entry = next(f for f in fused if f[0] == "A")
    assert a_entry[2] == {0: 1, 1: 1}


def test_rrf_fuse_handles_doc_missing_from_one_list():
    fused = _rrf_fuse(["A", "B"], ["C", "A"], k=60, n=10)
    ids = [sid for sid, _, _ in fused]
    assert set(ids) == {"A", "B", "C"}
    c_entry = next(f for f in fused if f[0] == "C")
    assert c_entry[2] == {1: 1}


def test_rrf_fuse_respects_n_cap():
    fused = _rrf_fuse(["A", "B", "C", "D"], ["E", "F", "G", "H"], n=3)
    assert len(fused) == 3


def test_rrf_fuse_score_formula_matches_k():
    fused = _rrf_fuse(["X"], ["X"], k=60, n=1)
    assert fused[0][0] == "X"
    assert fused[0][1] == pytest.approx(2.0 / 61.0)


def test_rrf_fuse_empty_inputs():
    assert _rrf_fuse([], [], k=60, n=10) == []


# ---------- Smoke routing (reranker OFF, falls back to RRF) -----------------


@pytest.mark.parametrize(
    "query, expected_top_id",
    [
        ("I cannot pay for groceries, rent, and daily expenses", "MSF-001"),
        ("Struggling to keep up with my monthly home loan instalments", "HDB-001"),
        ("I need a career coach to help me find a new job", "WSG-001"),
        ("Going through a divorce and behind on my home loan instalments", "HDB-001"),
        ("Free job matching and resume help for jobseekers", "WSG-001"),
    ],
)
def test_hybrid_routes_query_to_expected_service(query: str, expected_top_id: str):
    result = retrieve_services(query, top_k=3)
    assert result.services
    top_ids = [r.service.service_id for r in result.services]
    assert top_ids[0] == expected_top_id, (
        f"query {query!r}: expected {expected_top_id} at #1, got {top_ids}"
    )


@pytest.mark.parametrize(
    "query, acceptable_top_ids",
    [
        ("behind on HDB loan", ("HDB-001",)),
        # Bare "kena retrenched" without age signal is genuinely ambiguous
        # between general career matching (WSG-001) and mid-career
        # attachment (WSG-003, which emphasises retrenched 40+ workers).
        # Either is a defensible #1. The reranker disambiguates with context.
        ("kena retrenched", ("WSG-001", "WSG-003")),
        ("WSG free career coach for new job", ("WSG-001",)),
    ],
)
def test_acronym_queries_route_correctly(query: str, acceptable_top_ids: tuple[str, ...]):
    result = retrieve_services(query, top_k=3)
    top_id = result.services[0].service.service_id
    assert top_id in acceptable_top_ids, (
        f"query {query!r}: expected one of {acceptable_top_ids} at #1, got {top_id}"
    )


# ---------- Contract / shape ------------------------------------------------


def test_result_shape_is_well_typed():
    result = retrieve_services("I lost my job", top_k=3)
    assert isinstance(result, RetrievalResult)
    assert all(isinstance(r, RetrievedService) for r in result.services)
    for r in result.services:
        assert 0.0 <= r.relevance_score <= 1.0
        assert r.rerank_justification is None  # reranker stubbed off
        assert r.service.service_id
        assert r.service.oth_location
        assert r.service.required_documents


def test_top_k_respected():
    r1 = retrieve_services("financial help", top_k=1)
    r2 = retrieve_services("financial help", top_k=3)
    assert len(r1.services) == 1
    assert len(r2.services) == 3


def test_scores_are_monotonically_non_increasing():
    result = retrieve_services("job search career", top_k=3)
    scores = [r.relevance_score for r in result.services]
    assert scores == sorted(scores, reverse=True)


def test_empty_query_returns_low_confidence_and_no_services():
    result = retrieve_services("   ", top_k=3)
    assert result.services == []
    assert result.confidence_low is True
    assert result.debug_info.get("reason") == "empty_query"


def test_user_context_accepted_and_reflected_in_debug():
    ctx = UserContext(citizenship="citizen", age=42, employment_status="retrenched")
    result = retrieve_services("help me with my mortgage", user_context=ctx)
    assert result.debug_info["user_context_received"] is True
    result_none = retrieve_services("help me with my mortgage")
    assert result_none.debug_info["user_context_received"] is False


def test_debug_info_exposes_all_three_legs():
    result = retrieve_services("financial assistance", top_k=2)
    di = result.debug_info
    for key in ("dense_candidates", "bm25_candidates", "rrf_fused"):
        assert key in di and isinstance(di[key], list)


def test_fallback_relevance_score_equals_fused_score():
    """When reranker is off, relevance_score MUST equal the RRF score —
    this is the contract callers rely on for keyless setups."""
    result = retrieve_services("financial assistance", top_k=3)
    rrf_by_id = {c["service_id"]: c["rrf_score"] for c in result.debug_info["rrf_fused"]}
    for r in result.services:
        assert r.relevance_score == pytest.approx(rrf_by_id[r.service.service_id])


def test_fallback_does_not_set_confidence_low_for_normal_queries():
    """No key / failed reranker → we can't honestly judge confidence,
    so we default to False rather than flag everything as low."""
    result = retrieve_services("I need help paying my bills", top_k=3)
    assert result.confidence_low is False
    assert result.debug_info["reranker_available"] is False
    assert result.debug_info["rerank_items"] == []
    assert result.debug_info["rerank_top_score"] is None


# ---------- Phase 6: reranker integration -----------------------------------


def test_reranker_overwrites_rrf_order(enable_fake_reranker):
    """LLM picks WSG even though RRF would put MSF first."""
    enable_fake_reranker(
        [
            RerankItem("WSG-001", 0.92, "Career coaching is the primary match"),
            RerankItem("SSG-001", 0.40, "SkillsFuture Credit could fund conversion training"),
            RerankItem("HDB-004", 0.05, "Lease Buyback unrelated to careers"),
        ]
    )
    result = retrieve_services("I want to switch careers", top_k=3)
    ids = [r.service.service_id for r in result.services]
    assert ids == ["WSG-001", "SSG-001", "HDB-004"]


def test_reranker_score_becomes_relevance_score(enable_fake_reranker):
    enable_fake_reranker(
        [
            RerankItem("HDB-001", 0.88, "Direct HDB mortgage relief programme"),
            RerankItem("HDB-002", 0.55, "Adjacent — Fresh Start if home was lost"),
            RerankItem("MSF-007", 0.12, "FSC casework, not a housing scheme"),
        ]
    )
    result = retrieve_services("help me with my hdb mortgage", top_k=3)
    assert result.services[0].relevance_score == pytest.approx(0.88)
    assert result.services[0].rerank_justification == "Direct HDB mortgage relief programme"
    assert result.services[1].relevance_score == pytest.approx(0.55)


def test_reranker_low_top_score_triggers_confidence_low(enable_fake_reranker):
    """OOS query: all candidates rated <0.3 → confidence_low True."""
    enable_fake_reranker(
        [
            RerankItem("WSG-001", 0.10, "Off topic"),
            RerankItem("MSF-001", 0.08, "Off topic"),
            RerankItem("HDB-001", 0.05, "Off topic"),
        ]
    )
    result = retrieve_services("what time does the food court close", top_k=3)
    assert result.confidence_low is True
    assert result.debug_info["rerank_top_score"] == pytest.approx(0.10)
    assert result.debug_info["confidence_threshold"] == CONFIDENCE_THRESHOLD


def test_reranker_top_score_just_above_threshold_does_not_trigger(
    enable_fake_reranker,
):
    enable_fake_reranker(
        [
            RerankItem("MSF-002", CONFIDENCE_THRESHOLD + 0.001, "Marginally relevant"),
            RerankItem("HDB-001", 0.10, "Unrelated"),
            RerankItem("MSF-003", 0.05, "Unrelated"),
        ]
    )
    result = retrieve_services("borderline query", top_k=3)
    assert result.confidence_low is False


def test_reranker_top_score_equal_threshold_does_not_trigger(enable_fake_reranker):
    """Strict less-than: a top score of exactly the threshold is NOT
    enough to be flagged low. (Brief says "below threshold".)"""
    enable_fake_reranker(
        [
            RerankItem("MSF-002", CONFIDENCE_THRESHOLD, "Right at the line"),
            RerankItem("HDB-001", 0.10, "Unrelated"),
            RerankItem("MSF-003", 0.05, "Unrelated"),
        ]
    )
    result = retrieve_services("borderline query", top_k=3)
    assert result.confidence_low is False


def test_reranker_failure_falls_back_to_rrf_order(monkeypatch):
    """A failed/empty rerank must return RRF-ordered results, not crash."""
    # default fixture already stubs rerank to [] — that simulates failure
    result = retrieve_services("financial assistance", top_k=3)
    assert len(result.services) == 3
    assert result.confidence_low is False
    assert all(r.rerank_justification is None for r in result.services)


def test_reranker_justifications_appear_in_debug(enable_fake_reranker):
    """Use ComCare variants — all three reliably show up in the RRF pool
    for a 'no money for food' query so the defensive id-allowlist doesn't
    drop any of them."""
    enable_fake_reranker(
        [
            RerankItem("MSF-001", 0.7, "ComCare Short-Medium funds groceries and bills"),
            RerankItem("MSF-003", 0.4, "Interim assistance for same-day emergencies"),
            RerankItem("MSF-002", 0.2, "Long-Term only fits if unable to work permanently"),
        ]
    )
    result = retrieve_services("I cannot afford groceries and bills", top_k=3)
    items = result.debug_info["rerank_items"]
    assert len(items) == 3
    assert items[0]["service_id"] == "MSF-001"
    assert "ComCare" in items[0]["justification"]


def test_reranker_truncates_to_top_k(enable_fake_reranker):
    """Query that reliably surfaces MSF-001/MSF-003/HDB-001 in the RRF
    pool, so the defensive id-allowlist doesn't drop any fake rerank item."""
    enable_fake_reranker(
        [
            RerankItem("MSF-001", 0.9, "j1"),
            RerankItem("MSF-003", 0.6, "j2"),
            RerankItem("HDB-003", 0.3, "j3"),
        ]
    )
    result = retrieve_services("I need financial help with rent", top_k=1)
    assert len(result.services) == 1
    assert result.services[0].service.service_id == "MSF-001"
    # but debug_info keeps the full rerank pool for transparency
    assert len(result.debug_info["rerank_items"]) == 3


# ---------- Phase 7: _filter_by_user_context unit tests ---------------------


@pytest.fixture
def sample_services() -> list[Service]:
    return load_services()


def test_filter_all_none_fields_keeps_everything(sample_services):
    kept, dropped = _filter_by_user_context(sample_services, UserContext())
    assert kept == sample_services
    assert dropped == []


def test_filter_citizenship_drops_mismatched(sample_services):
    """Every kept service must list the user's citizenship; every dropped
    service must not. Rules-based so it survives catalogue growth."""
    ctx = UserContext(citizenship="foreigner")
    kept, dropped = _filter_by_user_context(sample_services, ctx)
    for svc in kept:
        assert "foreigner" in svc.eligibility.citizenship
    for sid, reason in dropped:
        svc = next(s for s in sample_services if s.service_id == sid)
        assert "foreigner" not in svc.eligibility.citizenship
        assert "citizenship" in reason and "foreigner" in reason
    # Sanity: catalogue is structured such that at least some services
    # admit foreigners (AIC-001) and at least some don't.
    assert kept and dropped


def test_filter_citizenship_kept_when_match(sample_services):
    """Every sample service admits citizens, so citizen filter keeps all."""
    ctx = UserContext(citizenship="citizen")
    kept, dropped = _filter_by_user_context(sample_services, ctx)
    assert {s.service_id for s in kept} == {s.service_id for s in sample_services}
    assert dropped == []


def test_filter_citizenship_pr_drops_citizen_only_services(sample_services):
    """PR-only filter drops services whose eligibility.citizenship lacks 'PR'."""
    ctx = UserContext(citizenship="PR")
    kept, dropped = _filter_by_user_context(sample_services, ctx)
    for svc in kept:
        assert "PR" in svc.eligibility.citizenship
    for sid, _reason in dropped:
        svc = next(s for s in sample_services if s.service_id == sid)
        assert "PR" not in svc.eligibility.citizenship


def test_filter_age_below_lowest_age_min_drops_all_age_gated(sample_services):
    """Age 16 is below every service that has an age_min set. Services
    without an age_min stay (e.g. AIC info hub, MediFund)."""
    ctx = UserContext(age=16)
    kept, dropped = _filter_by_user_context(sample_services, ctx)
    for svc in kept:
        assert svc.eligibility.age_min is None or svc.eligibility.age_min <= 16
    for sid, reason in dropped:
        svc = next(s for s in sample_services if s.service_id == sid)
        assert svc.eligibility.age_min is not None
        assert 16 < svc.eligibility.age_min
        assert "age 16" in reason and "age_min" in reason


def test_filter_age_keeps_partially_eligible(sample_services):
    """Age 18 keeps services with age_min ≤ 18 OR no age_min set."""
    ctx = UserContext(age=18)
    kept, _ = _filter_by_user_context(sample_services, ctx)
    for svc in kept:
        assert svc.eligibility.age_min is None or svc.eligibility.age_min <= 18
        assert svc.eligibility.age_max is None or svc.eligibility.age_max >= 18


def test_filter_age_in_normal_adult_range(sample_services):
    """Age 42: kept if age_min ≤ 42 ≤ age_max (or unset on either side).
    Catalogue includes some seniors-only services that should drop."""
    ctx = UserContext(age=42)
    kept, dropped = _filter_by_user_context(sample_services, ctx)
    for svc in kept:
        assert svc.eligibility.age_min is None or svc.eligibility.age_min <= 42
        assert svc.eligibility.age_max is None or svc.eligibility.age_max >= 42
    for sid, _ in dropped:
        svc = next(s for s in sample_services if s.service_id == sid)
        # Must be excluded by EITHER bound
        below_min = svc.eligibility.age_min is not None and 42 < svc.eligibility.age_min
        above_max = svc.eligibility.age_max is not None and 42 > svc.eligibility.age_max
        assert below_min or above_max
    # Sanity: catalogue includes 65+/76+ schemes, so something must drop.
    assert dropped


def test_filter_age_above_max_dropped():
    """Synthesize a service with age_max set and test the upper bound."""
    young_only = sample_services_with_age_cap(age_max=30)
    ctx = UserContext(age=45)
    kept, dropped = _filter_by_user_context([young_only], ctx)
    assert kept == []
    assert dropped[0][1] == f"age 45 > age_max 30"


def test_filter_combined_citizenship_and_age(sample_services):
    """PR aged 18: every kept service must admit PR AND be age-compatible."""
    ctx = UserContext(citizenship="PR", age=18)
    kept, _ = _filter_by_user_context(sample_services, ctx)
    for svc in kept:
        assert "PR" in svc.eligibility.citizenship
        assert svc.eligibility.age_min is None or svc.eligibility.age_min <= 18
        assert svc.eligibility.age_max is None or svc.eligibility.age_max >= 18
    # Sanity: WSG (PR + age_min=17) must survive.
    assert "WSG-001" in {s.service_id for s in kept}


def test_filter_empty_input():
    kept, dropped = _filter_by_user_context([], UserContext(citizenship="citizen"))
    assert kept == []
    assert dropped == []


def sample_services_with_age_cap(age_max: int) -> Service:
    """Build a fake Service with an upper age bound (none of the 3 sample
    services has one). Used by test_filter_age_above_max_dropped."""
    base = load_services()[0]
    payload = base.model_dump(mode="json")
    payload["service_id"] = "FAKE-CAP"
    payload["eligibility"]["age_min"] = 0
    payload["eligibility"]["age_max"] = age_max
    return Service.model_validate(payload)


# ---------- Phase 7: retrieve integration ----------------------------------


def test_user_context_filter_drops_ineligible_services_in_results():
    """Foreigner-only filter: every returned service must admit foreigners.
    Most services in the catalogue don't, so we expect most to drop. If
    only foreigner-eligible services are in the pool we just check the
    rule; otherwise we expect either a partial result or an empty one
    flagged unmet_user_context."""
    result = retrieve_services(
        "I need financial help with rent",
        user_context=UserContext(citizenship="foreigner"),
        top_k=3,
    )
    for r in result.services:
        assert "foreigner" in r.service.eligibility.citizenship
    pre = result.debug_info["filter_pre_count"]
    post = result.debug_info["filter_post_count"]
    assert post == pre - len(result.debug_info["filter_dropped"])
    if not result.services:
        # If the filter cleared everything, the result must be flagged
        assert result.confidence_low is True
        assert result.debug_info["reason"] == "unmet_user_context"


def test_user_context_filter_keeps_eligible_services():
    """42-year-old citizen → all retrieved candidates pass the filter
    (every service in the catalogue admits citizens; only CPF-002
    Silver Support has age_min=65 which excludes 42-year-olds)."""
    result = retrieve_services(
        "financial help",
        user_context=UserContext(citizenship="citizen", age=42),
        top_k=3,
    )
    pre = result.debug_info["filter_pre_count"]
    post = result.debug_info["filter_post_count"]
    dropped_ids = {d["service_id"] for d in result.debug_info["filter_dropped"]}
    # Either CPF-002 surfaced in RRF top-10 and got dropped, or it didn't
    # — but anything that survives must be age-eligible.
    assert dropped_ids.issubset({"CPF-002"})
    assert post == pre - len(dropped_ids)


def test_user_context_filter_partial_keeps_only_eligible():
    """18-year-old: every kept result must be age-compatible. WSG-001
    (age_min=17) is the most-likely top-1 for a job query, so we also
    sanity-check that it isn't dropped."""
    result = retrieve_services(
        "I want to find a job",
        user_context=UserContext(age=18),
        top_k=3,
    )
    for r in result.services:
        elig = r.service.eligibility
        assert elig.age_min is None or elig.age_min <= 18
        assert elig.age_max is None or elig.age_max >= 18
    dropped_ids = {d["service_id"] for d in result.debug_info["filter_dropped"]}
    assert "WSG-001" not in dropped_ids


def test_user_context_filter_runs_before_rerank(enable_fake_reranker, monkeypatch):
    """The reranker MUST NOT see filtered services. We capture the
    candidate list passed into rerank and assert every candidate is
    age-compatible — i.e. the filter ran before the call, not after."""
    captured: dict = {}

    def _spy(query, candidates):
        captured["candidates"] = list(candidates)
        return [
            RerankItem("WSG-001", 0.9, "Career coach is the right call"),
        ]

    monkeypatch.setattr(retrieve_mod, "rerank", _spy)
    monkeypatch.setattr(retrieve_mod, "reranker_available", lambda: True)

    result = retrieve_services(
        "job help",
        user_context=UserContext(age=18),
        top_k=3,
    )

    # Every candidate the reranker saw was age-eligible at 18.
    assert captured["candidates"], "filter wiped the pool before rerank could run"
    for c in captured["candidates"]:
        elig = c.eligibility
        assert elig.age_min is None or elig.age_min <= 18
        assert elig.age_max is None or elig.age_max >= 18

    # The fake reranker picked WSG-001; final result has it with justification.
    assert [r.service.service_id for r in result.services] == ["WSG-001"]
    assert result.services[0].rerank_justification == "Career coach is the right call"


def test_user_context_none_means_no_filter():
    """The default (None) preserves Phase 5/6 behaviour exactly — no
    filtering applied, pre == post, no drops."""
    result = retrieve_services("financial help", top_k=3)
    assert len(result.services) == 3
    pre = result.debug_info["filter_pre_count"]
    post = result.debug_info["filter_post_count"]
    assert pre == post
    assert result.debug_info["filter_dropped"] == []


def test_user_context_filter_applied_even_without_reranker():
    """Filter is structural — runs regardless of whether the LLM is up.
    Verify the filter ran (post < pre or pre = post with no drops) and
    every returned service satisfies the filter."""
    result = retrieve_services(
        "job help",
        user_context=UserContext(age=18),
        top_k=3,
    )
    assert result.debug_info["reranker_available"] is False
    for r in result.services:
        elig = r.service.eligibility
        assert elig.age_min is None or elig.age_min <= 18


def test_user_context_drop_reasons_are_human_readable():
    """The chatbot can show these to the user to explain why a service
    they asked about didn't appear."""
    result = retrieve_services(
        "financial help",
        user_context=UserContext(citizenship="foreigner"),
        top_k=3,
    )
    assert result.debug_info["filter_dropped"]  # non-empty
    for entry in result.debug_info["filter_dropped"]:
        assert "foreigner" in entry["reason"]
        assert "citizenship" in entry["reason"]
