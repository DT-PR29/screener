# Screener

**Live:** https://dt-pr29.github.io/screener/ (click a demo deal; no API key needed)

Teaser or CIM in, first-pass investment committee memo out.

On deal teams, the first look at a new company follows the same steps every time. You pull the financials out of a CIM, check the business against the fund's criteria, run a quick LBO to see what price works, and write up the thesis, the risks and the questions that would change the answer. I've done this by hand in sell-side M&A, as a search fund analyst, and in PE case studies. Screener does the first pass in under a minute, and every number stays checkable.

## What you get

- **Recommendation and indicative bid range:** pursue, pursue only at a lower price, or pass. The bid range is solved from the target IRR and compared with the seller's ask.
- **Financial summary:** historical revenue, EBITDA, growth and margins. Management projections are shown but never drive the returns.
- **Screening criteria:** EBITDA size, margin, revenue growth, customer concentration and recurring revenue.
- **Investment thesis, risks with mitigants, and diligence questions**, drafted from the materials.
- **Returns:** a 5-year LBO with cash sweep, MOIC and IRR, plus a 5×5 entry/exit multiple sensitivity table.
- **Live assumptions:** change entry multiple, leverage, growth or the target IRR, and the whole memo recalculates.
- **Print to PDF** as a 2-page memo, and a deal log of everything screened.

## Design choices

**The model reads; code does the math.** Claude extracts a fixed schema (financials, concentration, the seller's ask) through forced tool use and drafts the qualitative sections. It is explicitly told not to compute returns or make a recommendation. Every number in the memo comes from `model.js`, which is plain JavaScript with tests. Language models are unreliable at arithmetic, and an IC memo can't have a wrong IRR.

**Conservative by default.** Returns run on LTM EBITDA, not the seller's projections. Growth defaults to the historical EBITDA CAGR, capped at 10%. The exit multiple defaults to one turn below entry, so the model gives no credit for multiple expansion. Debt is capped at 75% of EV. All of these are editable.

**Price the deal, don't just score it.** The bid range comes from bisection: it finds the highest entry multiple that still returns the target IRR (20%) and the one that returns 25%. "Good business, wrong price" is the most common real answer, and the tool says exactly that.

**No secrets in the code.** The API key is entered in the app and kept in the browser only.

## Demo deals (fictional)

| Deal | What it shows | Result |
|---|---|---|
| Crestline Diagnostics | Strong healthcare services platform, 13.5x ask | Pursue only at a lower price ($151–171M vs. $211M ask) |
| Atlas Fleet Services | Contracted fleet maintenance at a reasonable ask | Pursue: submit IOI |
| BrightPath Staffing | Shrinking revenue, collapsing margins, 31% concentration | Pass |

## Run it

It's static HTML/JS with no build step.

```bash
python3 -m http.server   # open http://localhost:8000
npm test                 # 10 tests: LBO hand-check, bid solver, screen, edge cases
```

`model.js` (screen, LBO, bid solver, sensitivity; no AI) · `app.js` (Claude call, memo rendering, deal log) · `samples.js` · `index.html` · `test/`

## What I'd add next

- A comps panel: pull trading and transaction multiples for the sector to anchor the entry multiple
- Quality-of-earnings flags that quantify add-backs and show EBITDA before and after them
- Downside case (rate cuts, a lost top customer) with a covenant check on the debt
- Export the memo to the firm's Word template
