// Search fund acquisition math and screening, all in plain code.
// The language model never does arithmetic: it extracts the numbers and drafts the
// qualitative memo sections. All dollar figures are in $ millions.

export const DEFAULT_ASSUMPTIONS = {
  entryMultiple: null,      // null = seller's ask (x adjusted EBITDA), else 5.0x
  exitMultiple: null,       // null = same as entry (no credit for multiple expansion)
  ebitdaGrowth: null,       // null = historical adj. EBITDA CAGR, capped at 8%, floored at 0%
  ceoCost: 0.25,            // market salary for the searcher-CEO, deducted when the seller quotes SDE
  seniorLeverage: 2.75,     // senior term loan, x adj. EBITDA
  seniorRate: 0.10,
  seniorAmortYears: 10,     // straight-line scheduled principal
  sellerNotePct: 0.10,      // seller note, % of purchase price
  sellerNoteRate: 0.06,     // interest-only; repaid at exit
  cashConversion: 0.80,     // cash available for debt service, % of EBITDA (after capex, taxes, working capital)
  feesPct: 0.04,            // transaction costs, % of price
  searcherStake: 0.25,      // searcher's earned equity (fully vested in the base case)
  years: 5,
  targetIrr: 0.25,          // investor IRR at the top of the bid range
  floorIrr: 0.30,           // investor IRR at the bottom of the bid range
  minDscr: 1.25,            // year-1 debt service coverage (typical lender covenant)
};

export const DEFAULT_SCREEN = {
  minEbitda: 1, maxEbitda: 5, minMargin: 0.15, minGrowth: 0, maxTopCustomer: 0.15,
  minYears: 10, maxGovPayor: 0.60, minRecurring: 0,
};

// ---------- earnings ----------
// Sellers of small businesses often quote SDE (seller's discretionary earnings), which adds
// back the owner's own salary. A searcher has to pay a CEO, so we deduct a market salary.
export function adjEbitda(row, x, a = DEFAULT_ASSUMPTIONS) {
  const adj = isNum(x.other_adjustments) ? x.other_adjustments : 0;
  if (isNum(row.ebitda)) return row.ebitda + adj;
  if (isNum(row.sde)) return row.sde - a.ceoCost + adj;
  return null;
}

export function historicals(x, a = DEFAULT_ASSUMPTIONS) {
  const yrs = (x.financials || [])
    .filter(r => isNum(r.revenue) && r.revenue > 0 && !r.is_projection)
    .sort((p, q) => String(p.year).localeCompare(String(q.year)));
  const rows = yrs.map((r, i) => {
    const e = adjEbitda(r, x, a);
    return { year: String(r.year), revenue: r.revenue, sde: isNum(r.sde) ? r.sde : null, reported: isNum(r.ebitda) ? r.ebitda : null,
      ebitda: e, margin: isNum(e) ? e / r.revenue : null, growth: i > 0 ? r.revenue / yrs[i - 1].revenue - 1 : null };
  });
  const first = rows[0], last = rows[rows.length - 1], n = rows.length - 1;
  const revCagr = n >= 1 ? Math.pow(last.revenue / first.revenue, 1 / n) - 1 : null;
  const ebitdaCagr = n >= 1 && first.ebitda > 0 && last.ebitda > 0 ? Math.pow(last.ebitda / first.ebitda, 1 / n) - 1 : null;
  return { rows, ltm: last || null, revCagr, ebitdaCagr, usesSde: rows.some(r => r.reported === null && r.sde !== null) };
}

export function askingMultiple(x, h) {
  if (isNum(x.asking_price) && h.ltm?.ebitda > 0) return x.asking_price / h.ltm.ebitda;
  if (isNum(x.asking_multiple) && x.asking_multiple > 0) {
    // A multiple quoted on SDE is converted to a price, then to a multiple of adjusted EBITDA.
    if (x.asking_multiple_basis === "sde" && h.ltm?.sde > 0 && h.ltm?.ebitda > 0) return x.asking_multiple * h.ltm.sde / h.ltm.ebitda;
    return x.asking_multiple;
  }
  return null;
}

export function resolveAssumptions(x, a = DEFAULT_ASSUMPTIONS) {
  const h = historicals(x, a);
  const ask = askingMultiple(x, h);
  const entry = isNum(a.entryMultiple) ? a.entryMultiple : (ask ?? 5);
  const g = isNum(a.ebitdaGrowth) ? a.ebitdaGrowth : clamp(h.ebitdaCagr ?? 0.03, 0, 0.08);
  return { ...a, entryMultiple: round1(entry), exitMultiple: round1(isNum(a.exitMultiple) ? a.exitMultiple : entry), exitTied: !isNum(a.exitMultiple), ebitdaGrowth: g };
}

// ---------- the deal ----------
export function deal(ltm, a) {
  if (!(ltm > 0)) return null;
  const price = ltm * a.entryMultiple;
  const fees = price * a.feesPct;
  const senior0 = Math.min(ltm * a.seniorLeverage, price * 0.7);
  const note = price * a.sellerNotePct;
  const equity0 = price + fees - senior0 - note;
  const sched = senior0 / a.seniorAmortYears;
  let senior = senior0, cash = 0, ebitda = ltm;
  const years = [];
  for (let t = 1; t <= a.years; t++) {
    ebitda *= 1 + a.ebitdaGrowth;
    const cfads = ebitda * a.cashConversion;
    const seniorInt = senior * a.seniorRate, noteInt = note * a.sellerNoteRate;
    const principal = Math.min(sched, senior);
    const service = seniorInt + principal + noteInt;
    const dscr = service > 0 ? cfads / service : Infinity;
    let excess = cfads - service;
    senior -= principal;
    const sweep = Math.max(0, Math.min(senior, excess)); // excess cash prepays senior
    senior -= sweep; excess -= sweep; cash += excess;
    years.push({ t, ebitda, cfads, seniorInt, noteInt, principal: principal + sweep, service, dscr, senior, cash });
  }
  const exitEv = ebitda * a.exitMultiple;
  const exitEquity = exitEv - senior - note + cash;
  const investorProceeds = exitEquity * (1 - a.searcherStake);
  const searcherProceeds = exitEquity * a.searcherStake;
  const moic = investorProceeds / equity0;
  const irr = moic > 0 ? Math.pow(moic, 1 / a.years) - 1 : -1;
  const minDscr = Math.min(...years.map(y => y.dscr));
  return { price, fees, senior0, note, equity0, uses: price + fees, years, exitEv, exitEquity, exitSenior: senior, exitCash: cash,
    investorProceeds, searcherProceeds, moic, irr, dscr1: years[0].dscr, minDscr };
}

// Highest entry multiple that clears both the investor IRR target and the DSCR minimum.
export function maxMultipleFor(ltm, a, targetIrr) {
  // Unless the user fixed an exit multiple, each candidate price exits at its own entry multiple.
  const at = m => deal(ltm, { ...a, entryMultiple: m, exitMultiple: a.exitTied ? m : a.exitMultiple });
  const ok = m => { const d = at(m); return d && d.irr >= targetIrr && d.dscr1 >= a.minDscr; };
  let lo = 1, hi = 20;
  if (!ok(lo)) return null;
  if (ok(hi)) return hi;
  for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; ok(mid) ? lo = mid : hi = mid; }
  return lo;
}

export function bidRange(ltm, a) {
  const high = maxMultipleFor(ltm, a, a.targetIrr);
  if (high === null) return null;
  const low = maxMultipleFor(ltm, a, a.floorIrr) ?? high * 0.9;
  const dscrBound = deal(ltm, { ...a, entryMultiple: high + 0.05, exitMultiple: a.exitTied ? high + 0.05 : a.exitMultiple })?.dscr1 < a.minDscr;
  return { lowMultiple: low, highMultiple: high, lowEv: low * ltm, highEv: high * ltm, limitedBy: dscrBound ? "DSCR" : "IRR" };
}

export function sensitivity(ltm, a, step = 0.5) {
  const entries = [-2, -1, 0, 1, 2].map(d => round1(a.entryMultiple + d * step)).filter(m => m > 0);
  const exits = [-2, -1, 0, 1, 2].map(d => round1(a.exitMultiple + d * step)).filter(m => m > 0);
  return { entries, exits, grid: entries.map(en => exits.map(ex => deal(ltm, { ...a, entryMultiple: en, exitMultiple: ex })?.irr ?? null)) };
}

// ---------- screen ----------
export function runScreen(x, h, s = DEFAULT_SCREEN, base = null, a = DEFAULT_ASSUMPTIONS) {
  const out = [];
  const add = (id, label, status, detail) => out.push({ id, label, status, detail });
  const e = h.ltm?.ebitda;
  const basis = h.usesSde ? " (SDE less CEO salary)" : "";
  if (!isNum(e)) add("size", "Adj. EBITDA", "unknown", "LTM earnings not found");
  else if (e < s.minEbitda || e > s.maxEbitda) add("size", "Adj. EBITDA", "fail", `${m$(e)}${basis} is outside the ${m$(s.minEbitda)}–${m$(s.maxEbitda)} search range`);
  else add("size", "Adj. EBITDA", "pass", `${m$(e)}${basis}`);

  const mg = h.ltm?.margin;
  if (!isNum(mg)) add("margin", "Margin", "unknown", "Margin not computable");
  else if (mg < s.minMargin) add("margin", "Margin", "fail", `${pct(mg)} adj. EBITDA margin, below the ${pct(s.minMargin)} floor`);
  else add("margin", "Margin", "pass", `${pct(mg)} adj. EBITDA margin`);

  if (!isNum(h.revCagr)) add("growth", "Revenue trend", "unknown", "Need 2+ years of revenue");
  else if (h.revCagr < s.minGrowth) add("growth", "Revenue trend", "fail", `${pct(h.revCagr)} CAGR: shrinking`);
  else add("growth", "Revenue trend", "pass", `${pct(h.revCagr)} CAGR`);

  const tc = x.top_customer_pct;
  if (!isNum(tc)) add("conc", "Concentration", "unknown", "Top customer share not stated");
  else if (tc / 100 > s.maxTopCustomer) add("conc", "Concentration", "fail", `Top customer / payor is ${tc}% of revenue (max ${pct(s.maxTopCustomer)})`);
  else add("conc", "Concentration", "pass", `Top customer / payor ${tc}% of revenue`);

  const yb = x.years_in_business;
  if (!isNum(yb)) add("durable", "Durability", "unknown", "Years in business not stated");
  else if (yb < s.minYears) add("durable", "Durability", "flag", `${yb} years in business (prefer ${s.minYears}+)`);
  else add("durable", "Durability", "pass", `${yb} years in business`);

  const ot = x.owner_transition;
  if (ot === "retiring" || ot === "exiting") add("owner", "Succession", "pass", "Owner is looking to step away: a natural search fund transition");
  else if (ot === "staying") add("owner", "Succession", "flag", "Owner wants to stay on: unclear role for a searcher-CEO");
  else add("owner", "Succession", "unknown", "Owner's plans not stated");
  if (x.owner_dependence === "high") add("keyperson", "Owner dependence", "flag", x.owner_dependence_note || "Owner holds key relationships; plan a long transition");
  else if (x.owner_dependence === "low") add("keyperson", "Owner dependence", "pass", x.owner_dependence_note || "Second-tier management runs day-to-day");

  const pm = x.payor_mix;
  if (s.maxGovPayor > 0 && pm && (isNum(pm.medicare) || isNum(pm.medicaid))) {
    const gov = ((isNum(pm.medicare) ? pm.medicare : 0) + (isNum(pm.medicaid) ? pm.medicaid : 0)) / 100;
    if (gov > s.maxGovPayor) add("gov", "Government payor", "flag", `Medicare + Medicaid ${pct(gov)} of revenue: model a rate cut`);
    else add("gov", "Government payor", "pass", `Medicare + Medicaid ${pct(gov)} of revenue`);
  }
  if (s.minRecurring > 0) {
    const rr = x.recurring_revenue_pct;
    if (!isNum(rr)) add("recurring", "Recurring revenue", "unknown", "Not stated");
    else if (rr / 100 < s.minRecurring) add("recurring", "Recurring revenue", "flag", `${rr}%, below ${pct(s.minRecurring)}`);
    else add("recurring", "Recurring revenue", "pass", `${rr}% recurring or contracted`);
  }
  if (base) {
    if (base.dscr1 < a.minDscr) add("dscr", "Debt coverage at ask", "flag", `Year-1 DSCR ${base.dscr1.toFixed(2)}x at the asking price (need ${a.minDscr.toFixed(2)}x)`);
    else add("dscr", "Debt coverage at ask", "pass", `Year-1 DSCR ${base.dscr1.toFixed(2)}x`);
  }
  return out;
}

// ---------- verdict ----------
export function analyze(x, assumptions = DEFAULT_ASSUMPTIONS, screenRules = DEFAULT_SCREEN) {
  const a = resolveAssumptions(x, assumptions);
  const h = historicals(x, a);
  const e = h.ltm?.ebitda;
  const base = isNum(e) && e > 0 ? deal(e, a) : null;
  const checks = runScreen(x, h, screenRules, base, a);
  const bids = base ? bidRange(e, a) : null;
  const sens = base ? sensitivity(e, a) : null;
  const ask = askingMultiple(x, h);
  const fails = checks.filter(c => c.status === "fail");
  const unknowns = checks.filter(c => c.status === "unknown");

  let decision, label, reason;
  if (!base) { decision = "info"; label = "Need financials"; reason = "No usable LTM earnings in the materials"; }
  else if (fails.length) { decision = "pass"; label = "Pass"; reason = fails.map(f => f.detail).join("; "); }
  else if (base.irr >= a.targetIrr && base.dscr1 >= a.minDscr) { decision = "pursue"; label = "Pursue: submit LOI"; reason = `${pct(base.irr)} investor IRR / ${base.moic.toFixed(1)}x and ${base.dscr1.toFixed(2)}x DSCR at ${a.entryMultiple.toFixed(1)}x clear the hurdles`; }
  else if (bids) { decision = "price"; label = "Pursue only at a lower price"; reason = `At ${a.entryMultiple.toFixed(1)}x: ${pct(base.irr)} investor IRR, ${base.dscr1.toFixed(2)}x DSCR. Works at ${bids.highMultiple.toFixed(1)}x or below (bound by ${bids.limitedBy})`; }
  else { decision = "pass"; label = "Pass on price"; reason = `Can't reach a ${pct(a.targetIrr)} investor IRR with ${a.minDscr.toFixed(2)}x coverage at any reasonable price`; }
  if (decision !== "pass" && decision !== "info" && unknowns.length >= 2) reason += `. Confirm before an LOI: ${unknowns.map(u => u.label.toLowerCase()).join(", ")}`;
  return { h, a, checks, base, bids, sens, ask, decision, label, reason };
}

// ---------- formatting ----------
export const isNum = v => typeof v === "number" && isFinite(v);
export const pct = v => isNum(v) ? `${(v * 100).toFixed(1)}%` : "n/a";
export const m$ = v => isNum(v) ? `$${Math.abs(v) >= 100 ? Math.round(v) : v.toFixed(Math.abs(v) < 10 ? 2 : 1)}M` : "n/a";
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const round1 = v => Math.round(v * 10) / 10;
