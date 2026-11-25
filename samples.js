// Fictional teasers for demo mode. Companies, people and figures are invented.
// Each has the teaser text plus a saved model extraction so the app works without
// an API key. All deal math (screen, LBO, bid range, sensitivity) runs live.

// Process details for the sample pipeline (also fictional).
export const SAMPLE_META = {
  crestline: { source: "Harbor Lane Advisors", process: "Broad auction", received: "2026-11-12", ioiDue: "2026-12-04", stage: "Screening", owner: "DT" },
  atlas: { source: "Founder outreach", process: "Proprietary", received: "2026-11-03", ioiDue: "2026-11-21", stage: "IOI submitted", owner: "DT" },
  brightpath: { source: "Pinewood Securities", process: "Targeted", received: "2026-10-28", ioiDue: "", stage: "Passed", owner: "DT" },
};

export const SAMPLES = [
  {
    id: "crestline",
    title: "Crestline Diagnostics",
    text: `PROJECT SUMMIT: CONFIDENTIAL TEASER

Crestline Diagnostics Partners ("Crestline") is a leading independent provider of outpatient diagnostic imaging and clinical lab services in the Southeast, operating 14 sites across Georgia, Tennessee and the Carolinas.

Financial summary ($M)       2023    2024    2025    2026E
Net revenue                  62.0    71.0    82.0    93.0
Adj. EBITDA                  11.2    13.1    15.6    18.4

Highlights
- 4 de novo sites opened since 2022, each reaching breakeven within 14 months
- Referral network of 1,100+ physicians; ~65% of volume from repeat referring practices
- Diversified payor mix: commercial 52%, Medicare 22%, Medicaid 9%, other 17%; largest payor (regional BCBS plan) is 18% of revenue
- Founder-led; CEO Dr. Marcus Hale (radiologist) and CFO Janine Ortiz (ex-HCA) to roll 20% equity
- Fragmented market with 40+ identified tuck-in targets ($1-4M EBITDA)

The shareholders are seeking a partner to accelerate de novo and M&A growth. Guidance: 13.5x LTM Adj. EBITDA.`,
    extraction: {
      company_name: "Crestline Diagnostics Partners", sector: "Healthcare services: outpatient imaging and lab", subsector: "Diagnostics", sites: 14,
      payor_mix: { commercial: 52, medicare: 22, medicaid: 9, other: 17 },
      description: "Independent outpatient diagnostic imaging and clinical lab provider with 14 sites across GA, TN and the Carolinas.",
      business_model: "Fee-for-service reimbursement from commercial payors and Medicare on imaging and lab volume driven by physician referrals.",
      hq: "Southeast US",
      financials: [
        { year: "2023", revenue: 62, ebitda: 11.2, is_projection: false },
        { year: "2024", revenue: 71, ebitda: 13.1, is_projection: false },
        { year: "2025", revenue: 82, ebitda: 15.6, is_projection: false },
        { year: "2026E", revenue: 93, ebitda: 18.4, is_projection: true },
      ],
      recurring_revenue_pct: 65, top_customer_pct: 18, asking_multiple: 13.5, asking_price: null,
      management: "Founder-led: CEO Dr. Marcus Hale (radiologist), CFO Janine Ortiz (ex-HCA); management rolling 20% equity.",
      thesis: [
        "Proven de novo playbook: 4 new sites reached breakeven within 14 months, giving organic growth a sponsor can underwrite.",
        "Buy-and-build runway: 40+ identified tuck-ins at $1–4M EBITDA, which can likely be bought at lower multiples than the platform.",
        "Sticky demand: 1,100+ referring physicians and ~65% repeat referral volume, with no payor above 18%.",
      ],
      risks: [
        { risk: "Reimbursement cuts (Medicare is 22% of revenue; imaging rates are a frequent CMS target).", mitigant: "Model a 5–10% rate cut on Medicare volume; check commercial contract renewal dates." },
        { risk: "Radiologist and technologist staffing shortages could cap capacity at new sites.", mitigant: "Diligence turnover, open roles and the teleradiology backup coverage." },
        { risk: "Asking price of 13.5x assumes the growth continues.", mitigant: "Anchor the bid to returns on LTM EBITDA, not 2026E." },
      ],
      diligence_questions: [
        "Site-level P&Ls: how do the 4 de novos compare to mature sites on EBITDA margin?",
        "What are the EBITDA add-backs, and how much of Adj. EBITDA is pro forma?",
        "Payor contract terms and renewal schedule for the top 5 payors?",
        "Equipment age and the capex needed to replace MRI/CT units over the hold?",
      ],
      claims_to_verify: ["De novo breakeven within 14 months", "65% repeat referral volume", "40+ tuck-in targets"],
      summary: "A growing, founder-led diagnostics platform with a real buy-and-build angle in a fragmented market. The business fits; the 13.5x ask is the issue.",
    },
  },
  {
    id: "atlas",
    title: "Keystone Physical Therapy",
    text: `PROJECT KEYSTONE: CONFIDENTIAL

Keystone Physical Therapy Partners operates 31 outpatient physical therapy clinics across Texas and Oklahoma, treating orthopedic, sports and post-surgical patients.

($M)            2023   2024   2025
Revenue         38.0   44.0   51.0
Adj. EBITDA      6.1    7.5    9.2

- Same-clinic visit growth of 7% in 2025; 6 clinics opened since 2023
- Payor mix: commercial 56%, Medicare 26%, Medicaid 4%, workers' comp / auto / other 14%; largest payor (UnitedHealthcare) 14%
- Referral relationships with 400+ orthopedic surgeons; 2 hospital system JV clinics
- Founder (PT, age 61) seeking majority recap; regional directors average 9 years tenure

Owner expectation: ~$60M enterprise value.`,
    extraction: {
      company_name: "Keystone Physical Therapy Partners", sector: "Healthcare services: outpatient physical therapy", subsector: "Physical therapy", sites: 31,
      payor_mix: { commercial: 56, medicare: 26, medicaid: 4, other: 14 },
      description: "Outpatient physical therapy platform with 31 clinics across Texas and Oklahoma, focused on orthopedic, sports and post-surgical care.",
      business_model: "Fee-for-service visits reimbursed by commercial payors, Medicare, workers' comp and auto, driven by surgeon referrals.",
      hq: "Texas",
      financials: [
        { year: "2023", revenue: 38, ebitda: 6.1, is_projection: false },
        { year: "2024", revenue: 44, ebitda: 7.5, is_projection: false },
        { year: "2025", revenue: 51, ebitda: 9.2, is_projection: false },
      ],
      recurring_revenue_pct: null, top_customer_pct: 14, asking_multiple: null, asking_price: 60,
      management: "Founder (PT, 61) seeking a majority recap and rolling equity; regional directors average 9 years of tenure.",
      thesis: [
        "Organic growth engine: 7% same-clinic visit growth plus 6 de novo clinics since 2023.",
        "Favorable payor mix for PT: 56% commercial and 14% workers' comp/auto, with Medicare at 26% and no payor above 14%.",
        "Platform for add-ons in a fragmented market; the 2 hospital JV clinics are a template for more partnerships.",
      ],
      risks: [
        { risk: "Medicare PT fee schedule cuts (26% of revenue).", mitigant: "Model a 3% annual Medicare rate cut; check that the commercial contracts have escalators." },
        { risk: "Therapist shortage and wage inflation compress clinic margins.", mitigant: "Diligence clinician turnover, open roles and visits per therapist by clinic." },
        { risk: "Founder transition on surgeon referral relationships.", mitigant: "Map the top 50 referring surgeons to clinic directors, not the founder." },
      ],
      diligence_questions: [
        "Clinic-level P&Ls: margin of the 6 de novos vs. the mature base?",
        "Visits per therapist per day and therapist turnover, by clinic?",
        "Commercial contract renewal dates and rate escalators for the top 5 payors?",
        "What drives the EBITDA add-backs, and are any related to the founder's comp?",
      ],
      claims_to_verify: ["7% same-clinic visit growth", "400+ referring surgeons"],
      summary: "A growing, well-run PT platform with a commercial-heavy payor mix at a fair ask. Medicare rate risk and founder referral relationships are the key diligence items.",
    },
  },
  {
    id: "brightpath",
    title: "BrightPath Staffing",
    text: `BrightPath Clinical Staffing: Investment Opportunity

BrightPath places travel and per-diem nurses with hospital systems in the Midwest.

($M)         2023    2024    2025
Revenue     140.0   128.0   110.0
EBITDA       14.0    10.0     7.0

- Largest client (a 9-hospital system) represents 31% of revenue
- Bill rates normalizing post-COVID; management expects stabilization in 2026
- Seeking 7.0x LTM EBITDA`,
    extraction: {
      company_name: "BrightPath Clinical Staffing", sector: "Healthcare staffing", subsector: "Staffing", sites: null, payor_mix: null,
      description: "Travel and per-diem nurse staffing for Midwest hospital systems.",
      business_model: "Bill-rate spread on nurses placed with hospital clients.",
      hq: "Midwest US",
      financials: [
        { year: "2023", revenue: 140, ebitda: 14, is_projection: false },
        { year: "2024", revenue: 128, ebitda: 10, is_projection: false },
        { year: "2025", revenue: 110, ebitda: 7, is_projection: false },
      ],
      recurring_revenue_pct: 20, top_customer_pct: 31, asking_multiple: 7, asking_price: null,
      management: "Not described.",
      thesis: ["Possible recovery if bill rates stabilize, as management expects in 2026."],
      risks: [
        { risk: "Revenue and EBITDA are falling as post-COVID bill rates normalize.", mitigant: "None evident from the materials." },
        { risk: "One hospital system is 31% of revenue.", mitigant: "None stated." },
      ],
      diligence_questions: ["Contract term and renewal date with the 31% client?", "Monthly bill-rate and margin trend through 2025?"],
      claims_to_verify: ["Stabilization in 2026"],
      summary: "Shrinking revenue, collapsing margins and heavy concentration in a single client. A pass at any multiple until the trend turns.",
    },
  },
];
