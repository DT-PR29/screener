# Screener

**Live:** https://dt-pr29.github.io/screener/ (it opens with a sample pipeline of three fictional deals)

A deal-screening workspace for a healthcare services PE fund. A CIM comes in, gets screened against fund criteria, priced with a quick LBO, and tracked through the process to IOI, a management meeting and LOI.

I built it around the first-pass workflow I've done by hand in sell-side M&A, as a search fund analyst, and on healthcare PE case work. You pull the financials out of the CIM, check them against the fund's box, work out what price clears the return hurdle, and write a short memo with the thesis, risks and the questions that would change the answer.

## What it does

**Pipeline.** Every deal with its source and process type, stage, LTM EBITDA, seller ask vs. our range, base-case IRR, screen result, IOI deadline and owner. It's filterable by stage, highlights IOIs due within a week, and exports to CSV.

**Deal page.**
- *Memo:* a 2-page preliminary screening memo with the recommendation and indicative range, company overview, payor mix, financial summary, screening criteria, thesis, risks and mitigants, returns with a sensitivity table, diligence priorities, and a bottom line. Prints to PDF.
- *Financials:* the extracted income statement and deal inputs (ask, concentration, payor mix) are editable, because extraction is a first draft and the analyst owns the numbers. Every edit recalculates the screen, returns and range.
- *Returns:* a 5-year LBO shown year by year (EBITDA, interest, levered FCF, debt paydown), an entry × exit IRR sensitivity, and pricing: the max price at the target IRR and the gap to the seller's ask. Assumptions can be overridden per deal.
- *Diligence:* a checklist seeded from the CIM review, with Open / Requested / Received / Resolved status and notes.
- *Notes:* an activity log of call notes, banker feedback and stage changes.
- *Source:* the original materials.

**Fund criteria.** The fund's box lives in one place: EBITDA range, margin floor, growth, max customer/payor concentration, max government payor exposure, return hurdles, hold period and financing terms. Changing a criterion re-screens the whole pipeline.

## How it's built

- **Extraction:** the CIM (PDF) or teaser text goes to Claude, which returns a fixed schema through forced tool use: financials by year, payor mix, concentration, the ask, thesis, risks, diligence questions and seller claims to verify. It is told not to compute returns or make a recommendation.
- **All math in code:** `model.js` holds the screen, the LBO with cash sweep, the IRR/MOIC, the sensitivity table, and a bisection solver for the entry multiple that hits a target IRR. It has no AI in it and is covered by tests (`npm test`).
- **Conservative defaults:** returns run on historical LTM EBITDA, not management projections. Growth defaults to the historical EBITDA CAGR, capped at 10%. Exit is one turn below entry. Debt is capped at 75% of EV.
- **Static app:** plain HTML/JS with no build step and no server. Deal data stays in the user's browser. The API key is entered in Settings and sent only to api.anthropic.com.

```bash
python3 -m http.server   # open http://localhost:8000
npm test                 # LBO hand-check, bid solver, screen, edge cases
```

## Next

- Comps panel: sector trading and transaction multiples to anchor the entry multiple
- Quality-of-earnings view: EBITDA before and after add-backs
- Downside case (reimbursement cut, loss of the top payor) with a leverage covenant check
- Shared storage so a deal team can work from the same pipeline
