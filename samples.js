// Fictional deals for the sample pipeline. Companies, people, brokers and figures are invented.
// Each has the broker materials plus a saved extraction; all deal math runs live.

export const SAMPLE_META = {
  bayside: { source: "Westfield Business Brokers", process: "Broker (limited)", received: "2026-11-10", ioiDue: "2026-12-03", stage: "Screening", owner: "DT" },
  ridgeline: { source: "Owner outreach (cold email)", process: "Proprietary", received: "2026-10-30", ioiDue: "2026-12-12", stage: "Owner call", owner: "DT" },
  pinecrest: { source: "Sunbelt Advisors", process: "Broker (broad)", received: "2026-10-21", ioiDue: "", stage: "Passed", owner: "DT" },
};

export const SAMPLES = [
  {
    id: "bayside",
    text: `CONFIDENTIAL BUSINESS PROFILE: Physician Billing & Revenue Cycle Company (Southern California)

Bayside Medical Billing Solutions provides outsourced billing, coding and collections for 120+ independent physician practices (orthopedics, dermatology, GI). Founded 2004.

($M)               2023    2024    2025
Revenue            6.8     7.4     8.1
Adj. EBITDA        1.50    1.70    1.95

- ~85% of revenue billed monthly as a % of client collections under evergreen agreements
- Largest client is 7% of revenue; average client tenure 8 years
- 64 employees, including 22 certified coders; Operations Manager (12 years) runs day-to-day
- Owner (age 68) is retiring and will support a 6-month transition
- Adj. EBITDA reflects a market-rate GM salary

Asking price: $10.0M`,
    extraction: {
      company_name: "Bayside Medical Billing Solutions", sector: "Healthcare services: physician revenue cycle management", subsector: "Revenue cycle management", sites: null,
      description: "Outsourced billing, coding and collections for 120+ independent physician practices in Southern California.",
      business_model: "Monthly fee charged as a percentage of client collections, under evergreen service agreements.",
      hq: "Southern California", years_in_business: 22, employees: 64,
      financials: [
        { year: "2023", revenue: 6.8, ebitda: 1.5, sde: null, is_projection: false },
        { year: "2024", revenue: 7.4, ebitda: 1.7, sde: null, is_projection: false },
        { year: "2025", revenue: 8.1, ebitda: 1.95, sde: null, is_projection: false },
      ],
      payor_mix: null, recurring_revenue_pct: 85, top_customer_pct: 7,
      asking_price: 10.0, asking_multiple: null, asking_multiple_basis: null, other_adjustments: null,
      owner_transition: "retiring", owner_dependence: "low", owner_dependence_note: "Operations Manager (12 years) runs day-to-day; owner retiring with a 6-month transition",
      management: "Founder (68) retiring with a 6-month transition; Operations Manager with 12 years of tenure; 22 certified coders.",
      thesis: [
        "Recurring, sticky revenue: ~85% billed monthly on evergreen contracts, with average client tenure of 8 years.",
        "No concentration: largest client 7% across 120+ practices.",
        "Clear levers for a new CEO: price to market, add specialties, and use automation and AI-assisted coding to expand margins.",
      ],
      risks: [
        { risk: "Independent practices being bought by hospitals or PE platforms could churn clients.", mitigant: "Pull churn by cause for 2021–2025; check what share of clients have been acquired." },
        { risk: "Certified coder turnover and wage pressure.", mitigant: "Review coder tenure, pay vs. market, and offshore coding options." },
        { risk: "Billing errors create compliance exposure.", mitigant: "Audit claim denial rates and any payer audit history; confirm E&O coverage." },
      ],
      diligence_questions: [
        "Gross revenue retention and churn reasons for each of the last 5 years?",
        "How is the GM salary normalized in Adj. EBITDA, and what other add-backs are there?",
        "Revenue by specialty and by client cohort?",
        "Which client relationships does the owner personally manage?",
      ],
      claims_to_verify: ["Average client tenure of 8 years", "85% recurring revenue"],
      summary: "A recurring, diversified healthcare services business with a retiring owner and a manager already in place: close to a textbook search fund target. The price is reasonable for the quality.",
    },
  },
  {
    id: "ridgeline",
    text: `Ridgeline Commercial HVAC: Owner discussion notes + financials (Denver, CO)

Commercial HVAC service, maintenance and replacement for office buildings, schools and light industrial facilities. Founded 1995.

($M)                     2023    2024    2025
Revenue                  14.0    15.2    16.5
Seller's disc. earnings  2.90    3.15    3.40   (includes owner salary of $0.4M)

- ~40% of revenue from annual preventive maintenance agreements
- Largest customer (a school district) is 11% of revenue
- 85 employees, 60 field technicians; a service manager oversees scheduling
- Owner (59) is the primary salesperson for all large replacement projects; open to a full exit with a 12-month transition

Owner's price expectation: 7.0x SDE`,
    extraction: {
      company_name: "Ridgeline Commercial HVAC", sector: "Commercial services: HVAC service and maintenance", subsector: "HVAC services", sites: null,
      description: "Commercial HVAC service, maintenance and replacement for offices, schools and light industrial facilities in the Denver area.",
      business_model: "Annual preventive maintenance agreements (~40% of revenue) plus repair and replacement project work.",
      hq: "Denver, CO", years_in_business: 31, employees: 85,
      financials: [
        { year: "2023", revenue: 14.0, ebitda: null, sde: 2.9, is_projection: false },
        { year: "2024", revenue: 15.2, ebitda: null, sde: 3.15, is_projection: false },
        { year: "2025", revenue: 16.5, ebitda: null, sde: 3.4, is_projection: false },
      ],
      payor_mix: null, recurring_revenue_pct: 40, top_customer_pct: 11,
      asking_price: null, asking_multiple: 7.0, asking_multiple_basis: "sde", other_adjustments: null,
      owner_transition: "exiting", owner_dependence: "high", owner_dependence_note: "Owner is the primary salesperson for all large replacement projects",
      management: "Owner (59) leads sales on large projects and is open to a full exit with a 12-month transition; a service manager runs scheduling.",
      thesis: [
        "Essential, non-discretionary service with 30-year durability and 40% of revenue under annual maintenance agreements.",
        "Steady growth: revenue up ~9% a year with no customer above 11%.",
        "Professionalize sales: hire a project sales lead and grow the maintenance base, which also lowers owner dependence.",
      ],
      risks: [
        { risk: "The owner personally sells the large replacement projects.", mitigant: "12-month transition with an earnout tied to project bookings; hire a sales lead in year 1." },
        { risk: "Technician shortage limits growth.", mitigant: "Review tech turnover and the apprenticeship pipeline; benchmark wages." },
        { risk: "The price is quoted on SDE, which includes the owner's $0.4M salary.", mitigant: "Price on adjusted EBITDA after a market CEO salary; re-quote the multiple to the owner on that basis." },
      ],
      diligence_questions: [
        "Revenue split between maintenance agreements, repair and replacement projects, with gross margin for each?",
        "Share of replacement revenue the owner sourced personally over the last 3 years?",
        "Maintenance agreement renewal rate and pricing escalators?",
        "Fleet and equipment age, and the capex needed over the next 5 years?",
      ],
      claims_to_verify: ["40% of revenue from maintenance agreements", "Owner salary of $0.4M included in SDE"],
      summary: "A durable, growing service business, but the 7.0x SDE ask is about 7.6x real earnings once a CEO is paid, and the owner holds the sales relationships. Worth pursuing at a lower price with a structured transition.",
    },
  },
  {
    id: "pinecrest",
    text: `Pinecrest Home Care (Phoenix, AZ): Broker teaser

Non-medical home care (personal care, companionship) for seniors. Founded 2017.

($M)          2023    2024    2025
Revenue       12.6    12.1    11.8
EBITDA         1.40    1.15    1.05

- Payor mix: Medicaid managed care (ALTCS) 62%, private pay 38%
- Largest payor (one Medicaid MCO) is 41% of revenue
- 310 caregivers; caregiver turnover ~70% annually
- Owner wishes to remain as CEO post-transaction

Asking: 6.0x EBITDA`,
    extraction: {
      company_name: "Pinecrest Home Care", sector: "Healthcare services: non-medical home care", subsector: "Home care", sites: null,
      description: "Non-medical home care (personal care and companionship) for seniors in the Phoenix area.",
      business_model: "Hourly care billed to Medicaid managed care plans and private-pay families.",
      hq: "Phoenix, AZ", years_in_business: 9, employees: 310,
      financials: [
        { year: "2023", revenue: 12.6, ebitda: 1.4, sde: null, is_projection: false },
        { year: "2024", revenue: 12.1, ebitda: 1.15, sde: null, is_projection: false },
        { year: "2025", revenue: 11.8, ebitda: 1.05, sde: null, is_projection: false },
      ],
      payor_mix: { commercial: 0, medicare: 0, medicaid: 62, other: 38 }, recurring_revenue_pct: null, top_customer_pct: 41,
      asking_price: null, asking_multiple: 6.0, asking_multiple_basis: "ebitda", other_adjustments: null,
      owner_transition: "staying", owner_dependence: null, owner_dependence_note: "",
      management: "Owner wants to remain CEO after the transaction.",
      thesis: ["Aging demographics support long-term demand for home care."],
      risks: [
        { risk: "One Medicaid MCO is 41% of revenue, and rates are set by the state.", mitigant: "None evident." },
        { risk: "~70% caregiver turnover with shrinking revenue and margins.", mitigant: "None evident from the materials." },
      ],
      diligence_questions: ["MCO contract term and the history of rate changes?", "Monthly hours billed and caregiver headcount trend?"],
      claims_to_verify: [],
      summary: "Shrinking, thin-margin, concentrated in one Medicaid payor, and the owner wants to stay as CEO. It doesn't fit a search fund.",
    },
  },
];
