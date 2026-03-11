import { Module } from "@/types/course";

export const bonusModuleAfterWeek3: Module = {
  id: "bonus-1",
  weekNumber: 3.5,
  title: "🏗️ Project: Value Tesla Stock",
  isBonus: true,
  description:
    "Apply everything you've learned about present value, future value, and annuities to build a simplified DCF (Discounted Cash Flow) model for Tesla. You'll work with real financial data, estimate free cash flows, choose a discount rate, and arrive at an intrinsic share price — just like a junior analyst on their first day.",
  learningObjectives: [
    "Build a DCF model from scratch using real company data",
    "Estimate free cash flows from financial statements",
    "Calculate intrinsic value per share and compare to market price",
  ],
  lessons: [
    {
      id: "bonus1-l1",
      title: "Reading Tesla's Financials",
      type: "concept",
      explanation:
        "Before you can value a company, you need to understand its financial statements. Tesla reported $96.8B in revenue (2023), with operating margins improving to ~9%. Free Cash Flow was approximately $4.4B. You'll use these real figures as your starting point for a DCF valuation.",
      conceptCards: [
        {
          title: "Revenue & Growth",
          content: "Tesla's revenue grew from $53.8B (2021) → $81.5B (2022) → $96.8B (2023). Growth is decelerating from ~51% to ~19%.",
          example: "An analyst might project 15% growth for Year 1, 12% for Year 2, tapering to 5% terminal growth.",
        },
        {
          title: "Free Cash Flow",
          content: "FCF = Operating Cash Flow − Capital Expenditures. Tesla's 2023 FCF ≈ $4.4B.",
          formula: "FCF = OCF − CapEx",
        },
      ],
      questions: [
        { id: "b1q1", question: "Tesla's 2023 revenue was approximately:", options: ["$53.8B", "$81.5B", "$96.8B", "$120B"], correctIndex: 2, explanation: "Tesla reported ~$96.8B in revenue for FY2023." },
        { id: "b1q2", question: "Free Cash Flow is calculated as:", options: ["Revenue − COGS", "Operating Cash Flow − CapEx", "Net Income − Dividends", "EBITDA − Taxes"], correctIndex: 1, explanation: "FCF = Operating Cash Flow minus Capital Expenditures." },
        { id: "b1q3", question: "If Tesla's revenue grew 19% in 2023, a reasonable Year 1 projection might be:", options: ["25% growth", "15% growth", "0% growth", "50% growth"], correctIndex: 1, explanation: "Analysts typically project slightly declining growth rates when a company's growth is decelerating." },
      ],
    },
    {
      id: "bonus1-l2",
      title: "Building the DCF Model",
      type: "practice",
      explanation:
        "Now project Tesla's free cash flows for 5 years, discount them back to present value, and add a terminal value. Use a WACC of 10% and a terminal growth rate of 3%. With ~3.17B shares outstanding, calculate the intrinsic value per share.",
      questions: [
        { id: "b1q4", question: "If Year 1 projected FCF is $5.06B and WACC is 10%, the PV of Year 1 FCF is:", options: ["$5.06B", "$4.60B", "$4.14B", "$5.57B"], correctIndex: 1, explanation: "PV = $5.06B / (1.10)¹ = $4.60B" },
        { id: "b1q5", question: "Terminal Value using the Gordon Growth Model (FCF₅ = $7B, g = 3%, WACC = 10%) is:", options: ["$70B", "$100B", "$103B", "$23.3B"], correctIndex: 1, explanation: "TV = FCF₅ × (1+g) / (WACC − g) = 7 × 1.03 / 0.07 = $103B. But we need the PV: $103B / (1.10)⁵ ≈ $64B. The TV itself is ~$103B." },
        { id: "b1q6", question: "If total PV of cash flows + PV of terminal value = $85B, and there are 3.17B shares, the intrinsic value per share is approximately:", options: ["$26.80", "$85.00", "$268.00", "$8.50"], correctIndex: 0, explanation: "$85B / 3.17B shares ≈ $26.80 per share. Compare this to the market price to judge if Tesla is over/undervalued." },
        { id: "b1q7", question: "If your DCF gives $26.80/share but Tesla trades at $248, the stock is:", options: ["Undervalued", "Fairly valued", "Overvalued according to this model", "Impossible to determine"], correctIndex: 2, explanation: "The market price far exceeds the DCF value, suggesting the stock is overvalued by this simple model — or that the market prices in higher growth expectations." },
      ],
    },
  ],
};

export const bonusModuleAfterWeek6: Module = {
  id: "bonus-2",
  weekNumber: 6.5,
  title: "🔬 Project: Apple's R&D Investment",
  isBonus: true,
  description:
    "Apple is considering a $2B investment in a new AR/VR research facility. Using real-world data about Apple's financials and the tech industry, evaluate this investment using NPV, sensitivity analysis, and real options thinking.",
  learningObjectives: [
    "Evaluate a real corporate investment decision using NPV",
    "Apply sensitivity analysis to identify key risk drivers",
    "Value the option to expand or abandon the project",
  ],
  lessons: [
    {
      id: "bonus2-l1",
      title: "Structuring the Investment Case",
      type: "concept",
      explanation:
        "Apple spent $29.9B on R&D in 2023. The proposed AR/VR facility would cost $2B upfront and is expected to generate $400M in annual cash flows for 10 years. Apple's WACC is approximately 9%. You need to decide: should Apple invest?",
      conceptCards: [
        {
          title: "The Investment",
          content: "$2B facility, $400M annual cash flows for 10 years, WACC = 9%",
          formula: "NPV = -$2B + Σ [$400M / (1.09)^t] for t = 1 to 10",
        },
        {
          title: "Real Options Angle",
          content: "After Year 3, Apple could expand to a $5B campus (doubling cash flows) or abandon and sell the facility for $1.2B.",
        },
      ],
      questions: [
        { id: "b2q1", question: "The NPV of $400M/year for 10 years at 9% minus $2B initial investment is approximately:", options: ["-$434M", "$567M", "$2B", "$1.2B"], correctIndex: 1, explanation: "PV of annuity = $400M × [(1 - 1.09⁻¹⁰) / 0.09] = $400M × 6.418 = $2,567M. NPV = $2,567M - $2,000M = $567M." },
        { id: "b2q2", question: "If cash flows drop to $250M/year, the NPV becomes:", options: ["$567M", "-$395M", "$0", "$250M"], correctIndex: 1, explanation: "PV = $250M × 6.418 = $1,605M. NPV = $1,605M - $2,000M = -$395M. The project destroys value at lower cash flows." },
        { id: "b2q3", question: "The breakeven annual cash flow (NPV = 0) is approximately:", options: ["$200M", "$312M", "$400M", "$500M"], correctIndex: 1, explanation: "NPV = 0 when PV of annuity = $2B. C = $2,000M / 6.418 ≈ $312M." },
      ],
    },
    {
      id: "bonus2-l2",
      title: "Real Options & Final Decision",
      type: "practice",
      explanation:
        "Now consider the flexibility Apple has. After 3 years, if AR/VR takes off, they can expand. If it flops, they can sell the facility. This flexibility adds value beyond the static NPV.",
      questions: [
        { id: "b2q4", question: "The option to abandon (sell for $1.2B) is most valuable when:", options: ["The project is very profitable", "Cash flows are highly uncertain", "WACC is very low", "Apple has no debt"], correctIndex: 1, explanation: "Abandonment options are most valuable under high uncertainty — they provide a floor on losses." },
        { id: "b2q5", question: "If the expansion option adds $300M in expected value, the adjusted NPV is:", options: ["$567M", "$867M", "$300M", "$267M"], correctIndex: 1, explanation: "Adjusted NPV = Static NPV + Option Value = $567M + $300M = $867M." },
        { id: "b2q6", question: "Based on the full analysis (NPV = $567M, option value = $300M), Apple should:", options: ["Reject the project", "Accept the project", "Wait indefinitely", "Only invest if NPV > $1B"], correctIndex: 1, explanation: "With a strongly positive NPV of $867M (including option value), this is a value-creating project." },
      ],
    },
  ],
};

export const bonusModuleAfterWeek9: Module = {
  id: "bonus-3",
  weekNumber: 9.5,
  title: "📦 Project: Amazon's Cash Machine",
  isBonus: true,
  description:
    "Analyze Amazon's working capital management — one of the most fascinating cases in corporate finance. Amazon has a negative cash conversion cycle, meaning it gets paid by customers before it pays suppliers. Explore how this works using real financial data.",
  learningObjectives: [
    "Calculate a real company's cash conversion cycle",
    "Understand how negative working capital funds growth",
    "Compare working capital strategies across industries",
  ],
  lessons: [
    {
      id: "bonus3-l1",
      title: "Amazon's Cash Conversion Cycle",
      type: "concept",
      explanation:
        "Amazon's CCC is approximately -30 days. This means Amazon collects cash from customers about 30 days BEFORE it needs to pay suppliers. This is a massive competitive advantage — growth is partially self-funding. Compare: Walmart's CCC is ~8 days, while a manufacturer might have a CCC of 60+ days.",
      conceptCards: [
        {
          title: "Cash Conversion Cycle",
          content: "CCC = Days Inventory Outstanding + Days Sales Outstanding − Days Payable Outstanding",
          formula: "CCC = DIO + DSO − DPO",
          example: "Amazon: DIO ≈ 33 days, DSO ≈ 9 days, DPO ≈ 72 days → CCC = 33 + 9 - 72 = -30 days",
        },
      ],
      questions: [
        { id: "b3q1", question: "Amazon's DIO is 33 days, DSO is 9 days, DPO is 72 days. The CCC is:", options: ["114 days", "30 days", "-30 days", "42 days"], correctIndex: 2, explanation: "CCC = 33 + 9 - 72 = -30 days. Negative CCC means Amazon gets paid before paying suppliers." },
        { id: "b3q2", question: "A negative CCC means the company:", options: ["Is losing money", "Collects from customers before paying suppliers", "Has too much inventory", "Needs more debt"], correctIndex: 1, explanation: "A negative CCC means customer payments arrive before supplier payments are due — cash flow advantage." },
        { id: "b3q3", question: "If Amazon's revenue is $575B and CCC is -30 days, the cash float benefit is approximately:", options: ["$47B", "$575B", "$19B", "$5.7B"], correctIndex: 0, explanation: "Cash float ≈ Revenue × |CCC| / 365 = $575B × 30/365 ≈ $47B. This is essentially free financing." },
      ],
    },
    {
      id: "bonus3-l2",
      title: "Working Capital Strategy Comparison",
      type: "practice",
      explanation:
        "Compare three real companies: Amazon (negative CCC), Walmart (low positive CCC), and Boeing (high positive CCC). Understand how industry, business model, and bargaining power drive working capital strategy.",
      questions: [
        { id: "b3q4", question: "Walmart's CCC is ~8 days vs Amazon's -30 days. Walmart's DPO is 42 days vs Amazon's 72 days. This difference mainly reflects:", options: ["Revenue differences", "Amazon's stronger supplier bargaining power", "Walmart's higher growth", "Tax differences"], correctIndex: 1, explanation: "Amazon's much longer DPO reflects its market dominance allowing it to negotiate longer payment terms with suppliers." },
        { id: "b3q5", question: "Boeing's CCC of ~200 days vs Amazon's -30 days is because:", options: ["Boeing is less profitable", "Aircraft manufacturing has very long production cycles", "Boeing has poor management", "Boeing doesn't collect from customers"], correctIndex: 1, explanation: "Aircraft take months to build, creating massive inventory holding periods — a structural characteristic of manufacturing." },
        { id: "b3q6", question: "Which strategy requires the most external financing?", options: ["Amazon (CCC = -30 days)", "Walmart (CCC = 8 days)", "Boeing (CCC = 200 days)", "All require the same"], correctIndex: 2, explanation: "Boeing's long CCC means it must finance 200 days of operations before collecting — requiring significant external capital." },
      ],
    },
  ],
};

export const bonusModuleAfterWeek12: Module = {
  id: "bonus-4",
  weekNumber: 12.5,
  title: "🤝 Project: Microsoft Acquires a Startup",
  isBonus: true,
  description:
    "You're a financial analyst at Microsoft. The company is considering acquiring an AI startup for $5B. Build the full M&A case: estimate synergies, determine the maximum bid price, and avoid the winner's curse. Based on real Microsoft financials.",
  learningObjectives: [
    "Structure a full M&A valuation from acquirer's perspective",
    "Estimate synergies and determine maximum bid price",
    "Apply the winner's curse concept to a real bidding scenario",
  ],
  lessons: [
    {
      id: "bonus4-l1",
      title: "Sizing Up the Target",
      type: "concept",
      explanation:
        "The AI startup has $200M revenue (growing 80% YoY), -$50M EBITDA (investing heavily), and proprietary technology that could be integrated into Microsoft 365 products. Microsoft's 2023 revenue was $212B with ~42% operating margins. The strategic question: is this startup worth $5B?",
      conceptCards: [
        {
          title: "Standalone Value",
          content: "Using a DCF with 40% WACC (high-risk startup): standalone value ≈ $2.5B based on projected profitability in Year 3.",
        },
        {
          title: "Synergy Sources",
          content: "Revenue synergies: AI features in Microsoft 365 could add $3B/year in premium subscriptions. Cost synergies: $200M/year by sharing Azure infrastructure.",
          formula: "Value with synergies = Standalone Value + PV(Synergies)",
        },
      ],
      questions: [
        { id: "b4q1", question: "If standalone value is $2.5B and Microsoft bids $5B, Microsoft is paying a premium of:", options: ["50%", "100%", "200%", "0%"], correctIndex: 1, explanation: "Premium = ($5B - $2.5B) / $2.5B = 100%. Microsoft is paying double the standalone value." },
        { id: "b4q2", question: "Revenue synergies of $3B/year discounted at 10% as a perpetuity are worth:", options: ["$3B", "$10B", "$30B", "$300M"], correctIndex: 2, explanation: "PV of perpetuity = $3B / 0.10 = $30B. Even if only partially realized, synergies easily justify the premium." },
        { id: "b4q3", question: "The maximum bid price should be:", options: ["Standalone value only", "Standalone value + ALL synergies", "Standalone value + synergies − required return to Microsoft shareholders", "Whatever competitors bid"], correctIndex: 2, explanation: "Microsoft should bid up to standalone value plus synergies, minus a return to compensate its own shareholders — never pay 100% of synergies away." },
      ],
    },
    {
      id: "bonus4-l2",
      title: "Bidding Strategy & Winner's Curse",
      type: "practice",
      explanation:
        "Google and Amazon are also bidding. Each values the synergies differently. If you win, it might be because you overestimated synergies. How do you structure a winning bid that avoids the winner's curse?",
      questions: [
        { id: "b4q4", question: "If three firms estimate synergies at $15B, $20B, and $30B, the winner's curse suggests the $30B bidder:", options: ["Made the best deal", "Likely overestimated synergies", "Will definitely profit", "Should bid even higher"], correctIndex: 1, explanation: "If you win a competitive auction, it's likely because your estimate was the most optimistic — and possibly too high." },
        { id: "b4q5", question: "To avoid the winner's curse, Microsoft should:", options: ["Always bid the highest", "Shade the bid below estimated synergy value", "Never participate in auctions", "Ignore competitors' bids"], correctIndex: 1, explanation: "Rational bidders discount their estimates to account for the possibility of overvaluation — this is called bid shading." },
        { id: "b4q6", question: "If Microsoft estimates $20B in synergies, standalone value is $2.5B, and it wants to keep at least 60% of synergy value, the maximum bid is:", options: ["$22.5B", "$10.5B", "$5B", "$20B"], correctIndex: 1, explanation: "Max bid = $2.5B + 40% × $20B = $2.5B + $8B = $10.5B. Microsoft keeps 60% of synergy value ($12B) for its shareholders." },
        { id: "b4q7", question: "The final deal price should ideally leave value for:", options: ["Only the seller", "Only the buyer", "Both buyer and seller", "Neither — it should be a fair trade"], correctIndex: 2, explanation: "A successful M&A deal creates value for both parties — the seller gets a premium over standalone value, and the buyer captures synergies above what it paid." },
      ],
    },
  ],
};
