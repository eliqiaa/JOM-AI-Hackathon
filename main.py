"""
OTH Buddy — Smart Concierge backend for Our Tampines Hub.

POST /api/chat
    Body: { "messages": [...] }
    Returns: { "reply": "..." }

Data sources:
- F&B + the info-counter fallback come from `database.json` (the
  retrieval layer doesn't cover food or facilities).
- Government services come from the retrieval layer in `src/retrieve.py`
  (see CHATBOT_INTEGRATION.md for the full contract). The retrieval
  layer is called once per turn on the latest user message and returns
  up to top_k structured Service objects, which are then injected into
  the LLM's system prompt.
"""

import json
import os
from pathlib import Path
from typing import Literal

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from fastapi.staticfiles import StaticFiles
from openai import OpenAI
from pydantic import BaseModel, Field

try:
    from src.retrieve import retrieve_services, UserContext, RetrievedService
except ImportError as e:
    raise RuntimeError(
        "Could not import src.retrieve. Copy the digital-oth retrieval "
        "package (the `src/` folder) into this directory, install its "
        "requirements, and run `python -m src.ingest` once before starting "
        "the server. See CHATBOT_INTEGRATION.md > Setup. "
        f"Original error: {e}"
    ) from e

load_dotenv()

OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
# gpt-4o-transcribe is OpenAI's newer transcription model, noticeably better
# than whisper-1 on accented English. Same per-minute price. Override via env.
WHISPER_MODEL = os.getenv("WHISPER_MODEL", "gpt-4o-transcribe")

# ElevenLabs TTS — high-quality voice reply, free tier ~10k chars/month.
# If ELEVENLABS_API_KEY is unset, /api/tts returns 503 and the frontend
# falls back to the browser's speechSynthesis voice automatically.
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
# Default voice = "Sarah" — one of the few "default" voices still usable on
# the free tier. ElevenLabs's older popular voices (Rachel, Aria) are now
# "library voices" requiring a paid plan when called via API. Known
# free-tier-safe IDs: Sarah=EXAVITQu4vr4xnSDxMaL, Laura=FGY2WhTYpPnrIDTdsKH5,
# George=JBFqnCBsd6RMkjVDRZzb. To use a custom voice, set ELEVENLABS_VOICE_ID
# in .env to its ID from https://elevenlabs.io/app/voice-library.
ELEVENLABS_VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID", "EXAVITQu4vr4xnSDxMaL")
# Model tiers: eleven_multilingual_v2 (best quality, slower) /
# eleven_turbo_v2_5 (fast, lower latency) / eleven_flash_v2_5 (cheapest).
ELEVENLABS_MODEL = os.getenv("ELEVENLABS_MODEL", "eleven_multilingual_v2")
ELEVENLABS_TTS_URL = (
    f"https://api.elevenlabs.io/v1/text-to-speech/{ELEVENLABS_VOICE_ID}"
)

DATABASE_PATH = Path(__file__).parent / "database.json"

# Whisper / gpt-4o-transcribe treats the `prompt` parameter as if it were the
# audio that came just *before* the current clip. Showing it natural Singlish
# sentences anchors the decoder to local phrasing — much more effective than a
# bare vocabulary list. Keep this under ~244 tokens (model limit).
WHISPER_SINGLISH_PROMPT = (
    "The speaker uses Singapore English (Singlish). Example phrases from the "
    "same speaker:\n"
    "\"How ah, where do I apply for ComCare?\"\n"
    "\"My ah ma kena retrenched already lah, very jialat.\"\n"
    "\"Eh, my BTO cannot pay liao, what to do sia?\"\n"
    "\"Like that lor, very tough one.\"\n"
    "\"Can ah? I need help with CPF for my parents.\"\n"
    "\"Where got financial assistance one?\"\n"
    "\"Alamak, I lost my job already, no money for makan.\"\n"
    "\"Uncle, where is the HDB branch ah?\"\n"
    "Acronyms used: HDB, BTO, CPF, ComCare, NRIC, SingPass, MSF, WSG, "
    "SkillsFuture, Workfare, MediShield, MediFund, ServiceSG, Tampines, OTH."
)

# Second-pass LLM correction over the raw Whisper transcript. Whisper tends to
# map short noisy particles to similar-sounding English words ("ah" → "are",
# "lah" → "law", "sia" → "see ya"); a small LLM with explicit examples is very
# good at undoing this. The pass is bounded (refuses corrections that change
# length wildly, falls through on failure) so a bad LLM call can never make
# the transcript *worse* than what Whisper produced.
SINGLISH_CORRECTION_SYSTEM = """\
You are a Singlish transcription corrector. Input: a rough English transcription \
of Singapore English (Singlish) speech that may contain mistranscribed particles, \
local slang, and Singapore government acronyms. Output: the speaker's likely \
intended Singlish utterance.

Common mistranscription patterns to fix:
- end-of-clause "are" / "uh" / "ha" / "hah"  →  "ah"
- end-of-clause "law" / "la" / "lap" / "laa"  →  "lah"
- end-of-clause "lore" / "law" (after a statement)  →  "lor"
- end-of-clause "see ya" / "sear" / "see" / "shah"  →  "sia"
- "alarm ma" / "alarm-uh"  →  "alamak"
- "jealot" / "jiu lat" / "jail at" / "gerlat"  →  "jialat"
- "kana"  →  "kena"
- "ma kan" / "mar can"  →  "makan"
- "Komkat" / "Kemcare" / "comcare"  →  "ComCare"
- "BDO" / "B.T.O." → "BTO"
- "HDP" / "H.D.B." → "HDB"
- "C.P.F."  →  "CPF"
- "sing pass"  →  "SingPass"
- "skills future"  →  "SkillsFuture"
- "ah ma" / "ar ma" (grandmother)  →  "ah ma"
- "ah pa" (grandfather)  →  "ah pa"

Rules:
1. Output ONLY the corrected transcription. No quotes, no preamble, no explanation.
2. Preserve the speaker's meaning exactly. Don't add or remove content.
3. Don't change words you're unsure about — only fix obvious mistranscriptions.
4. Keep punctuation and capitalization natural (sentence case).
5. If the input is already clean, return it unchanged."""


def correct_singlish_transcript(rough: str) -> str:
    """Run a small LLM cleanup pass over the raw Whisper transcript to fix
    Singlish particle mistranscriptions. Falls through silently on any
    failure or implausible output — the rough transcript is the worst case.
    """
    rough = rough.strip()
    if not rough or len(rough) < 3:
        return rough
    try:
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SINGLISH_CORRECTION_SYSTEM},
                {"role": "user", "content": rough},
            ],
            temperature=0.1,
        )
        corrected = (resp.choices[0].message.content or "").strip()
        if not corrected:
            return rough
        # Sanity check: refuse a correction that changed length by more than 2x.
        # Protects against the LLM hallucinating a paragraph or returning empty.
        if not (0.5 * len(rough) <= len(corrected) <= 2.0 * len(rough)):
            return rough
        return corrected
    except Exception:
        return rough

client = OpenAI()  # reads OPENAI_API_KEY from environment

app = FastAPI(title="OTH Buddy")

# Open CORS so the hackathon frontend can call this from anywhere.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage] = Field(..., min_length=1)
    # New UI lets users pick EN / ZH / MS on the welcome page. The directive
    # is appended server-side so the prompt stays out of the client.
    language: Literal["en", "zh", "ms"] = "en"


class ServiceCard(BaseModel):
    service_id: str
    service_name: str
    agency: str
    location_type: str
    oth_location: str
    operating_hours: dict
    required_documents: list[dict]
    walk_in_accepted: bool
    appointment_required: bool
    typical_processing_time: str
    phone: str | None = None
    website: str | None = None


class ChatResponse(BaseModel):
    reply: str
    services: list[ServiceCard] = []


LANGUAGE_DIRECTIVES: dict[str, str] = {
    "en": (
        "LANGUAGE: The user has selected English. Reply in English. "
        "Light Singlish is welcome if the user uses it.\n\n"
    ),
    "zh": (
        "LANGUAGE: The user has selected Chinese (中文). You MUST reply ONLY in "
        "Simplified Chinese (简体中文), regardless of which language the user "
        "types in. Use natural, warm Chinese suitable for elderly residents. "
        "Keep proper nouns (Our Tampines Hub, ServiceSG, ComCare, SingPass, "
        "MSF, HDB, CPF, IRAS, scheme names) in their original English form "
        "if they have no common Chinese name; everything else must be in "
        "Chinese.\n\n"
    ),
    "ms": (
        "LANGUAGE: The user has selected Bahasa Melayu. You MUST reply ONLY "
        "in Bahasa Melayu, regardless of which language the user types in. "
        "Use warm, simple Malay suitable for elderly residents. Keep proper "
        "nouns (Our Tampines Hub, ServiceSG, ComCare, SingPass, MSF, HDB, "
        "CPF, IRAS, scheme names) in their original English form; everything "
        "else must be in Bahasa Melayu.\n\n"
    ),
}


class TranscriptionResponse(BaseModel):
    text: str


class TTSRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=8000)


def load_database() -> dict:
    with open(DATABASE_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def format_retrieved_services(services: list[RetrievedService]) -> str:
    """Render the retrieval layer's top-k Service objects as a structured
    block the LLM can read directly. We never paraphrase or re-parse —
    structured fields go in verbatim so the LLM has the canonical truth.
    """
    if not services:
        return "(no government services matched this query — do not invent any)"

    blocks = []
    for r in services:
        s = r.service
        hours = "; ".join(f"{k}: {v}" for k, v in s.operating_hours.items()) or "—"
        docs = ", ".join(d.name for d in s.required_documents) or "—"
        elig = s.eligibility
        elig_parts = [f"citizenship: {', '.join(elig.citizenship)}"]
        if elig.age_min is not None:
            elig_parts.append(f"age ≥ {elig.age_min}")
        if elig.age_max is not None:
            elig_parts.append(f"age ≤ {elig.age_max}")
        if elig.income_ceiling_monthly_sgd is not None:
            elig_parts.append(f"household income ≤ S${elig.income_ceiling_monthly_sgd}/mo")
        if elig.employment_status:
            elig_parts.append(f"employment: {', '.join(elig.employment_status)}")
        if elig.other_criteria:
            # Trim verbose other_criteria so the prompt doesn't balloon — the
            # LLM needs the shape of each rule, not the full legalese.
            elig_parts.append("other: " + "; ".join(elig.other_criteria[:4]))

        blocks.append(
            f"### {s.service_name} ({s.service_id}) — {s.agency}\n"
            f"- Where at OTH: {s.oth_location}\n"
            f"- What it is: {s.rich_description}\n"
            f"- Eligibility: {'; '.join(elig_parts)}\n"
            f"- Bring: {docs}\n"
            f"- Hours: {hours}\n"
            f"- Walk-in: {'yes' if s.walk_in_accepted else 'no'} · "
            f"Appointment: {'required' if s.appointment_required else 'not required'}\n"
            f"- Typical processing time: {s.typical_processing_time}\n"
            f"- Phone: {s.contact.phone or '—'} · Website: {s.contact.website or '—'}"
        )
    return "\n\n".join(blocks)


def format_general_counters(counters: list) -> str:
    if not counters:
        return "(none configured)"
    blocks = []
    for c in counters:
        handles = "\n  - ".join(c.get("handles", []))
        blocks.append(
            f"### {c.get('name', 'Counter')} — {c.get('location', '')}\n"
            f"{c.get('description', '')}\n"
            f"Handles:\n  - {handles}" if handles else
            f"### {c.get('name', 'Counter')} — {c.get('location', '')}\n{c.get('description', '')}"
        )
    return "\n\n".join(blocks)


def build_system_prompt(
    food: list,
    counters: list,
    retrieved: list[RetrievedService],
    confidence_low: bool,
    fallback: dict,
    language: str = "en",
) -> str:
    food_json = json.dumps(food, ensure_ascii=False, indent=2)
    counters_block = format_general_counters(counters)
    services_block = format_retrieved_services(retrieved)

    confidence_note = ""
    if confidence_low:
        confidence_note = (
            "\n> NOTE: Retrieval did NOT find a strong specific-scheme match for "
            "this query. If the question is about a broad government topic "
            "(CPF, IRAS, SingPass, MOM, generic HDB queries), point the user "
            "to the ServiceSG counter above. For scheme-specific details that "
            "aren't covered, you MAY use web_search (see policy below).\n"
        )

    fallback_name = fallback.get("name", "OTH Information Counter")
    fallback_loc = fallback.get("location", "Level 1, Main Atrium")

    language_directive = LANGUAGE_DIRECTIVES.get(language, LANGUAGE_DIRECTIVES["en"])

    return language_directive + f"""You are **OTH Buddy**, the Smart Concierge for Our Tampines Hub (OTH) in Singapore.

# Your persona
- Warm, empathetic, patient, and encouraging — like a kind neighbour who knows the building inside out.
- Singaporean tone: friendly and clear, plain English. You may use light local terms ("kopi", "uncle/auntie") only when the user's message has the same vibe — never forced.
- Many visitors are stressed (job loss, money worries, housing). Acknowledge their feelings before jumping into directions.

# Decision tree (read this FIRST, every turn)

Classify the user's message into one of these buckets and act accordingly:

1. **Food / drinks / makan** → use the F&B block (block 1). Recommend 2-3 specific places.
2. **Specific scheme already in the retrieval block** (block 3) → use that block's data. Build a step-by-step route.
3. **Broad government enquiry** (CPF, IRAS, SingPass, MOM, generic HDB question, general tax) → answer using the ServiceSG counter (block 2). NEVER say "I'm not sure" for these — ServiceSG is exactly the counter for them.
4. **Scheme-specific details NOT in block 3** (e.g. "how much CPF can I withdraw at 55", "what's the latest BTO income ceiling", "MediShield Life premiums", "Workfare 2026 amounts") → call **web_search** to fetch current numbers/rules from .gov.sg, then route the user to the right counter (ServiceSG for CPF/IRAS/SingPass/MOM, HDB Tampines Branch for HDB, MSF SSO for financial help, WSG Careers Connect for jobs/SkillsFuture).
5. **Non-government facility/amenity question** (food court closing time, lost-and-found, swimming pool, library, parking) → route to the {fallback_name} at {fallback_loc}.
6. **Greeting / small talk / follow-up about a service already mentioned** → respond directly, no search, no routing.

The "I'm not sure" Information Counter handoff is ONLY for bucket 5. NEVER use it for any government / financial / scheme question.

# Your sources of truth (consult in this order, then web search only if needed)

## 1. Food & Beverage at OTH
```json
{food_json}
```

## 2. General service counters at OTH (use for broad government enquiries)
{counters_block}

## 3. Specific schemes available at OTH counters (retrieval-filtered for THIS query)
{services_block}
{confidence_note}
## 4. Information Counter (NON-government facility questions only — bucket 5 above)
For genuine facility / amenity questions only, route to **{fallback_name}** at **{fallback_loc}**. Compose your own warm one-line message; do not use a stock phrase. Government / financial / scheme questions NEVER go here.

# Web search policy (the `web_search` tool)

You have access to a web_search tool. It is the LAST resort — sources 1-4 above are the source of truth.

USE web_search ONLY when:
- The user asks for scheme-specific details (eligibility numbers, dollar amounts, dates, application URLs, latest rules) that are NOT in any block above. Examples: "how much CPF can I withdraw at 55", "what's the latest BTO income ceiling", "is there a new MediShield premium subsidy".
- The user asks about a related Singapore government scheme not in the blocks above (e.g. MediFund tiers, CDC vouchers, Workfare amounts).

DO NOT use web_search for:
- Anything already covered in blocks 1-4 — read them first.
- F&B / facility / small-talk / greetings.
- "Where do I go for X" — point to the relevant counter from the blocks above. The blocks already tell you where things are at OTH.
- General Singapore questions unrelated to government services at OTH.

When you DO search:
- Prefer **.gov.sg** sources (cpf.gov.sg, hdb.gov.sg, msf.gov.sg, ssg-wsg.gov.sg, iras.gov.sg, moh.gov.sg, mom.gov.sg). Quote specific numbers and dates verbatim — don't paraphrase loosely.
- **Always tie the answer back to OTH** at the end with a concrete in-person step:
  - CPF / IRAS / SingPass / MOM / general gov enquiries → ServiceSG counter, Level 1, #01-21.
  - HDB scheme-specific → HDB Tampines Branch.
  - Financial assistance / social services → MSF SSO Tampines.
  - Career / SkillsFuture → WSG Careers Connect.
  - Don't know → Information Counter, Level 1, Main Atrium.
- If the search returns nothing useful, say so plainly and route the user to the right counter.

# How to answer

## Food queries
Recommend 2-3 specific F&B places. For each: exact name + exact location + one-line reason tailored to the user (budget, halal, group, quick bite, quiet, etc.).

## Government-service / financial-distress queries (specific schemes covered by block 3)
- Acknowledge their situation in 1-2 warm sentences. Be real, not saccharine.
- Map a logical step-by-step physical route through OTH, ordered by urgency.
- For each step: service name, exact oth_location, what to do, what to bring (from the `Bring:` line), walk-in vs appointment.
- End with a practical tip on bringing NRIC + recent payslips/bank statements + any letters received, only when relevant.

## Broad government enquiries (CPF, IRAS, SingPass, MOM, generic HDB)
Point them to the **ServiceSG counter at Level 1, #01-21** with a one-line note on what to bring (NRIC always; for CPF, their last CPF statement; for IRAS, last tax filing letter). If they want specific scheme details (e.g. CPF withdrawal amount at 55), use web_search to get the number, then still route them to ServiceSG for in-person help.

## Mixed queries ("settle my HDB matter, then grab lunch")
Handle the government step first, then suggest 1-2 F&B options nearby on the same level if possible.

# Hard rules — do not break
1. For places listed in blocks 1-4, never invent details. Names, locations, hours, documents, eligibility — use only what's in the blocks. If the blocks don't have the detail, either web_search-and-quote, or say you don't have that info and suggest the right counter.
2. For schemes not in the blocks, use web_search and quote .gov.sg sources. Don't make up numbers, dates, or rules.
3. Never give medical, legal, or financial advice beyond pointing to the right counter.
4. Never promise outcomes ("you will definitely get the loan"). Use "they can assess your case".
5. If the user is in immediate distress (mentions self-harm, abuse, no food tonight, nowhere to sleep), gently share the 24-hour ComCare hotline 1800-222-0000 alongside the route you suggest.
6. Keep replies concise and actionable. Always include exact level + unit number when naming a place.

# OUTPUT FORMAT (STRICT — overrides any earlier examples)
- Reply in PLAIN TEXT only. Do NOT use any markdown: no #, ##, ### headers; no ** for bold; no * or - for bullets; no backticks. The frontend renders the visual roadmap from structured data, so your text only needs to be a short empathetic intro plus a numbered roadmap.
- Structure every actionable answer like this:
    Line 1-2: warm acknowledgement of the user's situation (1-2 sentences, plain prose).
    Then a blank line.
    Then numbered steps "1. ...", "2. ...", "3. ..." — each step is ONE service from block 3 (specific schemes) or block 2 (counters). One sentence per step is best, two max.
    Then a blank line.
    Closing line: one sentence of encouragement or a "bring NRIC" reminder.
- Each numbered step in your text MUST correspond to a service the user can take action on at OTH. Do not number lines that aren't services.

# OUT-OF-SCOPE RULE (STRICT)
If part of the user's question has no matching service in block 3 above and is also not handled by the ServiceSG counter (block 2) — for example, buying a hospital bed, finding a wheelchair, choosing a babysitter, generic shopping, "where to find X product" — do NOT suggest external alternatives (Carousell, Shopee, Amazon, "google it", "check online", third-party shops). Acknowledge briefly that OTH doesn't offer that, and immediately pivot to the OTH services that DO help with the rest of the user's question. Never invent a step.

# ELIGIBILITY GATE (STRICT — no wasted trips)
Every service in block 3 has structured eligibility: citizenship (citizen / PR / foreigner / any), age range (age_min, age_max), income ceiling per month (income_ceiling_monthly_sgd), employment status (employed / self_employed / unemployed / any), plus other_criteria. Before you put any service in the roadmap:

1. CHECK: does what the user has told you in this conversation clearly satisfy that service's eligibility? Read the eligibility line of every service you're considering.

2. ASK if you don't know enough — this is the default. If ANY of these key facts about the person involved is unknown to you from the conversation so far, your reply this turn is a clarifying question and NOTHING ELSE — no roadmap, no service names, no numbered steps:
   - Citizenship status (citizen / PR / foreigner)
   - Age (or rough age band — "in their 60s" is fine)
   - Income level (rough monthly figure or "low-wage" / "mid" / "above $X")
   - Employment status when employment matters for the schemes you're considering
   - Any other criterion that gates the services in block 3 (e.g. HDB flat type for Silver Support, disability status, etc.)

   Examples of the right response when uncertain:
   - "Quick check so I don't send you somewhere wrong — roughly what's your dad's monthly income, and is he a Singaporean citizen? Also how old is he?"
   - "Before I point you to the right counter — is your mum on PR or citizenship, and was she working before retirement?"

   Wrong response: listing services with hedges like "if he qualifies" or "you may qualify for". Hedging is the failure mode this rule exists to prevent. Either you KNOW they qualify (then say so), or you DON'T know yet (then ASK). No middle ground.

   When asking: warm, one or two questions max, end with the question. Do NOT also list services in the same reply.

3. EXCLUDE silently. If the user has already said something that makes a service a clear no (e.g., they earn S$5,000/month but the service has a S$2,500 ceiling; they're 30 and the service is age 65+; they're not a citizen and the service is citizen-only), do NOT include that service in the roadmap. Don't even mention it. Move on to ones they DO qualify for.

4. NAME the eligibility match. When you DO list a service, slip in one short eligibility-fit phrase so the user knows you've checked: "this is for households under S$2,500/month — sounds like you" or "ComCare LTA is for citizens or PRs unable to work — fits your dad's situation". One phrase, not a paragraph.

5. NEVER fabricate eligibility. If the eligibility data on a service isn't in block 3, don't invent numbers. Say "the team at the counter assesses each case" instead.

The whole point of asking is to spare the user a wasted bus ride. Default to asking when uncertain; default to recommending only when sure.

# FINAL FORMAT REMINDER (read this before you type)
- No markdown. No **, no *, no ###, no - bullets, no `backticks`. Plain text only.
- Use numbered steps "1. " "2. " for the roadmap. Numbered ONLY for services from block 3 or counters from block 2.
- If you don't have enough info to clear the ELIGIBILITY GATE for a given service, ask the missing question(s) instead of listing it. Never hedge with "you may qualify" or "if you qualify" — ask, get the answer, then recommend.

Now respond to the user's message."""


@app.get("/health")
def health():
    return {"status": "ok", "service": "OTH Buddy"}


@app.post("/api/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    last = req.messages[-1]
    if last.role != "user" or not last.content.strip():
        raise HTTPException(status_code=400, detail="last message must be a non-empty user message")

    try:
        db = load_database()
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="database.json not found")
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"database.json is invalid: {e}")

    retrieval = retrieve_services(last.content, user_context=None, top_k=3)

    system_prompt = build_system_prompt(
        food=db.get("Food_and_Beverage", []),
        counters=db.get("General_Service_Counters", []),
        retrieved=retrieval.services,
        confidence_low=retrieval.confidence_low,
        fallback=db.get(
            "Fallback",
            {"name": "OTH Information Counter", "location": "Level 1, Main Atrium"},
        ),
        language=req.language,
    )

    # Use the OpenAI Responses API rather than Chat Completions so we get the
    # built-in `web_search_preview` tool. The model decides per-question
    # whether to search — the system prompt above tells it to prefer the
    # local blocks and only search for scheme-specific details that aren't
    # covered. From our side it's still a single round-trip; the model
    # handles search invocation internally and returns the final reply.
    input_items = [{"role": m.role, "content": m.content} for m in req.messages]

    try:
        response = client.responses.create(
            model=OPENAI_MODEL,
            instructions=system_prompt,
            input=input_items,
            tools=[{"type": "web_search_preview"}],
            temperature=0.6,
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"OpenAI request failed: {e}")

    reply = (getattr(response, "output_text", "") or "").strip()
    cards = [
        ServiceCard(
            service_id=r.service.service_id,
            service_name=r.service.service_name,
            agency=r.service.agency,
            location_type=r.service.location_type,
            oth_location=r.service.oth_location,
            operating_hours=r.service.operating_hours,
            required_documents=[d.model_dump() for d in r.service.required_documents],
            walk_in_accepted=r.service.walk_in_accepted,
            appointment_required=r.service.appointment_required,
            typical_processing_time=r.service.typical_processing_time,
            phone=r.service.contact.phone,
            website=r.service.contact.website,
        )
        for r in retrieval.services
    ]
    return ChatResponse(reply=reply, services=cards)


@app.post("/api/transcribe", response_model=TranscriptionResponse)
async def transcribe(audio: UploadFile = File(...)):
    """Speech-to-text for the mic button. The frontend records a short
    audio blob via MediaRecorder and POSTs it here; we forward to Whisper
    with an English language hint and a Singlish vocabulary prompt, then
    return the text. The frontend fills its textarea with the result so
    the user can review/edit before pressing Send — STT mistakes are
    common with elderly speakers and auto-sending a wrong transcript is
    a worse UX than letting them correct it.
    """
    audio_bytes = await audio.read()
    if not audio_bytes:
        raise HTTPException(status_code=400, detail="empty audio file")

    filename = audio.filename or "speech.webm"
    mime = audio.content_type or "audio/webm"

    try:
        result = client.audio.transcriptions.create(
            model=WHISPER_MODEL,
            file=(filename, audio_bytes, mime),
            language="en",
            prompt=WHISPER_SINGLISH_PROMPT,
            temperature=0,
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Whisper request failed: {e}")

    rough = (result.text or "").strip()
    corrected = correct_singlish_transcript(rough)
    return TranscriptionResponse(text=corrected)


@app.post("/api/tts")
def tts(req: TTSRequest) -> Response:
    """Generate a voice reply via ElevenLabs.

    Returns audio/mpeg (MP3) bytes the frontend can play directly. Returns
    503 (not 502) when the key is missing so the frontend can distinguish
    "not configured" from "ElevenLabs errored" and pick the speechSynthesis
    fallback silently in the first case.
    """
    if not ELEVENLABS_API_KEY:
        raise HTTPException(status_code=503, detail="ELEVENLABS_API_KEY not set in .env")

    body = {
        "text": req.text,
        "model_id": ELEVENLABS_MODEL,
        # Defaults from ElevenLabs's own docs — stable enough for an
        # information-bot use case without sounding monotonous.
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.75},
    }

    try:
        resp = httpx.post(
            ELEVENLABS_TTS_URL,
            headers={
                "xi-api-key": ELEVENLABS_API_KEY,
                "Accept": "audio/mpeg",
                "Content-Type": "application/json",
            },
            json=body,
            timeout=30.0,
        )
    except httpx.RequestError as e:
        raise HTTPException(status_code=502, detail=f"ElevenLabs request failed: {e}")

    if resp.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail=f"ElevenLabs error {resp.status_code}: {resp.text[:500]}",
        )

    return Response(content=resp.content, media_type="audio/mpeg")


# Mount the OTH Buddy multi-page UI at /. Declared AFTER the /api/* and
# /health routes so those still resolve — FastAPI matches explicit routes
# before mounts. html=True serves index.html for /, and any other asset
# (styles.css, script.js, images/, Videos/) resolves to a file in the dir.
_UI_DIR = Path(__file__).parent / "my-kopi-kaki-app"
app.mount("/", StaticFiles(directory=_UI_DIR, html=True), name="ui")
