# Digital OTH — DB & Retrieval Layer

Database and retrieval layer for **Digital OTH** (Digital Our Tampines Hub), a
hackathon project giving Tampines residents a single AI concierge over
fragmented Singapore government services (MSF, HDB, AIC, WSG, …).

This repo owns the DB/retrieval only. A separate teammate ("the chatbot
engineer") consumes a stable `retrieve_services(query, ...)` function from
here.

---

## Setup (Windows, recommended via `uv`)

```powershell
# one-time
winget install --id=astral-sh.uv -e
uv python install 3.11

# in project root
uv venv --python 3.11 .venv
.\.venv\Scripts\Activate.ps1
uv pip install -r requirements.txt
```

Fallback without `uv`: install Python 3.11 from python.org, then
`py -3.11 -m venv .venv` and standard `pip install -r requirements.txt`.

> **Use Python 3.11**, not 3.10/3.12/3.13. On Windows, `chroma-hnswlib==0.7.6`
> only ships prebuilt wheels for 3.11; other versions try to compile and
> fail without MSVC Build Tools.

If the project ends up inside a OneDrive-synced folder, add
`--link-mode=copy` to the `uv pip install` line — OneDrive blocks uv's
default hardlinks.

---

## Phase status (current: Phase 9 — ALL phases complete)

**Scope**: services with a physical counter or staffed presence at Our
Tampines Hub. Catalogue: **16 services** across 4 OTH-resident agencies
(HDB Tampines Branch, WSG Careers Connect, Social Service Office
Tampines, Tampines Family Service Centre). Schemes accessed elsewhere
(IMH/SOS/PAVE phone-only, hospital-MSW MediFund, MOE FAS at schools,
ECDA preschool subsidies, AIC eldercare, etc.) live under
`data/archived/` and can be re-included by moving them back into
`data/processed/`.

Eval baseline (keyless, RRF only): **Recall@3 = 0.960**, **MRR = 0.900**
on 28 labelled queries (25 non-OOS + 3 OOS). OOS rejection requires
`OPENAI_API_KEY` to score.

The 16 OTH-resident services:

| Agency at OTH | Services |
|---|---|
| HDB Tampines Branch (Level 3) | HDB-001 Financial Assistance, HDB-002 Fresh Start, HDB-003 Public Rental, HDB-004 Lease Buyback, HDB-005 Enhanced CPF Housing Grant, HDB-006 Silver Housing Bonus |
| WSG Careers Connect counter | WSG-001 Career Matching Services, WSG-002 Career Conversion Programme, WSG-003 Mid-Career Pathways, WSG-004 Career Trial |
| Careers Connect-assisted training (SSG) | SSG-001 SkillsFuture Credit, SSG-002 Workfare Skills Support |
| Social Service Office Tampines (Level 1) | MSF-001 ComCare Short-Medium, MSF-002 ComCare Long-Term, MSF-003 ComCare Interim |
| Tampines Family Service Centre | MSF-007 Tampines FSC |

Done:

- **Phase 1** — schema + 3 sample services + 7 schema tests.
  - `src/schema.py` — Pydantic v2 models (`Service`, `Eligibility`,
    `Document`, `Contact`) with strict validation (`extra="forbid"`,
    age-range validator).
  - `data/processed/` — 3 hand-written sample services (MSF ComCare,
    HDB Financial Assistance, WSG Careers Connect). OTH floor numbers and
    income ceilings are **plausible placeholders** pending verification
    before demo.

- **Phase 2** — ingestion pipeline + 8 ingest tests, **no API key required**.
  - `src/config.py` — paths + optional `Settings` (Phase 6 reranker may
    use `openai_api_key`; Phase 2 does not).
  - `src/ingest.py` — `load_services()`, `flatten_service_for_chroma()` +
    inverse, `build_chroma_index()` (Chroma `PersistentClient`, embeds
    `rich_description` locally with `all-MiniLM-L6-v2` via ONNX,
    **upserts by `service_id`** for idempotency), `build_bm25_index()`
    (rank-bm25, pickled). Silences chromadb 0.5.x's broken posthog
    telemetry logger.
  - `tests/test_ingest.py` — flatten/unflatten round-trip, BM25 build +
    lexical query, BM25 acronym-expander hook, Chroma idempotency, Chroma
    metadata round-trip via `collection.get`, semantic query (all run
    against the local embedder, no network).

- **Phase 3** — Singapore-specific acronym + Singlish expansion.
  - `src/acronyms.py` — `ACRONYMS` dict (~40 entries: agency abbrevs
    like HDB/MSF/WSG, schemes like ComCare/Workfare/BTO, Singlish verbs
    like "kena"/"retrenched") + `expand_acronyms(text)` which appends
    each matched term's expansion once, case-insensitive,
    word-boundary safe.
  - Wired into `build_bm25_index` as the default `acronym_expander`. The
    same function will be applied to user queries in Phase 4+.
  - 9 tests in `tests/test_acronyms.py`.
  - Validated end-to-end after re-ingest: query "I need housing
    development board help" ranks HDB-001 at 1.314 (vs ~0.1 for the
    others), and "kena retrenched" ranks WSG-001 at 5.021 (vs ~0.3) —
    neither match could happen without expansion.

- **Phase 4** — dense-only retrieval + stable public API.
  - `src/retrieve.py` — `UserContext`, `RetrievedService`,
    `RetrievalResult`, and `retrieve_services(query, user_context=None,
    top_k=3)`. Dense leg only (Chroma cosine over `rich_description`),
    over-retrieves a pool of 10 to seed Phase 5's RRF. The cosine
    `1 - distance` is clamped to `[0, 1]` and surfaced as
    `relevance_score`. `user_context` is accepted but unused (Phase 7
    will wire it into metadata filtering); empty queries short-circuit
    with `confidence_low=True`. Chroma collection is a lazy lru_cache'd
    singleton so the ONNX model loads once per process.
  - `tests/test_retrieve.py` — 12 tests against a hermetic tmp-dir
    Chroma index: 5 parameterized routing smokes (MSF/HDB/WSG) plus
    contract/shape/empty-query/user-context/debug-info checks.
  - Manual CLI smoke: `python -m src.retrieve "<query>"` prints the
    top-K and the full dense-candidate pool with scores — handy for
    eyeballing tuning before we wire the LLM-side caller.

- **Phase 5** — BM25 leg + RRF fusion wired into `retrieve_services`.
  - `src/retrieve.py` — added `_get_bm25()` (lazy lru_cache singleton
    over the pickled index), `_bm25_search()` (applies
    `expand_acronyms` to the query then tokenizes with the same
    `src.ingest.tokenize`, so query-side expansion matches what was
    indexed), and `_rrf_fuse()` (standard Cormack/Clarke RRF, k=60).
    Both legs return a pool of 10; fusion outputs top 10; `top_k` slices
    from there. `relevance_score` is now the raw RRF sum (small numbers
    like 0.033, monotone with rank) — Phase 6's reranker will overwrite
    it. `debug_info` now exposes `dense_candidates`, `bm25_candidates`,
    and `rrf_fused` with per-leg ranks, so the eval harness can attribute
    every decision.
  - `tests/test_retrieve.py` — 21 tests (was 12): added 5 RRF unit tests
    (basic, missing-from-one-list, n-cap, k-formula, empty), 3
    acronym/Singlish routing smokes ("HDB help", "kena retrenched",
    "WSG career coach") that dense alone would not handle, and a
    contract check that `relevance_score == rrf_score` per id.
  - Verified on real on-disk indices after re-ingest: bare "HDB help" →
    HDB-001 (dense=1, bm25=1; dense similarity is 0.48 from acronym
    co-occurrence with HDB Financial Assistance text, BM25 5x stronger
    than next). Bare "kena retrenched" → WSG-001 (dense=1 by a hair,
    bm25 dominant via the Singlish expansion appended at ingest).

- **Phase 6** — LLM reranker (`gpt-4o-mini`) + confidence threshold.
  - `src/rerank.py` — sends the RRF top-10 to gpt-4o-mini with a
    structured-JSON prompt asking for a 0-1 score and one-line
    justification per candidate. Uses OpenAI 1.x SDK
    (`client.chat.completions.create`, `response_format={"type":
    "json_object"}`, `temperature=0`). Client is a lazy lru_cache
    singleton; missing `OPENAI_API_KEY` → `_get_client()` returns
    `None` and `rerank()` returns `[]`. Parser is paranoid: clamps
    scores, drops unknown ids, dedupes, swallows malformed JSON, never
    raises.
  - `src/retrieve.py` — after RRF, materializes the top-10 Service
    objects and calls `rerank()`. If the reranker returns items, its
    order + scores + justifications are authoritative and
    `confidence_low = top_score < 0.3` (`CONFIDENCE_THRESHOLD`,
    matching the "poor match" cutoff we tell the LLM about). If empty
    (no key / API fail / garbage JSON), falls back to RRF order with
    `confidence_low=False` — Phase 5 behaviour preserved exactly for
    keyless setups.
  - Tests: `tests/test_rerank.py` (11 unit tests — prompt content,
    JSON-mode contract, parser robustness, sort order, exception
    swallowing) plus 8 new integration tests in `tests/test_retrieve.py`
    against a monkey-patched fake reranker (`enable_fake_reranker`
    fixture). The autouse fixture stubs the reranker off by default so
    the rest of the suite stays deterministic without API calls.
  - Verified end-to-end without a key — fallback smoke produces the
    same Phase 5 ranking, surfaces `reranker_available: False`, and
    logs a single INFO line. To run the *live* reranker drop a key in
    `.env`: `cp .env.example .env && edit OPENAI_API_KEY=sk-...`.

- **Phase 7** — `UserContext` metadata filter between RRF and rerank.
  - `src/retrieve.py` — added `_filter_by_user_context(services, ctx) ->
    (kept, dropped_with_reasons)`. Drops on (a) `ctx.citizenship not in
    service.eligibility.citizenship` and (b) `age` falling outside
    `[age_min, age_max]`. `employment_status` is *not* filtered on —
    most services list 3-5 statuses and a hard filter would be too
    noisy; the reranker handles employment softly via conversation
    semantics instead. Filter runs *before* rerank, so the LLM never
    wastes tokens on ineligible services and can't pick one.
  - Empty after filter → early return with `confidence_low=True` and
    `debug_info.reason="unmet_user_context"`. Caller (chatbot) can
    either relax filters or escalate. We never silently show ineligible
    services.
  - `debug_info` gains `filter_pre_count`, `filter_post_count`, and
    `filter_dropped: [{service_id, reason}]` so the chatbot can explain
    to the user *why* a service they asked about wasn't returned
    ("you're 18 and ComCare requires 21+").
  - Tests: 9 `_filter_by_user_context` unit tests (each citizenship
    branch, each age branch, combined, empty) + 7 integration tests
    (filter+rerank order via spy, filter applied with and without
    reranker, drop reasons human-readable). The Phase-6 reranker-off
    fallback was also fixed to iterate the filtered list, not the raw
    RRF tuples — earlier it could have leaked filtered services in the
    keyless path.

- **Phase 8** — catalogue scoped to **16 OTH-resident services** across
  6 HDB schemes (Tampines Branch Level 3), 4 WSG schemes (Careers
  Connect counter), 2 SSG schemes (assisted via Careers Connect),
  3 MSF ComCare schemes (Tampines SSO Level 1), and Tampines FSC.
  Services with no on-premises counter (hospital-MSW MediFund, online
  preschool subsidies, phone hotlines, agency offices elsewhere) are
  preserved under `data/archived/` and can be re-included by moving
  them back to `data/processed/`. `build_chroma_index` deletes stale
  ids on re-ingest so the index always reflects what's currently in
  `data/processed/`.

- **Phase 9** — evaluation harness.
  - `tests/golden_set.json` — 28 labelled queries spanning
    single-intent (12), multi-intent (4), Singlish/code-switch (2),
    acronym (2), negation (1), vague (2), eligibility-mismatched (2),
    out-of-scope (3). Each entry has `expected_top_ids` (a set —
    any-one-in-top-K satisfies), `user_context` for eligibility cases,
    `expect_oos`, and a note.
  - `src/evaluate.py` — loads the golden set, runs `retrieve_services`
    per entry, and reports Recall@3, Recall@5, MRR (mean reciprocal
    rank of the first matching expected id within top-5), and OOS
    rejection rate. Per-category breakdown surfaces weak slices.
    Verdict logic is honest about keyless mode: without
    `OPENAI_API_KEY`, OOS rejection requires the LLM signal
    (`confidence_low` "below threshold" trigger), so the verdict skips
    OOS and prints a note.
  - `Makefile` — `make eval` and `make eval-json` targets (Windows:
    invoke as `python -m src.evaluate` directly).
  - Baseline on 28 queries (RRF only, no key): **Recall@3=0.960**,
    Recall@5=0.960, **MRR=0.900**. The one fail at top-3 is G021
    (negation: "I do NOT want financial help, find me a job") — a
    documented reranker-territory case; with the LLM enabled it
    resolves trivially.

Test count: **83 passing** (7 schema + 8 ingest + 9 acronyms + 13 rerank
+ 46 retrieve).

---

## Run tests

```powershell
pytest -v
```

First run downloads the local embedding model (~80MB); subsequent runs use
the cached weights.

## Run ingestion

No API key needed.

```powershell
.\.venv\Scripts\Activate.ps1
python -m src.ingest
```

Produces:
- `chroma_db/` — persistent ChromaDB store (gitignored).
- `bm25_index.pkl` — pickled BM25 + tokenized corpus (gitignored).

Re-running is **idempotent** — services are upserted by `service_id` and
BM25 is rebuilt from scratch each time.

If `text-embedding-3-small` (OpenAI) turns out to outperform
`all-MiniLM-L6-v2` materially on the Phase 9 eval, swapping the embedder
is a one-line change in `src/ingest._get_collection()`.

## Run the eval

```powershell
.\.venv\Scripts\Activate.ps1
python -m src.ingest         # if you have not already
python -m src.evaluate
```

Prints per-query results (OK / WARN / FAIL), per-category Recall@3,
and an aggregate block with Recall@3, Recall@5, MRR, and OOS rejection
rate. Exits 0 on PASS (Recall@3 ≥ 0.85; OOS rejection ≥ 1.00 if the
reranker is enabled), 1 on FAIL.

`python -m src.evaluate --json` emits a single-line JSON summary for
CI ingestion. `python -m src.evaluate --golden path.json` runs against
an alternate golden set.

To score the OOS rejection metric, set `OPENAI_API_KEY` in `.env`
(otherwise the rerank-driven "below threshold" path is bypassed and
OOS queries can't be detected by structural triggers alone).

---

## Integration contract (Phase 7 — hybrid + filter + rerank + confidence)

```python
from src.retrieve import retrieve_services, UserContext

result = retrieve_services(
    query="I lost my job and can't pay my HDB instalment",
    user_context=UserContext(citizenship="citizen", age=42),
    top_k=3,
)
for r in result.services:
    print(r.service.service_name, r.service.oth_location, r.relevance_score)
if result.confidence_low:
    print("escalate to human")
```

The chatbot engineer reads `RetrievedService.service.*` fields directly —
`required_documents`, `oth_location`, `operating_hours`, `source_url` — and
does **not** re-parse `rich_description`. That's the whole point of the
hybrid design.

**Stable for callers**: the function signature and the three Pydantic
models will not change. Phase 8 only grows the catalogue; Phase 9
adds the eval harness — neither touches the contract.

**`confidence_low` semantics**: True when
1. query was empty/whitespace, OR
2. the LLM reranker rated the best candidate below `CONFIDENCE_THRESHOLD`
   (0.3) — typically out-of-scope queries, OR
3. `user_context` filtered out every retrieved service
   (`debug_info.reason == "unmet_user_context"`) — the user is
   structurally ineligible for everything in the candidate pool.

Callers should escalate to a human or hotline in any of these cases.
When the reranker is disabled (no `OPENAI_API_KEY`), case 2 cannot
fire — we can't honestly judge confidence without the LLM signal — but
cases 1 and 3 still work since they are structural.

**`UserContext` filter semantics**:
- `citizenship`: hard filter. `"foreigner"` asking about a citizen-only
  scheme gets it dropped.
- `age`: hard filter against `eligibility.age_min` / `age_max`.
- `employment_status`: *not* filtered on — recorded only. Many services
  list multiple statuses; the reranker handles this softly.
- A `UserContext` with all fields `None` is equivalent to passing no
  context.
- `debug_info.filter_dropped` lists every drop with a human-readable
  reason the chatbot can show ("age 18 < age_min 21").
