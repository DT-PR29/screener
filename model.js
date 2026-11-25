// Deal math and screening, all in plain code. The language model never does arithmetic here:
// it only extracts the numbers and writes the qualitative sections of the memo.
// All dollar figures are in $ millions.

export const DEFAULT_ASSUMPTIONS = {
  entryMultiple: null,   // null = use asking multiple, else 10.0x
  exitMultiple: null,    // null = entry minus 1.0x (no credit for multiple expansion)
  leverage: 4.0,         // senior debt / LTM EBITDA
  interestRate: 0.09,
  ebitdaGrowth: null,    // null = historical EBITDA CAGR, capped at 10%, floored at 0%
  fcfConversion: 0.5,    // unlevered FCF as % of EBITDA (after capex, taxes, working capital)
  feesPct: 0.02,         // transaction fees, % of entry EV
  years: 5,
  targetIrr: 0.20,
  floorIrr: 0.25,        // used for the low end of the bid range
};

export const DEFAULT_SCREEN = {
  minEbitda: 3, maxEbitda: 150, minMargin: 0.15, minGrowth: 0.05, maxTopCustomer: 0.20, minRecurring: 0.5,
};

// ---------- historicals ----------
export function historicals(x) {
  const yrs = (x.financials || [])
    .filter(r => isNum(r.revenue) && r.revenue > 0 && !r.is_projection)
    .sort((a, b) => String(a.year).localeCompare(String(b.year)));
  const rows = yrs.map((r, i) => ({
    year: String(r.year), revenue: r.revenue, ebitda: isNum(r.ebitda) ? r.ebitda : null,
    margin: isNum(r.ebitda) ? r.ebitda / r.revenue : null,
    growth: i > 0 ? r.revenue / yrs[i - 1].revenue - 1 : null,
  }));
  const first = rows[0], last = rows[rows.length - 1];
  const n = rows.length - 1;
  const revCagr = n >= 1 ? Math.pow(last.revenue / first.revenue, 1 / n) - 1 : null;
  const ebitdaCagr = n >= 1 && first.ebitda > 0 && last.ebitda > 0 ? Math.pow(last.ebitda / first.ebitda, 1 / n) - 1 : null;
  return { rows, ltm: last || null, revCagr, ebitdaCagr };
}

// ---------- LBO ----------
export function resolveAssumptions(x, a = DEFAULT_ASSUMPTIONS) {
  const h = historicals(x);
  const ask = askingMultiple(x, h);
  const entry = isNum(a.entryMultiple) ? a.entryMultiple : (ask ?? 10);
  const g = isNum(a.ebitdaGrowth) ? a.ebitdaGrowth : clamp(h.ebitdaCagr ?? 0.05, 0, 0.10);
  return { ...a, entryMultiple: round1(entry), exitMultiple: round1(isNum(a.exitMultiple) ? a.exitMultiple : Math.max(1, entry - 1)), ebitdaGrowth: g };
}

export function askingMultiple(x, h = historicals(x)) {
  if (isNum(x.asking_multiple) && x.asking_multiple > 0) return x.asking_multiple;
  if (isNum(x.asking_price) && h.ltm?.ebitda > 0) return x.asking_price / h.ltm.ebitda;
  return null;
}

export function lbo(ltmEbitda, a) {
  if (!(ltmEbitda > 0)) return null;
  const ev = ltmEbitda * a.entryMultiple;
  const debt0 = Math.min(ltmEbitda * a.leverage, ev * 0.75); // never more than 75% LTV
  const fees = ev * a.feesPct;
  const equity0 = ev + fees - debt0;
  let debt = debt0, cash = 0, ebitda = ltmEbitda;
  const years = [];
  for (let t = 1; t <= a.years; t++) {
    ebitda *= 1 + a.ebitdaGrowth;
    const interest = debt * a.interestRate;
    const fcf = ebitda * a.fcfConversion - interest;
    const paydown = Math.max(0, Math.min(debt, fcf));
    debt -= paydown;
    cash += fcf - paydown; // can go negative if FCF < interest (cash shortfall)
    years.push({ t, ebitda, interest, fcf, debt, cash });
  }
  const exitEv = ebitda * a.exitMultiple;
  const exitEquity = exitEv - debt + cash;
  const moic = exitEquity / equity0;
  const irr = moic > 0 ? Math.pow(moic, 1 / a.years) - 1 : -1;
  return { ev, debt0, fees, equity0, years, exitEv, exitEquity, moic, irr, exitDebt: debt, exitCash: cash };
}

// Highest entry multiple that still clears a target IRR (bisection; IRR falls as price rises).
export function maxMultipleFor(ltmEbitda, a, target) {
  let lo = 1, hi = 40;
  const irrAt = m => lbo(ltmEbitda, { ...a, entryMultiple: m })?.irr ?? -1;
  if (irrAt(lo) < target) return null;
  if (irrAt(hi) >= target) return hi;
  for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; irrAt(mid) >= target ? lo = mid : hi = mid; }
  return lo;
}

export function bidRange(ltmEbitda, a) {
  const high = maxMultipleFor(ltmEbitda, a, a.targetIrr);
  const low = maxMultipleFor(ltmEbitda, a, a.floorIrr);
  if (high === null) return null;
  return { lowMultiple: low ?? high * 0.9, highMultiple: high, lowEv: (low ?? high * 0.9) * ltmEbitda, highEv: high * ltmEbitda };
}

export function sensitivity(ltmEbitda, a, step = 1) {
  const entries = [-2, -1, 0, 1, 2].map(d => round1(a.entryMultiple + d * step)).filter(m => m > 0);
  const exits = [-2, -1, 0, 1, 2].map(d => round1(a.exitMultiple + d * step)).filter(m => m > 0);
  return { entries, exits, grid: entries.map(en => exits.map(ex => lbo(ltmEbitda, { ...a, entryMultiple: en, exitMultiple: ex })?.irr ?? null)) };
}

// ---------- screen ----------
export function runScreen(x, h, s = DEFAULT_SCREEN) {
  const out = [];
  const add = (id, label, status, detail) => out.push({ id, label, status, detail });
  const e = h.ltm?.ebitda;
  if (!isNum(e)) add("size", "EBITDA size", "unknown", "LTM EBITDA not found");
  else if (e < s.minEbitda || e > s.maxEbitda) add("size", "EBITDA size", "fail", `${m$(e)} is outside the ${m$(s.minEbitda)}–${m$(s.maxEbitda)} range`);
  else add("size", "EBITDA size", "pass", `${m$(e)} LTM EBITDA`);

  const mg = h.ltm?.margin;
  if (!isNum(mg)) add("margin", "EBITDA margin", "unknown", "Margin not computable");
  else if (mg < s.minMargin) add("margin", "EBITDA margin", "fail", `${pct(mg)} is below the ${pct(s.minMargin)} floor`);
  else add("margin", "EBITDA margin", "pass", pct(mg));

  if (!isNum(h.revCagr)) add("growth", "Revenue growth", "unknown", "Need 2+ years of revenue");
  else if (h.revCagr < 0) add("growth", "Revenue growth", "fail", `Shrinking: ${pct(h.revCagr)} CAGR`);
  else if (h.revCagr < s.minGrowth) add("growth", "Revenue growth", "flag", `${pct(h.revCagr)} CAGR, below the ${pct(s.minGrowth)} target`);
  else add("growth", "Revenue growth", "pass", `${pct(h.revCagr)} CAGR`);

  const tc = x.top_customer_pct;
  if (!isNum(tc)) add("conc", "Customer concentration", "unknown", "Top customer share not stated");
  else if (tc / 100 > s.maxTopCustomer) add("conc", "Customer concentration", "fail", `Top customer is ${tc}% of revenue (max ${pct(s.maxTopCustomer)})`);
  else add("conc", "Customer concentration", "pass", `Top customer ${tc}% of revenue`);

  const rr = x.recurring_revenue_pct;
  if (!isNum(rr)) add("recurring", "Recurring revenue", "unknown", "Not stated");
  else if (rr / 100 < s.minRecurring) add("recurring", "Recurring revenue", "flag", `${rr}%, below ${pct(s.minRecurring)}`);
  else add("recurring", "Recurring revenue", "pass", `${rr}% recurring or contracted`);
  return out;
}

// ---------- verdict ----------
export function analyze(x, assumptions = DEFAULT_ASSUMPTIONS, screenRules = DEFAULT_SCREEN) {
  const h = historicals(x);
  const a = resolveAssumptions(x, assumptions);
  const checks = runScreen(x, h, screenRules);
  const e = h.ltm?.ebitda;
  const base = isNum(e) && e > 0 ? lbo(e, a) : null;
  const bids = base ? bidRange(e, a) : null;
  const sens = base ? sensitivity(e, a) : null;
  const ask = askingMultiple(x, h);
  const fails = checks.filter(c => c.status === "fail");
  const unknowns = checks.filter(c => c.status === "unknown");

  let decision, label, reason;
  if (!base) { decision = "info"; label = "Need financials"; reason = "No usable LTM EBITDA in the materials"; }
  else if (fails.length) { decision = "pass"; label = "Pass"; reason = fails.map(f => f.detail).join("; "); }
  else if (base.irr >= a.targetIrr) { decision = "pursue"; label = "Pursue: submit IOI"; reason = `${pct(base.irr)} base-case IRR / ${base.moic.toFixed(1)}x at ${a.entryMultiple.toFixed(1)}x entry clears the ${pct(a.targetIrr)} hurdle`; }
  else if (bids) { decision = "price"; label = "Pursue only at a lower price"; reason = `${pct(base.irr)} IRR at ${a.entryMultiple.toFixed(1)}x misses the ${pct(a.targetIrr)} hurdle; works at ${bids.highMultiple.toFixed(1)}x or below`; }
  else { decision = "pass"; label = "Pass on price"; reason = `Doesn't reach a ${pct(a.targetIrr)} IRR at any reasonable price`; }
  if (decision !== "pass" && decision !== "info" && unknowns.length >= 2) reason += `. Confirm before bidding: ${unknowns.map(u => u.label.toLowerCase()).join(", ")}`;

  return { h, a, checks, base, bids, sens, ask, decision, label, reason };
}

// ---------- formatting ----------
export const pct = v => isNum(v) ? `${(v * 100).toFixed(1)}%` : "n/a";
export const m$ = v => isNum(v) ? `$${v >= 100 ? Math.round(v) : v.toFixed(1).replace(/\.0$/, "")}M` : "n/a";
export const isNum = v => typeof v === "number" && isFinite(v);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const round1 = v => Math.round(v * 10) / 10;
