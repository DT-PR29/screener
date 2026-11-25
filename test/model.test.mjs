// Run: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { analyze, deal, historicals, maxMultipleFor, askingMultiple, DEFAULT_ASSUMPTIONS } from "../model.js";
import { SAMPLES } from "../samples.js";

const close = (a, b, tol = 1e-6) => assert.ok(Math.abs(a - b) < tol, `${a} vs ${b}`);
const A = { ...DEFAULT_ASSUMPTIONS, entryMultiple: 5, exitMultiple: 5, ebitdaGrowth: 0 };

test("sample verdicts", () => {
  const v = Object.fromEntries(SAMPLES.map(s => [s.id, analyze(s.extraction).decision]));
  assert.deepEqual(v, { bayside: "pursue", ridgeline: "price", pinecrest: "pass" });
});

test("sources and uses tie out: $2M EBITDA at 5.0x", () => {
  const d = deal(2, A);
  close(d.price, 10); close(d.fees, 0.4); close(d.senior0, 5.5); close(d.note, 1.0);
  close(d.senior0 + d.note + d.equity0, d.price + d.fees);   // sources = uses
  close(d.equity0, 3.9);
});

test("year-1 DSCR hand check", () => {
  const d = deal(2, A);
  // CFADS 1.6; service = senior interest 0.55 + principal 0.55 + note interest 0.06 = 1.16
  close(d.years[0].cfads, 1.6); close(d.years[0].service, 1.16); close(d.dscr1, 1.6 / 1.16);
});

test("excess cash prepays senior debt, never below zero", () => {
  const d = deal(2, { ...A, seniorLeverage: 0.5 });
  assert.equal(d.exitSenior, 0); assert.ok(d.exitCash > 0);
  for (const y of d.years) assert.ok(y.senior >= 0);
});

test("investor and searcher split exit equity", () => {
  const d = deal(2, A);
  close(d.investorProceeds + d.searcherProceeds, d.exitEquity);
  close(d.searcherProceeds / d.exitEquity, A.searcherStake);
  close(d.irr, Math.pow(d.moic, 1 / A.years) - 1);
});

test("SDE is normalized by deducting a CEO salary", () => {
  const h = historicals({ financials: [{ year: "2025", revenue: 10, ebitda: null, sde: 2.0 }] }, A);
  close(h.ltm.ebitda, 2.0 - A.ceoCost); assert.equal(h.usesSde, true);
});

test("an SDE multiple converts to a higher EBITDA multiple", () => {
  const x = SAMPLES.find(s => s.id === "ridgeline").extraction;
  const h = historicals(x);
  close(askingMultiple(x, h), 7.0 * 3.4 / (3.4 - 0.25));
});

test("solved max price meets both IRR and DSCR", () => {
  const m = maxMultipleFor(2, A, 0.25);
  const d = deal(2, { ...A, entryMultiple: m });
  assert.ok(d.irr >= 0.25 - 1e-6 && d.dscr1 >= A.minDscr - 1e-6);
  const over = deal(2, { ...A, entryMultiple: m + 0.1 });
  assert.ok(over.irr < 0.25 || over.dscr1 < A.minDscr);
});

test("higher price lowers investor IRR", () => {
  assert.ok(deal(2, { ...A, entryMultiple: 4 }).irr > deal(2, { ...A, entryMultiple: 6 }).irr);
});

test("owner who wants to stay is flagged; shrinking revenue fails", () => {
  const r = analyze(SAMPLES.find(s => s.id === "pinecrest").extraction);
  assert.equal(r.checks.find(c => c.id === "owner").status, "flag");
  assert.equal(r.checks.find(c => c.id === "growth").status, "fail");
});

test("no financials / garbage input doesn't crash", () => {
  assert.equal(analyze({ financials: [] }).decision, "info");
  assert.doesNotThrow(() => analyze({ financials: [{ year: 2025, revenue: "big", sde: "x" }], top_customer_pct: "a lot" }));
});
