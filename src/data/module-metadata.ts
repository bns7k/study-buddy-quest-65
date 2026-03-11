export const moduleMetadata: Record<string, { description: string; learningObjectives: string[] }> = {
  "week-1": {
    description: "Get an overview of corporate finance, understand its core objectives, and learn about the role of the financial manager in maximizing shareholder value.",
    learningObjectives: [
      "Understand the primary goal of corporate finance",
      "Identify the three key areas: capital budgeting, capital structure, working capital",
      "Explain the three decisions a financial manager makes",
    ],
  },
  "week-2": {
    description: "Explore the conflicts between managers and shareholders, and understand how information asymmetry affects corporate decisions and market signaling.",
    learningObjectives: [
      "Explain the agency problem and its solutions",
      "Understand information asymmetry and adverse selection",
      "Apply the pecking order theory of financing",
    ],
  },
  "week-3": {
    description: "Master the time value of money, compound interest, and the valuation of annuities and perpetuities — the foundation of all financial valuation.",
    learningObjectives: [
      "Calculate future value and present value",
      "Apply annuity and perpetuity formulas",
      "Understand compound interest vs. simple interest",
    ],
  },
  "week-4": {
    description: "Learn the main tools for evaluating investment projects: NPV, IRR, and payback period. Understand when each method works best.",
    learningObjectives: [
      "Calculate and interpret NPV",
      "Understand IRR and its limitations",
      "Compare NPV, IRR, and payback period",
    ],
  },
  "week-5": {
    description: "Discover how sensitivity and scenario analysis help managers understand risk and make better investment decisions under uncertainty.",
    learningObjectives: [
      "Perform sensitivity analysis on NPV",
      "Construct best/worst/base case scenarios",
      "Identify key risk drivers in a project",
    ],
  },
  "week-6": {
    description: "Learn how real options add value to projects by giving managers flexibility to adapt, delay, expand, or abandon investments as conditions change.",
    learningObjectives: [
      "Identify the main types of real options",
      "Explain why traditional NPV may undervalue flexibility",
      "Evaluate when the option to delay is valuable",
    ],
  },
  "week-7": {
    description: "Understand how operating and financial leverage affect a firm's risk profile, and learn to distinguish business risk from financial risk.",
    learningObjectives: [
      "Calculate degree of operating leverage",
      "Explain how financial leverage amplifies returns",
      "Distinguish business risk from financial risk",
    ],
  },
  "week-8": {
    description: "Master the Weighted Average Cost of Capital — the discount rate that reflects a firm's overall cost of financing from all sources.",
    learningObjectives: [
      "Calculate WACC from its components",
      "Use CAPM to estimate cost of equity",
      "Understand the tax shield on debt",
    ],
  },
  "week-9": {
    description: "Learn how firms manage their day-to-day finances through working capital management, balancing liquidity with profitability.",
    learningObjectives: [
      "Define and calculate net working capital",
      "Explain the cash conversion cycle",
      "Balance liquidity and profitability trade-offs",
    ],
  },
  "week-11": {
    description: "Explore dividend policy theories and understand why firms pay dividends, the signaling effect, and the impact on firm value.",
    learningObjectives: [
      "Explain M&M dividend irrelevance theorem",
      "Understand the bird-in-hand theory",
      "Analyze dividends as a solution to agency costs",
    ],
  },
  "week-12": {
    description: "Study the types, motives, and valuation of mergers and acquisitions, and understand the winner's curse and synergy valuation.",
    learningObjectives: [
      "Classify mergers as horizontal, vertical, or conglomerate",
      "Evaluate merger synergies and value creation",
      "Understand the winner's curse in bidding",
    ],
  },
  "week-13": {
    description: "Understand how bank runs occur, why they can be self-fulfilling, and how deposit insurance and central banks prevent financial crises.",
    learningObjectives: [
      "Explain maturity transformation",
      "Understand the Diamond-Dybvig model",
      "Analyze the role of deposit insurance",
    ],
  },
  // Bonus project modules
  "bonus-1": {
    description: "Apply TVM concepts to build a DCF model for Tesla using real financial data.",
    learningObjectives: ["Build a DCF model from scratch", "Estimate free cash flows", "Calculate intrinsic value per share"],
  },
  "bonus-2": {
    description: "Evaluate Apple's $2B AR/VR R&D investment using NPV, sensitivity analysis, and real options.",
    learningObjectives: ["Evaluate a real investment using NPV", "Apply sensitivity analysis", "Value the option to expand or abandon"],
  },
  "bonus-3": {
    description: "Analyze Amazon's negative cash conversion cycle and compare working capital strategies.",
    learningObjectives: ["Calculate a real company's CCC", "Understand negative working capital", "Compare strategies across industries"],
  },
  "bonus-4": {
    description: "Structure a full M&A case: should Microsoft acquire an AI startup for $5B?",
    learningObjectives: ["Structure M&A valuation", "Estimate synergies and max bid price", "Apply winner's curse concept"],
  },
  // Options & Derivatives modules
  "od-week-1": {
    description: "Introduction to derivative markets, the difference between exchange-traded and OTC instruments, and the basic types of derivatives.",
    learningObjectives: ["Define derivatives and their underlying assets", "Compare exchange-traded vs OTC markets", "Identify forwards, futures, and options"],
  },
  "od-week-2": {
    description: "Learn how futures markets work, including the mechanics of margin accounts, marking to market, and the role of clearinghouses.",
    learningObjectives: ["Understand margin requirements", "Explain daily settlement (marking to market)", "Describe the role of the clearinghouse"],
  },
  "od-week-3": {
    description: "Master hedging strategies using futures contracts and understand basis risk, cross-hedging, and optimal hedge ratios.",
    learningObjectives: ["Design hedging strategies with futures", "Calculate optimal hedge ratios", "Understand basis risk"],
  },
};
