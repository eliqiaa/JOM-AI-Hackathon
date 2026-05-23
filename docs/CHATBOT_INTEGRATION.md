# Digital OTH — Chatbot Integration Guide

This is the **complete contract** between the chatbot layer (you) and the
retrieval layer (this repo). Read this end-to-end before writing any
integration code. Everything you need is here; you should not need to
read `src/retrieve.py` to use it.

---

## TL;DR (read this first)

You import one function and one input model:

```python
from src.retrieve import retrieve_services, UserContext

result = retrieve_services(
    query="I cannot pay rent and need food for my kids",
    user_context=UserContext(citizenship="citizen", age=42),  # optional
    top_k=3,                                                  # default 3
)

for r in result.services:
    # r.service is a fully-typed Service object (see schema below).
    # r.relevance_score is a float; higher is better.
    # r.rerank_justification is a one-line LLM explanation (or None).
    print(r.service.service_name, r.service.oth_location)

if result.confidence_low:
    # Escalate to a human staffer or hotline. DO NOT bluff an answer.
    ...
```

The function:
- Always returns a `RetrievalResult` (never raises on missing data, bad
  queries, or API failures).
- Returns `services=[]` and `confidence_low=True` for empty queries or
  when the user's `UserContext` filters everything out.
- Is **idempotent and deterministic** for a given query + index state
  (the LLM reranker adds slight nondeterminism but uses temperature=0).

---

## The catalogue (23 services accessible via OTH)

Every returned service has a meaningful path through Our Tampines Hub —
either a physical counter at OTH itself, or a hotline/website service
that can be applied to via the ServiceSG Centre @ OTH Level 1.
The `Service.location_type` field tells you which is which:

- **`Physical_OTH`** — there's a staffed counter at OTH. Give walking
  directions (`oth_location` has the level/unit).
- **`Digital_Hotline`** — no OTH counter. Give the phone/website. If
  the user needs in-person help with the online application (especially
  seniors and digitally less-confident users), route them to
  **SSGC-001 (ServiceSG Centre @ OTH Level 1)**.

If a user asks about a service NOT in this catalogue (e.g. NTUC e2i,
IMH helpline, MediFund at hospital MSW), the chatbot must hand that off
itself — the retrieval layer won't return it.

| ID | Service | Agency at OTH | Use case in one line |
|---|---|---|---|
| MSF-001 | ComCare Short-to-Medium-Term Assistance | SSO Tampines | Cash + bill support for families in a temporary squeeze (3-6 months) |
| MSF-002 | ComCare Long-Term Assistance (Public Assistance) | SSO Tampines | Cash for those unable to work permanently (disability, frail elderly) |
| MSF-003 | ComCare Interim Assistance | SSO Tampines | Same-day emergency cash (food, rent on the brink, eviction) |
| MSF-007 | Tampines Family Service Centre | TFSC at OTH | Holistic social-work intake; "I don't know where to start" |
| HDB-001 | HDB Financial Assistance Scheme | HDB Tampines Branch (Level 3) | Mortgage rescue — deferment / restructure for struggling owners |
| HDB-002 | Fresh Start Housing Scheme | HDB Tampines Branch | Second-chance flat ownership for ex-owners renting from HDB |
| HDB-003 | Public Rental Scheme | HDB Tampines Branch | $26+/month rental flats for income ≤ $1,500 |
| HDB-004 | Lease Buyback Scheme | HDB Tampines Branch | Seniors 65+ monetise tail-end of flat lease |
| HDB-005 | Enhanced CPF Housing Grant (EHG) | HDB Tampines Branch | First-timer grant up to $80k for BTO or resale |
| HDB-006 | Silver Housing Bonus | HDB Tampines Branch | Seniors 55+ right-size from larger flat for $30k bonus |
| WSG-001 | WSG Careers Connect — Career Matching Services | WSG Careers Connect counter at OTH | Free walk-in career coach, job matching, resume help |
| WSG-002 | Career Conversion Programme (CCP) | via Careers Connect | Switch industry with employer-sponsored training, 70-90% salary support |
| WSG-003 | Mid-Career Pathways Programme (MCPP) | via Careers Connect | 4-6 month job attachment for citizens 40+ |
| WSG-004 | Career Trial | via Careers Connect | 1-3 month trial of a new role before committing |
| SSG-001 | SkillsFuture Credit | via Careers Connect | $500 + top-ups for SSG-approved courses |
| SSG-002 | Workfare Skills Support (WSS) | via Careers Connect | Low-wage upskilling: 95% course subsidy + absentee payroll |
| FAMNEX-001 | Family Nexus @ OTH | SingHealth · FFL Council · MSF | Pregnancy / preconception / parenting / community nursing / FFL workshops (Level 1, near Gate 10) |
| **AIC-001** 🔴 | AIC Care Connect (Eldercare Info & Referral) | AIC (hotline + web) | **Digital_Hotline** — stroke / dementia / hospital discharge planning. Route to SSGC-001 for in-person help. |
| **AIC-002** 🔴 | Home Caregiving Grant (HCG) | AIC (online application) | **Digital_Hotline** — $200+/month for caregivers of ≥3-ADL care recipients. Route to SSGC-001 for SingPass help. |
| **SSGC-001** | ServiceSG Centre @ Our Tampines Hub | ServiceSG (PSD/PMO) | **Physical_OTH** — Level 1 anchor for any Digital_Hotline service. Officers help fill forms, set up SingPass, navigate gov digital services. |
| **MSF-008** 🔴 | Baby Bonus Scheme (Cash Gift + CDA) | MSF (online application) | **Digital_Hotline** — Cash Gift + Child Development Account for newborns. Apply at babybonus.msf.gov.sg. Route to SSGC-001 for SingPass / child linking help. |
| **CPF-001** 🔴 | Workfare Income Supplement (WIS) | CPF Board (online + automatic) | **Digital_Hotline** — Annual top-up for low-wage workers. Auto for employees; self-employed must declare income to IRAS. Route to SSGC-001 for help. |
| **CPF-002** 🔴 | Silver Support Scheme | CPF Board (automatic + online check) | **Digital_Hotline** — Quarterly cash payouts for low-CPF elderly aged 65+. Enrolment is automatic. Route to SSGC-001 for status checks. |

All rows above are `location_type=Physical_OTH` unless explicitly
marked 🔴 / Digital_Hotline.

The chatbot can fetch the full dataset by calling
`load_services()` from `src.ingest`, but the canonical path is to
display whatever `retrieve_services` returns.

---

## The function signature

```python
def retrieve_services(
    query: str,
    user_context: UserContext | None = None,
    top_k: int = 3,
) -> RetrievalResult: ...
```

| Argument | Type | Notes |
|---|---|---|
| `query` | `str` | Natural language. Can be Singlish, code-switched, or contain acronyms. Empty/whitespace returns `confidence_low=True` immediately. |
| `user_context` | `UserContext \| None` | Optional. Pass what you know from the conversation; everything is optional. See "UserContext" below. |
| `top_k` | `int` | Default 3. Use 5 if your UI shows more cards. The pipeline always retrieves 10 internally regardless. |

### `UserContext` — what to pass and when

```python
class UserContext(BaseModel):
    citizenship: Literal["citizen", "PR", "foreigner"] | None = None
    age: int | None = None
    employment_status: str | None = None  # recorded, not filtered
```

**Hard filters** (services dropped from results):
- `citizenship`: if the service's `eligibility.citizenship` list doesn't
  include the user's value, the service is dropped. E.g., a foreigner
  asking about HDB-001 (citizen+PR only) won't see it.
- `age`: dropped if `age < service.eligibility.age_min` or
  `age > service.eligibility.age_max`. Missing limits on the service =
  no bound on that side.

**Soft filter (not enforced — recorded only)**:
- `employment_status`: many services list 3-5 statuses, so a hard
  filter would be too noisy. The LLM reranker uses this softly through
  conversation context, but the retrieval layer does NOT drop on it.

**When to extract `UserContext` from the conversation**:
- *Pass `citizenship`* only when you're confident (user explicitly said
  "I'm a foreigner" / "I'm Singaporean"). Don't guess. A wrong
  citizenship filter hides services the user is actually eligible for.
- *Pass `age`* when the user mentions their age or their elderly
  relative's age (for queries about parents/grandparents, pass the
  relative's age — the service is for them, not the asker).
- *Always-`None` is fine* — the layer works without any context and
  most queries don't need it.

**If filtering removes everything**, the response is:

```python
RetrievalResult(
    services=[],
    confidence_low=True,
    debug_info={"reason": "unmet_user_context", ...},
)
```

Show the user that they're structurally ineligible for everything in
the candidate pool, and consider relaxing one filter at a time before
giving up.

---

## What you get back: `RetrievalResult`

```python
class RetrievalResult(BaseModel):
    services: list[RetrievedService]   # 0 to top_k items
    confidence_low: bool                # whether to escalate
    query_decomposition: list[str]      # always [processed_query]; reserved for future use
    debug_info: dict[str, Any]          # see "debug_info" reference below
```

### `RetrievedService`

```python
class RetrievedService(BaseModel):
    service: Service                          # fully structured (below)
    relevance_score: float                    # 0.0 - 1.0 (reranker) or RRF score (~0.03)
    rerank_justification: str | None          # one-line LLM explanation, or None if reranker off
```

`relevance_score` has different scales depending on whether the LLM
reranker ran:
- **Reranker on** (OPENAI_API_KEY set): score is 0.0-1.0, semantic.
- **Reranker off** (no key): score is the raw RRF sum, ~0.03 for the
  top result. Treat as ordinal, not a true probability.

The order of `services` is always best-first. Within a single call,
scores are monotonically non-increasing.

### `Service` (the structured payload — never re-parse `rich_description`)

```python
class Service(BaseModel):
    service_id: str                           # e.g. "MSF-001"
    service_name: str                         # display name
    agency: str                               # e.g. "MSF"
    location_type: Literal["Physical_OTH",    # routing tag — see "Routing"
                           "Digital_Hotline"] #   section below
    rich_description: str                     # LONG prose — only field that's embedded for search
    eligibility: Eligibility                  # structured criteria (below)
    required_documents: list[Document]        # what to bring
    oth_location: str                         # WHERE at OTH (level, counter, etc.)
    operating_hours: dict[str, str]           # {"mon-fri": "08:30-17:30", ...}
    contact: Contact                          # phone, email, website
    walk_in_accepted: bool                    # can the user just show up?
    appointment_required: bool                # must the user book first?
    typical_processing_time: str              # human-readable, e.g. "2-4 weeks"
    last_updated: date                        # ISO date string when serialised
    source_url: str                           # canonical .gov.sg page
```

```python
class Eligibility(BaseModel):
    citizenship: list[Literal["citizen", "PR", "foreigner"]]
    age_min: int | None
    age_max: int | None
    income_ceiling_monthly_sgd: int | None
    employment_status: list[str] | None
    other_criteria: list[str]                 # free-form bullet points

class Document(BaseModel):
    name: str
    required_if: str | None                   # condition, e.g. "self-employed"
    notes: str | None

class Contact(BaseModel):
    phone: str | None
    email: str | None
    website: str | None
```

**The whole point of this schema**: the chatbot reads structured fields
directly. Do NOT prompt your LLM with "extract the operating hours from
this paragraph" — read `service.operating_hours` as a dict. Do NOT ask
the LLM "is this person eligible?" — read `service.eligibility` and
reason on the fields.

The only field your chatbot LLM should ever paraphrase is
`rich_description`, and even then you usually want to summarise rather
than dump.

---

## Routing: `location_type` and the ServiceSG hand-off

This is the most important new contract. Every `Service` carries one of
two `location_type` values, and your reply MUST respect it:

### `location_type == "Physical_OTH"`

A staffed counter exists at OTH. Tell the user where to go:

> *"You can walk in to the **HDB Tampines Branch on Level 3** to discuss
> mortgage assistance. Bring your NRIC and 3 months of payslips.
> Counter is open Mon-Fri 8:30am-5pm, no appointment needed."*

Use `service.oth_location`, `service.operating_hours`, and
`service.walk_in_accepted` / `service.appointment_required` verbatim.

### `location_type == "Digital_Hotline"`

There is **no AIC/etc. counter at OTH**. Do not hallucinate one.
Instead, do TWO things:

1. Give the **hotline and website** from `service.contact`.
2. **Offer the ServiceSG hand-off** for in-person help with the online
   application — explicitly mention `SSGC-001` (ServiceSG Centre @ OTH
   Level 1).

Sample reply for AIC-002 (Home Caregiving Grant):

> *"The Home Caregiving Grant pays $200-$400/month to caregivers and is
> managed by AIC online. You can apply at **aic.sg** with SingPass, or
> call the AIC careline at **1800-650-6060**.
>
> If you need a person to sit with you and help fill in the online form
> — or if you don't have SingPass set up — walk in to the **ServiceSG
> Centre at Our Tampines Hub Level 1**. The officers there are trained
> to help with AIC applications, SingPass, and other gov digital
> services. No appointment needed."*

### Rule for your system prompt

Add this exact directive to the chatbot's system prompt:

> When recommending a service, check `service.location_type`.
> - If `Physical_OTH`: give walking directions to the counter using
>   `oth_location`, `operating_hours`, and the walk_in/appointment
>   flags.
> - If `Digital_Hotline`: you MUST explicitly tell the user there is no
>   counter at OTH for this service. Give the phone/website from
>   `contact`. THEN offer to route them to the **ServiceSG Centre at
>   OTH Level 1** if they need in-person help with the online
>   application (especially seniors and digitally less-confident
>   users).
> NEVER invent a physical OTH counter that doesn't exist.

### Why this design

Some essential services (eldercare, caregiver grants, online-only
schemes) have no physical OTH counter. Ignoring them = abandoning the
elderly. Inventing a fake OTH counter = misleading them. The
ServiceSG @ OTH anchor lets the chatbot acknowledge the digital nature
of the service AND give the resident a concrete physical place to walk
to for in-person help. Same place either way: OTH.

---

## `confidence_low` — when to escalate

`confidence_low=True` means one of three things happened:

1. **Empty query**: user sent nothing or whitespace.
   - `debug_info["reason"] == "empty_query"`
2. **Below-threshold rerank**: the LLM reranker rated the best
   candidate below 0.3 — usually means the query is out-of-scope
   (food court hours, basketball booking, weather).
   - `debug_info["rerank_top_score"] < 0.3`
   - **Only fires when OPENAI_API_KEY is set.** Without the reranker,
     this trigger is silent.
3. **User filtered out**: `UserContext` removed every candidate.
   - `debug_info["reason"] == "unmet_user_context"`

**What the chatbot should do when `confidence_low=True`**:
- Don't pretend you found a great match.
- For case 1: re-prompt for a clearer question.
- For case 2: say something like "I couldn't find a strong match for
  this. The OTH staff at the ServiceSG counter can help — would you
  like the directions?"
- For case 3: explain what was filtered ("the services that fit aren't
  open to foreigners / aren't open to under-21s") and offer to relax
  the filter.

`confidence_low=False` with `services=[]` cannot happen — the layer
guarantees that.

---

## Graceful degradation

The retrieval layer has been designed so the chatbot can ship without
any API key, then layer the reranker in later. With and without an
`OPENAI_API_KEY`:

| | No key | With key |
|---|---|---|
| Dense + BM25 + RRF | ✓ | ✓ |
| `UserContext` filter | ✓ | ✓ |
| LLM reranker (gpt-4o-mini) | off | on |
| `rerank_justification` populated | None | one-line string |
| `relevance_score` scale | ~0.03 (RRF) | 0.0-1.0 (semantic) |
| `confidence_low` triggers | empty query + unmet_filter | + below threshold |
| OOS rejection (food court hours etc.) | fails open | catches them |
| Eval Recall@3 on golden set | 0.96 | should be ≥ 0.96 |

The chatbot's escalation logic should be the same in both modes — just
check `confidence_low`. The layer hides the difference.

---

## Acronym + Singlish handling (you get this for free)

User queries can include Singapore-specific acronyms and Singlish; the
layer expands them before BM25 lookup. You don't need to pre-process.
Verified working terms include:

- Agencies: HDB, MSF, WSG, SSG, AIC, MOH, IMH, MOM, CPF, MOE
- Schemes: ComCare, Workfare, BTO, EHG, CCP, MCPP, MediFund, MediShield,
  CDA, CHAS, FAS, WIS, WSS
- Singlish: "kena" (got/became), "retrenched" (laid off), "ah ma"
  (grandmother), "ah pa" (grandfather), "jialat" (in trouble),
  "lah"/"lor"/"sia" particles
- Verbs: "retrenched", "downgraded", "demoted"

If a user uses a term that's not expanding properly (you'll see this as
weak retrieval), add it to `src/acronyms.py`'s `ACRONYMS` dict and
re-ingest — it's an append-only mapping.

---

## `debug_info` — the introspection surface

`debug_info` is intentionally rich so you can build diagnostics into
the chatbot (e.g., a "why this result?" expander for staff users).
Standard keys:

| Key | Type | Meaning |
|---|---|---|
| `preprocessed_query` | `str` | Query after whitespace trim |
| `dense_candidates` | `list[dict]` | Top-10 from Chroma: `{service_id, similarity, distance}` |
| `bm25_candidates` | `list[dict]` | Top-10 from BM25: `{service_id, bm25_score}` |
| `rrf_fused` | `list[dict]` | Top-10 after RRF: `{service_id, rrf_score, dense_rank, bm25_rank}` |
| `reranker_available` | `bool` | Is the LLM reranker configured? |
| `user_context_received` | `bool` | Did the chatbot pass a UserContext? |
| `filter_pre_count` | `int` | Candidate count before filter |
| `filter_post_count` | `int` | Candidate count after filter |
| `filter_dropped` | `list[dict]` | `[{service_id, reason}]` — human-readable drop reasons |
| `rerank_items` | `list[dict]` | LLM verdicts: `{service_id, score, justification}`. Empty if reranker off. |
| `rerank_top_score` | `float \| None` | The top LLM score, or None if reranker off |
| `confidence_threshold` | `float` | The 0.3 cutoff for low-confidence |
| `reason` | `str` (optional) | Set to "empty_query" or "unmet_user_context" when relevant |

**Useful pattern**: when surfacing services to a staff user (not the
resident), include `rerank_justification` next to each card. For
residents, hide it — it's an internal explanation.

**Useful pattern**: when `filter_dropped` is non-empty, you can build
an honest "I considered X but it requires Y" message for the resident.

---

## Setup (one-time, by you the chatbot engineer)

```powershell
# Clone the repo
git clone <repo-url> digital-oth
cd digital-oth

# Set up the Python env (must be 3.11 — Chroma wheels)
uv venv --python 3.11 .venv
.\.venv\Scripts\Activate.ps1
uv pip install -r requirements.txt

# Build the indices (no API key required)
python -m src.ingest

# Optional: drop your OpenAI key in .env to enable the reranker
copy .env.example .env  # then edit with: OPENAI_API_KEY=sk-...

# Smoke test
python -m src.retrieve "I lost my job and cannot pay HDB"

# Run the eval to confirm the layer works
python -m src.evaluate
```

The two index artefacts (`chroma_db/`, `bm25_index.pkl`) are
gitignored. Re-run `python -m src.ingest` whenever the catalogue
changes (services added, removed, or text edited).

---

## Example chatbot loop (pseudocode you can adapt)

```python
from src.retrieve import retrieve_services, UserContext

# You extract these from the conversation as confidence grows.
# Don't guess; pass None if unsure.
user_ctx = UserContext(
    citizenship=user_profile.get("citizenship"),
    age=user_profile.get("age"),
    employment_status=user_profile.get("employment_status"),
)

result = retrieve_services(user_message, user_context=user_ctx, top_k=3)

if result.confidence_low:
    reason = result.debug_info.get("reason")
    if reason == "empty_query":
        return "Could you describe your situation in a sentence?"
    if reason == "unmet_user_context":
        dropped = result.debug_info["filter_dropped"]
        return (
            "Based on what you've shared, the services I'd normally "
            "suggest aren't open to you. The ServiceSG counter at OTH "
            f"can help — they can look at this more broadly. "
            f"(Filter info: {dropped})"
        )
    # Below-threshold or unknown:
    return (
        "I'm not confident about this one. Would you like me to "
        "connect you with a staff member at the ServiceSG counter?"
    )

# Happy path: render the top services as cards.
for r in result.services:
    s = r.service
    yield {
        "title": s.service_name,
        "agency": s.agency,
        "summary": summarise(s.rich_description),  # your LLM
        "where": s.oth_location,
        "hours": s.operating_hours,
        "bring": [d.name for d in s.required_documents],
        "phone": s.contact.phone,
        "website": s.contact.website,
        "walk_in": s.walk_in_accepted,
        "wait_time": s.typical_processing_time,
        # Optional, for staff-facing UI:
        "_why": r.rerank_justification,
        "_score": r.relevance_score,
    }
```

---

## Anti-patterns (don't do these)

| ❌ Don't | ✅ Do |
|---|---|
| Re-parse `rich_description` for documents or eligibility | Read `service.required_documents` and `service.eligibility` directly |
| Catch exceptions from `retrieve_services` | It doesn't raise — check `confidence_low` instead |
| Pass a guessed `UserContext` to "be helpful" | Pass `None` for fields you don't know; wrong filters hide real answers |
| Ignore `confidence_low=True` and answer anyway | Escalate. Bluffing on social services is dangerous |
| Hard-code service IDs in the chatbot prompts | The catalogue can change; let retrieval decide |
| Display the raw `rerank_justification` to residents | It's internal explanation; paraphrase if you must surface it |
| Stuff the entire 23-service catalogue into the LLM context | Use retrieval; that's the whole point |
| Call `retrieve_services` more than once per user turn | One call returns the top-k you need |
| Tell the user "walk in to the AIC counter at OTH" | AIC has no counter at OTH (`location_type=Digital_Hotline`). Give phone/web + offer ServiceSG @ OTH for digital help |
| Hand-wave Digital_Hotline services with "you can apply online" | Be explicit: name the website, name the hotline, name ServiceSG @ OTH as the in-person fallback |

---

## When to call retrieval vs. when not to

**Call `retrieve_services` when**: the user has described a need or
situation ("I lost my job", "my mother needs help", "how do I apply
for X").

**Don't call retrieval for**:
- Greetings, farewells, small talk → respond directly.
- Follow-up questions about a service already shown → answer from the
  `Service` object you already have in conversation context.
- "What time does the food court close" / facility questions →
  out-of-scope, hand off.
- Asking to re-explain something just said → don't re-retrieve, just
  rephrase from prior turn.

A reasonable rule: if the user's message would need *any* information
about a government service or scheme, retrieve. Otherwise don't.

---

## Testing the integration

The retrieval layer is hermetic: it does not need network access except
optionally for the reranker. You can integration-test your chatbot
against it by:

1. Building the indices once in CI: `python -m src.ingest`.
2. Calling `retrieve_services` in your test harness as you would in
   production.
3. Asserting on `result.services[0].service.service_id`.

To **mock the retrieval layer** in unit tests (e.g., for the chatbot's
escalation logic), patch `retrieve_services` directly:

```python
from unittest.mock import patch
from src.retrieve import RetrievalResult

def test_chatbot_escalates_on_low_confidence():
    fake = RetrievalResult(
        services=[], confidence_low=True,
        query_decomposition=[], debug_info={"reason": "empty_query"},
    )
    with patch("your_chatbot.retrieve_services", return_value=fake):
        response = chatbot_handle("")
    assert "could you describe" in response.lower()
```

To run the golden-set eval against your local index:

```powershell
python -m src.evaluate
```

Targets: Recall@3 ≥ 0.85, OOS rejection = 100% (with key). Current
baseline on 39 queries: Recall@3 = 0.972, MRR = 0.917 (keyless).

---

## What's stable, what's not

**Stable** (frozen contract — the team has committed to these):
- `retrieve_services(query, user_context, top_k)` signature
- `UserContext`, `RetrievedService`, `RetrievalResult`, `Service`,
  `Eligibility`, `Document`, `Contact` field names and types
- `confidence_low` semantics (the three triggers above)
- `Service.location_type` values: `"Physical_OTH"` and `"Digital_Hotline"`
- The ServiceSG @ OTH hand-off pattern for `Digital_Hotline` services

**May evolve** (don't depend on exact values):
- Specific service descriptions and `oth_location` strings — these
  will be refined as we verify each scheme's actual OTH presence
- The set of services in the catalogue (will grow if more agencies are
  confirmed at OTH; will shrink if some are confirmed not to be)
- `debug_info` keys may gain new entries (won't drop existing ones)
- The internal reranker model (currently gpt-4o-mini) may change
- Acronym expansion dictionary will grow

If you find yourself depending on something not in the "stable" list,
flag it to the DB engineer before shipping.

---

## Questions or surprises

If the layer returns something that surprises you (wrong top result,
unexpected `confidence_low`, weird debug_info), the fastest debug is:

```powershell
python -m src.retrieve "<the exact query string>"
```

That prints the dense pool, BM25 pool, RRF fusion, and reranker output
side-by-side. 80% of "why is this wrong?" questions answer themselves
from that output.

If after that you still think the layer is doing the wrong thing, ping
the DB engineer with the query string + your expected vs. actual top
result — that's enough to reproduce.
