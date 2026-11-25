# Screener

**Live:** https://dt-pr29.github.io/screener/ (it opens with a sample pipeline of three fictional deals)

A deal-screening workspace for a search fund: small, owner-operated businesses with $1–5M of EBITDA, bought with senior debt, a seller note and investor equity, and run by the searcher as CEO.

I built it around the first-pass work I did by hand as a search fund analyst and in sell-side M&A. You take a broker profile or CIM, figure out what the business really earns once a CEO is paid, check it against the fund's criteria, size the debt, and work out what price still covers debt service and returns what investors need. Then you write it up.

## What it does

**Pipeline.** Every target with its source (broker or proprietary outreach), stage (screening → owner call → IOI → LOI → diligence → closed), adjusted EBITDA, seller ask vs. our price range, investor IRR, year-1 DSCR, screen result, next deadline and owner. Filterable, with upcoming deadlines highlighted, and it exports to CSV.

**Deal page.**
- *Memo:* a 2-page preliminary acquisition screen covering the recommendation and indicative price, the business, owner and team, financials with the SDE-to-adjusted-EBITDA bridge, search fund criteria, thesis, risks and mitigants, sources and uses, returns with a sensitivity table, and diligence priorities. Prints to PDF.
- *Financials:* the extracted income statement (EBITDA or SDE), the seller's ask (on EBITDA or SDE), concentration, owner plans and owner dependence, all editable. The analyst owns the numbers, and every edit recalculates.
- *Returns:* sources and uses, a 5-year debt service schedule (senior interest and amortization, seller note interest, DSCR by year, excess cash prepaying senior debt), the exit waterfall split between the searcher and investors, an IRR sensitivity table, and pricing (the max price that meets both the IRR hurdle and the DSCR covenant, and the gap to the ask).
- *Diligence:* a checklist seeded from the CIM review, with status and notes.
- *Notes:* an activity log of owner calls, broker feedback and stage changes.

**Fund criteria.** The search box and standard deal terms in one place: EBITDA range, margin, growth, concentration, years in business, government payor limit; senior leverage, rate and amortization, seller note size and rate, fees and minimum DSCR; investor IRR hurdles, hold period, searcher equity and CEO salary. Changing any of them re-screens the pipeline.

## Design choices

- **SDE is not EBITDA.** Small-business sellers often quote seller's discretionary earnings, which include the owner's own salary. A searcher has to pay a CEO, so the model deducts a market salary and converts any SDE-based asking multiple into adjusted EBITDA terms. In the Ridgeline sample, a "7.0x" ask turns out to be 7.6x real earnings.
- **Price is bound by two constraints.** The max price is the highest multiple that clears both the investor IRR hurdle and the lender's year-1 DSCR minimum, found by bisection. The memo says which constraint binds.
- **The model reads; code does the math.** Claude extracts a fixed schema from the CIM (financials, SDE vs. EBITDA, ask basis, owner plans and dependence) and drafts the qualitative sections. It is told not to compute valuation, debt or returns. All of that lives in `model.js`, which is plain JavaScript covered by tests.
- **Conservative defaults.** Returns run on historical earnings, not projections. Growth is capped at 8%, the exit is at the entry multiple, and investor returns are shown after the searcher's equity.
- **Static app.** Plain HTML/JS with no build step and no server. Deal data stays in the browser. The API key is entered in Settings and sent only to api.anthropic.com.

```bash
python3 -m http.server   # open http://localhost:8000
npm test                 # sources and uses, DSCR hand check, SDE normalization, price solver, edge cases
```

## Next

- SBA 7(a) structure option (10-year term, guaranty fee, personal guarantee) alongside conventional senior debt
- Searcher equity vesting tranches tied to IRR hurdles
- Downside case (lost top customer, margin compression) with the DSCR covenant tested every year
- Shared storage so the searcher and investors see the same pipeline
