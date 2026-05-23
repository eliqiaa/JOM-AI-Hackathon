"""Localhost demo for Digital OTH retrieval.

Run:
    .venv/Scripts/python.exe -m uvicorn demo.app:app --reload

Then open http://127.0.0.1:8000

Single-file FastAPI app with embedded HTML/CSS/JS. No new dependencies.
Wraps `src.retrieve.retrieve_services` so the website returns the EXACT
same RetrievalResult the chatbot will consume.
"""

from __future__ import annotations

from typing import Literal

from fastapi import FastAPI
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel, ConfigDict, Field

from src.retrieve import UserContext, retrieve_services

app = FastAPI(title="Digital OTH — Retrieval Demo")


class QueryRequest(BaseModel):
    """Incoming JSON from the browser."""

    model_config = ConfigDict(extra="forbid")

    query: str
    citizenship: Literal["citizen", "PR", "foreigner"] | None = None
    age: int | None = None
    top_k: int = Field(default=3, ge=1, le=10)


@app.post("/api/retrieve")
def api_retrieve(payload: QueryRequest) -> JSONResponse:
    ctx = None
    if payload.citizenship is not None or payload.age is not None:
        ctx = UserContext(citizenship=payload.citizenship, age=payload.age)
    result = retrieve_services(payload.query, user_context=ctx, top_k=payload.top_k)
    return JSONResponse(result.model_dump(mode="json"))


@app.get("/", response_class=HTMLResponse)
def index() -> HTMLResponse:
    return HTMLResponse(_PAGE)


_PAGE = r"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Digital OTH — Retrieval</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,700;1,9..144,400;1,9..144,500&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root {
    --paper:        #FAF6EE;
    --paper-2:      #F2EBDC;
    --ink:          #1B1714;
    --ink-2:        #5B524A;
    --rule:         #DCCFB5;
    --amber:        #B86C1E;
    --amber-2:      #8E4F12;
    --teal:         #2E5F5F;
    --rust:         #993322;
    --grain:        rgba(28,22,18,0.025);
  }
  * { box-sizing: border-box; }
  html, body {
    margin: 0; padding: 0;
    background: var(--paper);
    color: var(--ink);
    font-family: 'IBM Plex Sans', system-ui, sans-serif;
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  body::before {
    content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 1;
    background-image:
      radial-gradient(var(--grain) 1px, transparent 1px),
      radial-gradient(var(--grain) 1px, transparent 1px);
    background-size: 3px 3px, 7px 7px;
    background-position: 0 0, 1px 2px;
    opacity: 0.7;
  }
  .wrap {
    position: relative; z-index: 2;
    max-width: 920px; margin: 0 auto; padding: 64px 32px 120px;
  }

  /* Masthead */
  .masthead { display: flex; justify-content: space-between; align-items: baseline;
    border-bottom: 1px solid var(--rule); padding-bottom: 14px; margin-bottom: 56px; }
  .brand { font-family: 'IBM Plex Mono', monospace; font-size: 11px;
    letter-spacing: 0.18em; text-transform: uppercase; color: var(--ink-2); }
  .brand .dot { color: var(--amber); }
  .edition { font-family: 'IBM Plex Mono', monospace; font-size: 11px;
    color: var(--ink-2); letter-spacing: 0.1em; }

  /* Hero */
  h1.headline {
    font-family: 'Fraunces', 'Times New Roman', serif;
    font-weight: 400;
    font-variation-settings: 'opsz' 144, 'SOFT' 50;
    font-size: clamp(40px, 6.8vw, 78px);
    line-height: 1.02; letter-spacing: -0.02em;
    margin: 0 0 8px;
  }
  h1.headline em {
    font-style: italic; color: var(--amber);
    font-variation-settings: 'opsz' 144, 'SOFT' 100;
  }
  .deck {
    font-family: 'Fraunces', serif; font-style: italic;
    font-size: 19px; color: var(--ink-2); max-width: 580px;
    line-height: 1.45; margin: 0 0 40px;
  }

  /* Search form */
  form { margin-bottom: 16px; }
  .input-row { position: relative; display: flex; align-items: center;
    border-bottom: 2px solid var(--ink); padding: 14px 0; gap: 14px; }
  .input-row label.qmark {
    font-family: 'Fraunces', serif; font-style: italic; font-size: 22px;
    color: var(--amber); user-select: none;
  }
  #q {
    flex: 1; border: 0; background: transparent; outline: none;
    font-family: 'Fraunces', serif; font-size: 22px; color: var(--ink);
    padding: 0; font-weight: 400;
  }
  #q::placeholder { color: var(--ink-2); font-style: italic; opacity: 0.75; }

  .filters {
    display: flex; gap: 28px; flex-wrap: wrap; align-items: center;
    margin-top: 18px; font-family: 'IBM Plex Mono', monospace; font-size: 12px;
    letter-spacing: 0.08em; color: var(--ink-2); text-transform: uppercase;
  }
  .filters > div { display: flex; align-items: center; gap: 10px; }
  .filters select, .filters input[type=number] {
    border: 0; border-bottom: 1px dotted var(--ink-2); background: transparent;
    padding: 2px 4px; font-family: 'IBM Plex Mono', monospace; font-size: 12px;
    color: var(--ink); width: 110px; outline: none;
  }
  .filters input[type=number] { width: 60px; }
  .filters select:focus, .filters input:focus { border-bottom-color: var(--amber); }
  button {
    margin-top: 22px;
    background: var(--ink); color: var(--paper); border: 0;
    font-family: 'IBM Plex Mono', monospace; font-size: 12px;
    letter-spacing: 0.16em; text-transform: uppercase;
    padding: 14px 22px; cursor: pointer;
    transition: background 0.18s ease;
  }
  button:hover { background: var(--amber-2); }
  button:disabled { background: var(--ink-2); cursor: wait; }

  /* Examples */
  .examples { margin-top: 28px; font-family: 'IBM Plex Mono', monospace;
    font-size: 11px; color: var(--ink-2); letter-spacing: 0.06em; }
  .examples .lbl { display: block; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.14em; }
  .examples button.eg {
    background: transparent; color: var(--teal); border: 1px dashed var(--rule);
    padding: 6px 10px; margin: 0 6px 6px 0; font-family: inherit; font-size: 11px;
    letter-spacing: 0.02em; text-transform: none; cursor: pointer; }
  .examples button.eg:hover { background: var(--paper-2); color: var(--ink); border-style: solid; }

  /* Confidence banner */
  .banner { margin: 48px 0 0; padding: 18px 22px; border-left: 3px solid var(--rust);
    background: linear-gradient(to right, rgba(153,51,34,0.06), transparent);
    font-family: 'Fraunces', serif; font-style: italic; font-size: 18px; color: var(--ink); }
  .banner .tag { display: inline-block; margin-right: 12px; font-family: 'IBM Plex Mono', monospace;
    font-style: normal; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--rust); background: rgba(153,51,34,0.1); padding: 4px 8px; border-radius: 2px; }

  /* Results */
  .results { margin-top: 48px; }
  .results-meta {
    font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--ink-2);
    letter-spacing: 0.12em; text-transform: uppercase; padding-bottom: 12px;
    border-bottom: 1px solid var(--rule); display: flex; justify-content: space-between;
  }
  article.result {
    display: grid; grid-template-columns: 70px 1fr; gap: 24px;
    padding: 36px 0; border-bottom: 1px solid var(--rule);
    opacity: 0; transform: translateY(8px);
    animation: rise 0.55s cubic-bezier(.2,.7,.2,1) forwards;
  }
  article.result:nth-child(1) { animation-delay: 0.08s; }
  article.result:nth-child(2) { animation-delay: 0.18s; }
  article.result:nth-child(3) { animation-delay: 0.28s; }
  article.result:nth-child(4) { animation-delay: 0.38s; }
  article.result:nth-child(5) { animation-delay: 0.48s; }
  @keyframes rise { to { opacity: 1; transform: translateY(0); } }

  .roman {
    font-family: 'Fraunces', serif; font-style: italic;
    font-variation-settings: 'opsz' 144;
    font-size: 54px; color: var(--amber); line-height: 1; font-weight: 300;
    user-select: none;
  }
  .result h2 {
    font-family: 'Fraunces', serif; font-weight: 500;
    font-variation-settings: 'opsz' 36;
    font-size: 28px; line-height: 1.15; margin: 0 0 6px; letter-spacing: -0.005em;
  }
  .agency {
    font-family: 'IBM Plex Mono', monospace; font-size: 11px;
    color: var(--ink-2); letter-spacing: 0.1em; text-transform: uppercase;
    margin-bottom: 18px;
  }
  .agency .id { color: var(--amber); }
  .score-row {
    display: flex; align-items: center; gap: 14px; margin: 14px 0 18px;
    font-family: 'IBM Plex Mono', monospace; font-size: 11px;
    color: var(--ink-2); letter-spacing: 0.08em;
  }
  .score-bar {
    flex: 1; max-width: 220px; height: 3px; background: var(--paper-2); position: relative;
  }
  .score-bar::after {
    content: ''; position: absolute; left: 0; top: 0; height: 100%;
    width: var(--w, 0%); background: var(--ink);
    transition: width 0.6s cubic-bezier(.2,.7,.2,1);
  }
  .score-val { color: var(--ink); font-weight: 500; }

  .justification {
    font-family: 'Fraunces', serif; font-style: italic; font-size: 19px;
    color: var(--ink); line-height: 1.4; border-left: 2px solid var(--amber);
    padding: 4px 0 4px 16px; margin: 0 0 22px;
  }

  dl.facts {
    display: grid; grid-template-columns: 110px 1fr;
    gap: 8px 22px; margin: 0; font-size: 14px; line-height: 1.5;
  }
  dl.facts dt {
    font-family: 'IBM Plex Mono', monospace; font-size: 10px;
    color: var(--ink-2); letter-spacing: 0.16em; text-transform: uppercase;
    padding-top: 4px;
  }
  dl.facts dd { margin: 0; color: var(--ink); }
  dl.facts dd .muted { color: var(--ink-2); }
  dl.facts dd a { color: var(--teal); text-decoration: underline; text-underline-offset: 2px; }
  dl.facts ul { margin: 0; padding-left: 16px; }
  dl.facts ul li { margin-bottom: 2px; }

  .flags { display: inline-flex; gap: 8px; margin-left: 8px; }
  .flag {
    font-family: 'IBM Plex Mono', monospace; font-size: 10px;
    letter-spacing: 0.1em; text-transform: uppercase;
    padding: 2px 8px; border: 1px solid var(--rule); border-radius: 2px;
    color: var(--ink-2);
  }
  .flag.on { color: var(--teal); border-color: var(--teal); }
  /* location_type pill — sits next to the service ID up top */
  .loc-pill {
    display: inline-block; margin-left: 10px;
    font-family: 'IBM Plex Mono', monospace; font-size: 9px;
    letter-spacing: 0.16em; text-transform: uppercase;
    padding: 3px 9px; border-radius: 999px; font-weight: 500;
  }
  .loc-pill.physical { background: rgba(46,95,95,0.12); color: var(--teal); border: 1px solid rgba(46,95,95,0.3); }
  .loc-pill.digital  { background: rgba(184,108,30,0.12); color: var(--amber-2); border: 1px solid rgba(184,108,30,0.35); }
  .handoff {
    margin: 12px 0 18px; padding: 12px 16px;
    background: rgba(184,108,30,0.06); border-left: 2px solid var(--amber);
    font-family: 'IBM Plex Sans', sans-serif; font-size: 13px; line-height: 1.5; color: var(--ink);
  }
  .handoff strong { color: var(--amber-2); font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; font-size: 10px; }

  /* Debug */
  details.debug {
    margin-top: 64px; border-top: 1px dashed var(--rule); padding-top: 24px;
    font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--ink-2);
  }
  details.debug summary {
    cursor: pointer; letter-spacing: 0.16em; text-transform: uppercase;
    font-size: 11px; user-select: none;
  }
  details.debug summary:hover { color: var(--ink); }
  .dbg-grid {
    display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 32px; margin-top: 22px;
  }
  .dbg-grid h3 {
    font-family: 'IBM Plex Mono', monospace; font-size: 10px;
    letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink);
    margin: 0 0 10px; border-bottom: 1px solid var(--rule); padding-bottom: 6px;
  }
  .dbg-row { display: flex; justify-content: space-between; padding: 2px 0; font-size: 11px; }
  .dbg-row .sid { color: var(--ink); }
  .dbg-row .num { color: var(--ink-2); font-variant-numeric: tabular-nums; }
  .dbg-meta {
    margin-top: 24px; padding: 14px 16px; background: var(--paper-2); border-radius: 2px;
    display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px 24px;
  }
  .dbg-meta div { font-size: 11px; }
  .dbg-meta .k { color: var(--ink-2); letter-spacing: 0.08em; text-transform: uppercase; }
  .dbg-meta .v { color: var(--ink); }

  /* Initial / empty / error states */
  .state {
    margin-top: 80px; padding: 40px 0; text-align: center;
    font-family: 'Fraunces', serif; font-style: italic;
    color: var(--ink-2); font-size: 22px; line-height: 1.4;
  }
  .state.error { color: var(--rust); }

  /* Footer */
  footer {
    margin-top: 96px; padding-top: 24px; border-top: 1px solid var(--rule);
    font-family: 'IBM Plex Mono', monospace; font-size: 10px;
    color: var(--ink-2); letter-spacing: 0.14em; text-transform: uppercase;
    display: flex; justify-content: space-between;
  }

  /* Loading state */
  body.loading #q { animation: pulse 1.2s ease-in-out infinite; }
  @keyframes pulse {
    0%, 100% { opacity: 1; } 50% { opacity: 0.55; }
  }

  @media (max-width: 700px) {
    .wrap { padding: 40px 22px 80px; }
    article.result { grid-template-columns: 1fr; gap: 8px; }
    .roman { font-size: 36px; }
    dl.facts { grid-template-columns: 1fr; gap: 4px 0; }
    dl.facts dt { padding-top: 12px; }
    .dbg-grid { grid-template-columns: 1fr; }
  }
</style>
</head>
<body>
<div class="wrap">

  <div class="masthead">
    <div class="brand">Tampines Hub<span class="dot"> · </span>Concierge Retrieval</div>
    <div class="edition">vol I · prompt console</div>
  </div>

  <h1 class="headline">What does someone in <em>Tampines</em> need?</h1>
  <p class="deck">Type a worry, a question, or the name of a scheme. The retriever surfaces the three services at OTH most likely to help — with the reasoning shown.</p>

  <form id="form" autocomplete="off">
    <div class="input-row">
      <label class="qmark" for="q">¶</label>
      <input id="q" name="q" type="text" placeholder="kena retrenched, cannot pay HDB instalment…" required>
    </div>
    <div class="filters">
      <div><span>citizenship</span>
        <select id="citizenship">
          <option value="">— any —</option>
          <option value="citizen">citizen</option>
          <option value="PR">PR</option>
          <option value="foreigner">foreigner</option>
        </select>
      </div>
      <div><span>age</span>
        <input id="age" type="number" min="0" max="120" placeholder="—">
      </div>
      <div><span>top</span>
        <input id="topk" type="number" min="1" max="10" value="3">
      </div>
    </div>
    <button type="submit" id="submit">Find services →</button>

    <div class="examples">
      <span class="lbl">try one</span>
      <button class="eg" type="button">my wife is pregnant, where can we get support</button>
      <button class="eg" type="button">kena retrenched at 50, family needs food</button>
      <button class="eg" type="button">my elderly mother had a stroke and I need help</button>
      <button class="eg" type="button">elderly person needs help with SingPass at OTH</button>
      <button class="eg" type="button">FamNex events for families</button>
      <button class="eg" type="button">where can I play badminton at OTH</button>
    </div>
  </form>

  <div id="out">
    <div class="state">Awaiting a query.</div>
  </div>

  <footer>
    <span>Digital OTH · Hybrid RAG</span>
    <span>20 services · MiniLM + BM25 + gpt-4o-mini</span>
  </footer>
</div>

<script>
const form     = document.getElementById('form');
const out      = document.getElementById('out');
const submitB  = document.getElementById('submit');
const qInput   = document.getElementById('q');

const escapeHTML = s => String(s ?? '').replace(/[&<>"']/g, c => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const roman = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

document.querySelectorAll('button.eg').forEach(b => {
  b.addEventListener('click', () => {
    qInput.value = b.textContent;
    form.requestSubmit();
  });
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = qInput.value.trim();
  if (!query) return;

  const citizenship = document.getElementById('citizenship').value || null;
  const ageRaw      = document.getElementById('age').value;
  const age         = ageRaw === '' ? null : parseInt(ageRaw, 10);
  const top_k      = parseInt(document.getElementById('topk').value, 10) || 3;

  document.body.classList.add('loading');
  submitB.disabled = true;
  submitB.textContent = 'Retrieving…';

  try {
    const res = await fetch('/api/retrieve', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ query, citizenship, age, top_k })
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    render(query, data);
  } catch (err) {
    out.innerHTML = `<div class="state error">Retrieval failed. ${escapeHTML(err.message)}</div>`;
  } finally {
    document.body.classList.remove('loading');
    submitB.disabled = false;
    submitB.textContent = 'Find services →';
  }
});

function render(query, data) {
  const parts = [];

  if (data.confidence_low) {
    const reason = data.debug_info?.reason || 'below_threshold';
    const msgs = {
      empty_query: 'No query was given.',
      unmet_user_context: 'No service at OTH fits the citizenship or age you specified. Try relaxing one of the filters, or escalate to OTH front-desk staff.',
      below_threshold: 'The retriever is uncertain about this one. Consider escalating to OTH front-desk staff or a hotline.'
    };
    parts.push(`<div class="banner"><span class="tag">low confidence</span>${escapeHTML(msgs[reason] || 'Uncertain match.')}</div>`);
  }

  if (data.services.length === 0) {
    parts.push(`<div class="state">Nothing surfaced. Try a different phrasing.</div>`);
  } else {
    const reranker = data.debug_info?.reranker_available;
    parts.push(`<div class="results">
      <div class="results-meta">
        <span>${data.services.length} result${data.services.length>1?'s':''} · top_k=${data.services.length}</span>
        <span>${reranker ? 'reranker active' : 'rrf order (keyless)'}</span>
      </div>`);
    data.services.forEach((r, i) => parts.push(renderResult(r, i + 1)));
    parts.push('</div>');
  }

  parts.push(renderDebug(data.debug_info || {}));
  out.innerHTML = parts.join('');
}

function renderResult(r, rank) {
  const s = r.service;
  const pct = Math.max(0, Math.min(100, Math.round(r.relevance_score * 100)));
  const just = r.rerank_justification
    ? `<p class="justification">${escapeHTML(r.rerank_justification)}</p>`
    : `<p class="justification" style="opacity:0.6">No semantic judgement — fell back to fused rank order (set OPENAI_API_KEY for justifications).</p>`;

  const hours = Object.entries(s.operating_hours || {})
    .map(([k, v]) => `<div><span class="muted">${escapeHTML(k)}</span> &nbsp;${escapeHTML(v)}</div>`).join('');

  const docs = (s.required_documents || []).map(d => {
    const ifClause = d.required_if ? ` <span class="muted">(if ${escapeHTML(d.required_if)})</span>` : '';
    const notes    = d.notes ? ` <span class="muted">— ${escapeHTML(d.notes)}</span>` : '';
    return `<li>${escapeHTML(d.name)}${ifClause}${notes}</li>`;
  }).join('');

  const c = s.contact || {};
  const contactBits = [];
  if (c.phone)   contactBits.push(`<span>${escapeHTML(c.phone)}</span>`);
  if (c.email)   contactBits.push(`<a href="mailto:${escapeHTML(c.email)}">${escapeHTML(c.email)}</a>`);
  if (c.website) contactBits.push(`<a href="${escapeHTML(c.website)}" target="_blank" rel="noopener">website ↗</a>`);

  const isDigital = s.location_type === 'Digital_Hotline';
  const locPill = `<span class="loc-pill ${isDigital ? 'digital' : 'physical'}">${isDigital ? 'digital · hotline' : 'physical · OTH'}</span>`;
  const handoff = isDigital
    ? `<div class="handoff"><strong>chatbot routing</strong><br>No counter at OTH for this service. Direct the user to the phone/website below — and offer the <strong style="color:var(--teal)">ServiceSG Centre @ OTH Level 1</strong> if they need in-person help with the online application or SingPass.</div>`
    : '';

  return `
    <article class="result">
      <div class="roman">${roman[rank] || rank}</div>
      <div>
        <h2>${escapeHTML(s.service_name)}</h2>
        <div class="agency"><span class="id">${escapeHTML(s.service_id)}</span>${locPill} &nbsp;·&nbsp; ${escapeHTML(s.agency)}
          <span class="flags">
            <span class="flag ${s.walk_in_accepted ? 'on' : ''}">${s.walk_in_accepted ? 'walk-in ✓' : 'walk-in ✗'}</span>
            <span class="flag ${s.appointment_required ? 'on' : ''}">${s.appointment_required ? 'appt required' : 'no appt'}</span>
          </span>
        </div>
        <div class="score-row">
          <span>relevance</span>
          <div class="score-bar" style="--w:${pct}%"></div>
          <span class="score-val">${r.relevance_score.toFixed(3)}</span>
        </div>
        ${handoff}
        ${just}
        <dl class="facts">
          <dt>where</dt>     <dd>${escapeHTML(s.oth_location)}</dd>
          <dt>hours</dt>     <dd>${hours || '<span class="muted">—</span>'}</dd>
          <dt>bring</dt>     <dd>${docs ? `<ul>${docs}</ul>` : '<span class="muted">no specific documents required</span>'}</dd>
          <dt>contact</dt>   <dd>${contactBits.join(' &nbsp;·&nbsp; ') || '<span class="muted">—</span>'}</dd>
          <dt>processing</dt><dd>${escapeHTML(s.typical_processing_time)}</dd>
          <dt>source</dt>    <dd><a href="${escapeHTML(s.source_url)}" target="_blank" rel="noopener">${escapeHTML(s.source_url)} ↗</a></dd>
        </dl>
      </div>
    </article>`;
}

function renderDebug(d) {
  const col = (title, items, keyName, valueFn) => `
    <div>
      <h3>${title}</h3>
      ${items.slice(0, 10).map(x => `
        <div class="dbg-row">
          <span class="sid">${escapeHTML(x[keyName])}</span>
          <span class="num">${valueFn(x)}</span>
        </div>`).join('')}
    </div>`;

  const dense = d.dense_candidates || [];
  const bm25  = d.bm25_candidates || [];
  const rrf   = d.rrf_fused || [];
  const dropped = d.filter_dropped || [];

  const droppedSection = dropped.length ? `
    <div style="margin-top:24px"><h3>filter dropped (${dropped.length})</h3>
      ${dropped.map(x => `<div class="dbg-row"><span class="sid">${escapeHTML(x.service_id)}</span><span class="num">${escapeHTML(x.reason)}</span></div>`).join('')}
    </div>` : '';

  return `
    <details class="debug">
      <summary>show pipeline trace</summary>
      <div class="dbg-grid">
        ${col('dense (cosine)', dense, 'service_id', x => x.similarity.toFixed(4))}
        ${col('bm25 (lexical)', bm25, 'service_id', x => x.bm25_score.toFixed(4))}
        ${col('rrf fused', rrf, 'service_id', x => x.rrf_score.toFixed(6) + ' [d:' + (x.dense_rank ?? '-') + ' / b:' + (x.bm25_rank ?? '-') + ']')}
      </div>
      ${droppedSection}
      <div class="dbg-meta">
        <div><span class="k">reranker</span> <span class="v">${d.reranker_available ? 'active (gpt-4o-mini)' : 'inactive (no api key)'}</span></div>
        <div><span class="k">top score</span> <span class="v">${d.rerank_top_score?.toFixed?.(3) ?? '—'}</span></div>
        <div><span class="k">threshold</span> <span class="v">${d.confidence_threshold ?? '—'}</span></div>
        <div><span class="k">filter</span> <span class="v">${d.filter_pre_count ?? 0} → ${d.filter_post_count ?? 0}</span></div>
        <div><span class="k">user_context</span> <span class="v">${d.user_context_received ? 'received' : 'none'}</span></div>
      </div>
    </details>`;
}
</script>
</body>
</html>"""
