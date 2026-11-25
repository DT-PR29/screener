// Run: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { analyze, lbo, historicals, maxMultipleFor, DEFAULT_ASSUMPTIONS } from "../model.js";
import { SAMPLES } from "../samples.js";

const close = (a, b, tol = 1e-6) => assert.ok(Math.abs(a - b) < tol, `${a} vs ${b}`);
const A = { ...DEFAULT_ASSUMPTIONS, entryMultiple: 10, exitMultiple: 10, ebitdaGrowth: 0.05 };

test("demo verdicts", () => {
  const d = Object.fromEntries(SAMPLES.map(s => [s.id, analyze(s.extraction).decision]));
  assert.deepEqual(d, { crestline: "price", atlas: "pursue", brightpath: "pass" });
});

test("LBO hand check: $10M EBITDA, 10x, 4x leverage, 5% growth", () => {
  const r = lbo(10, A);
  close(r.ev, 100); close(r.debt0, 40); close(r.equity0, 62); // 100 + 2 fees - 40
  // Year 1: EBITDA 10.5, interest 3.6, FCF 5.25 - 3.6 = 1.65 -> debt 38.35
  close(r.years[0].ebitda, 10.5); close(r.years[0].interest, 3.6); close(r.years[0].debt, 38.35);
  close(r.exitEv, 10 * Math.pow(1.05, 5) * 10);
  close(r.irr, Math.pow(r.moic, 1 / 5) - 1);
});

test("debt is capped at 75% of EV", () => {
  close(lbo(10, { ...A, entryMultiple: 4, exitMultiple: 4, leverage: 6 }).debt0, 30);
});

test("excess cash builds once debt is repaid", () => {
  const r = lbo(10, { ...A, leverage: 0.5 });
  assert.equal(r.exitDebt, 0); assert.ok(r.exitCash > 0);
});

test("higher entry price means lower IRR", () => {
  assert.ok(lbo(10, { ...A, entryMultiple: 8 }).irr > lbo(10, { ...A, entryMultiple: 12 }).irr);
});

test("solved bid multiple actually returns the target IRR", () => {
  const m = maxMultipleFor(10, A, 0.2);
  close(lbo(10, { ...A, entryMultiple: m }).irr, 0.2, 1e-4);
});

test("historicals ignore projections and compute CAGR", () => {
  const h = historicals({ financials: [{ year: "2023", revenue: 100, ebitda: 10 }, { year: "2025", revenue: 121, ebitda: 12.1 }, { year: "2024", revenue: 110, ebitda: 11 }, { year: "2026E", revenue: 999, ebitda: 99, is_projection: true }] });
  assert.equal(h.ltm.year, "2025"); close(h.revCagr, 0.1);
});

test("asking price converts to a multiple", () => {
  const atlas = SAMPLES.find(s => s.id === "atlas").extraction;
  close(analyze(atlas).a.entryMultiple, Math.round(60 / 9.2 * 10) / 10);
});

test("no financials -> need financials, no crash", () => {
  const r = analyze({ financials: [] });
  assert.equal(r.decision, "info"); assert.equal(r.base, null);
});

test("garbage inputs don't crash", () => {
  assert.doesNotThrow(() => analyze({ financials: [{ year: 2025, revenue: "big", ebitda: null }], top_customer_pct: "a lot" }));
});
