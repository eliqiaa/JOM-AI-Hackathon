"""Singapore-specific acronym and term expansion for the retrieval layer.

Expansion is **append-only**: if a known token appears in `text`, the
expansion phrase is appended after the original text. This means BM25
matches on BOTH the original acronym (e.g. "HDB") and the expanded form
("Housing Development Board") — which is the whole point of the hybrid
design, since user queries can come in either form.

Applied at two points (same function, same dict):
1. **Index time**, by `build_bm25_index()` (Phase 2).
2. **Query time**, by the BM25 leg of `retrieve_services()` (Phase 4+).
"""

from __future__ import annotations

import re

# Lowercase keys; lookup is case-insensitive. Values are expansion phrases
# that BM25 will tokenize alongside the original. Keep entries terse and
# heavy on synonyms — every word in the value becomes a BM25 term.
ACRONYMS: dict[str, str] = {
    # --- Agencies / departments ---
    "msf": "ministry of social and family development",
    "hdb": "housing development board public housing flat",
    "wsg": "workforce singapore jobs employment career",
    "aic": "agency for integrated care eldercare seniors",
    "mom": "ministry of manpower employment work",
    "moh": "ministry of health medical",
    "moe": "ministry of education school students",
    "iras": "inland revenue authority of singapore tax",
    "sso": "social service office welfare",
    "fsc": "family service centre counselling",
    "ntuc": "national trades union congress workers",
    "e2i": "employment and employability institute jobs",

    # --- Schemes / programmes ---
    "comcare": "community care financial assistance welfare safety net",
    "workfare": "low wage worker income supplement",
    "skillsfuture": "skills training course subsidy career",
    "medifund": "medical bill financial assistance hospital",
    "medisave": "healthcare savings account",
    "medishield": "health insurance hospital",
    "pioneer": "pioneer generation seniors elderly subsidy",
    "merdeka": "merdeka generation seniors elderly subsidy",
    "kidstart": "child development early intervention low income family",
    "bto": "build to order new hdb flat housing",
    "ccp": "career conversion programme mid career switch",
    "famnex": "family nexus wellness hub preconception pregnancy parenting child health",
    "ffl": "families for life council marriage parenting",
    "servicesg": "ServiceSG centre digital government services helpdesk singpass",
    "smf": "seniors mobility and enabling fund AIC mobility aids",
    "hcg": "home caregiving grant AIC monthly cash payout caregiver",
    "adl": "activities of daily living bathing dressing feeding mobility",
    "msw": "medical social worker hospital discharge planning",
    "cda": "child development account baby bonus matched savings child",
    "lifesg": "LifeSG app digital government services SingPass",

    # --- Identity / financial ---
    "cpf": "central provident fund retirement savings",
    "nric": "national registration identity card singapore citizen pr",
    "fin": "foreign identification number work pass holder",
    "coe": "certificate of entitlement car vehicle ownership",

    # --- Worker categories ---
    "pmet": "professional manager executive technician white collar",
    "ite": "institute of technical education vocational",
    "polytechnic": "post secondary diploma education",

    # --- Singlish / colloquial verbs (high-impact for query understanding) ---
    "retrench": "lose job unemployed laid off retrenchment",
    "retrenched": "lose job unemployed laid off retrenchment",
    "retrenchment": "lose job unemployed laid off",
    "kena": "got affected by suffered hit by experienced",
    "lobang": "opportunity deal connection",
}

_TERM_PATTERN = re.compile(
    r"\b(" + "|".join(re.escape(k) for k in ACRONYMS) + r")\b",
    re.IGNORECASE,
)


def expand_acronyms(text: str) -> str:
    """Append expansions for any known terms in `text`.

    Each matching term contributes its expansion phrase **once**, regardless of
    how many times it appears in `text`. The original text is preserved
    unchanged at the start of the returned string.

    Returns `text` unchanged if no terms match.
    """
    seen: set[str] = set()
    additions: list[str] = []
    for match in _TERM_PATTERN.finditer(text):
        key = match.group(1).lower()
        if key in seen:
            continue
        seen.add(key)
        additions.append(ACRONYMS[key])
    if not additions:
        return text
    return text + " " + " ".join(additions)
