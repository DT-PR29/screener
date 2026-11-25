// Fictional teasers for demo mode. Companies, people and figures are invented.
// Each has the teaser text plus a saved model extraction so the app works without
// an API key. All deal math (screen, LBO, bid range, sensitivity) runs live.

export const SAMPLES = [
  {
    id: "crestline",
    title: "Crestline Diagnostics (healthcare services)",
    text: `PROJECT SUMMIT: CONFIDENTIAL TEASER

Crestline Diagnostics Partners ("Crestline") is a leading independent provider of outpatient diagnostic imaging and clinical lab services in the Southeast, operating 14 sites across Georgia, Tennessee and the Carolinas.

Financial summary ($M)       2023    2024    2025    2026E
Net revenue                  62.0    71.0    82.0    93.0
Adj. EBITDA                  11.2    13.1    15.6    18.4

Highlights
- 4 de novo sites opened since 2022, each reaching breakeven within 14 months
- Referral network of 1,100+ physicians; ~65% of volume from repeat referring practices
- Diversified payor mix: largest payor (regional BCBS plan) is 18% of revenue; Medicare 22%
- Founder-led; CEO Dr. Marcus Hale (radiologist) and CFO Janine Ortiz (ex-HCA) to roll 20% equity
- Fragmented market with 40+ identified tuck-in targets ($1-4M EBITDA)

The shareholders are seeking a partner to accelerate de novo and M&A growth. Guidance: 13.5x LTM Adj. EBITDA.`,
    extraction: {
      company_name: "Crestline Diagnostics Partners", sector: "Healthcare services: outpatient imaging and lab",
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
    title: "Atlas Fleet Services (business services)",
    text: `PROJECT ANVIL: CONFIDENTIAL

Atlas Fleet Services provides contracted preventive maintenance and repair for commercial vehicle fleets (utilities, municipalities, last-mile delivery) across Texas from 9 service centers and 140 mobile units.

($M)            2023   2024   2025
Revenue         38.0   44.0   51.0
EBITDA           6.1    7.5    9.2

- 72% of revenue under multi-year maintenance contracts, 94% contract renewal rate
- 600+ fleet customers; largest customer is 9% of revenue
- Mobile model: technicians service vehicles on-site, cutting fleet downtime
- Owner (age 64) seeking full exit; second-tier management in place (GM 11 years, Controller 6 years)

Seller expectation: ~$60M enterprise value.`,
    extraction: {
      company_name: "Atlas Fleet Services", sector: "Business services: commercial fleet maintenance",
      description: "Contracted preventive maintenance and repair for commercial fleets across Texas, via 9 service centers and 140 mobile units.",
      business_model: "Multi-year maintenance contracts plus time-and-materials repair, delivered on-site by mobile technicians.",
      hq: "Texas",
      financials: [
        { year: "2023", revenue: 38, ebitda: 6.1, is_projection: false },
        { year: "2024", revenue: 44, ebitda: 7.5, is_projection: false },
        { year: "2025", revenue: 51, ebitda: 9.2, is_projection: false },
      ],
      recurring_revenue_pct: 72, top_customer_pct: 9, asking_multiple: null, asking_price: 60,
      management: "Owner (64) seeking a full exit; GM (11 years) and Controller (6 years) in place.",
      thesis: [
        "Contracted, recurring revenue: 72% under multi-year contracts with a 94% renewal rate.",
        "Diversified base: 600+ fleet customers, none above 9% of revenue.",
        "Clear expansion levers: replicate the mobile model in adjacent Sun Belt metros and add EV fleet servicing.",
      ],
      risks: [
        { risk: "Owner exit: relationships and pricing may sit with the founder.", mitigant: "Require a 12–24 month transition, and check how many top accounts the GM owns today." },
        { risk: "Technician labor is tight and wages are rising.", mitigant: "Diligence tech turnover, wage trends and the contract price escalators." },
        { risk: "Texas-only footprint is exposed to the regional economy and weather.", mitigant: "Customer mix leans toward utilities and municipalities, which are less cyclical." },
      ],
      diligence_questions: [
        "Do contracts include annual price escalators, and have they been enforced?",
        "Revenue and margin split between contract maintenance and T&M repair?",
        "Fleet age and replacement capex for the 140 mobile units?",
        "Which of the top 20 customer relationships are owned by the owner personally?",
      ],
      claims_to_verify: ["94% contract renewal rate", "72% contracted revenue"],
      summary: "A recurring, diversified services business at a reasonable ask. Key-person risk around the retiring owner is the main diligence item.",
    },
  },
  {
    id: "brightpath",
    title: "BrightPath Staffing (screen fail)",
    text: `BrightPath Clinical Staffing: Investment Opportunity

BrightPath places travel and per-diem nurses with hospital systems in the Midwest.

($M)         2023    2024    2025
Revenue     140.0   128.0   110.0
EBITDA       14.0    10.0     7.0

- Largest client (a 9-hospital system) represents 31% of revenue
- Bill rates normalizing post-COVID; management expects stabilization in 2026
- Seeking 7.0x LTM EBITDA`,
    extraction: {
      company_name: "BrightPath Clinical Staffing", sector: "Healthcare staffing",
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
