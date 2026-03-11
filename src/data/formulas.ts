export interface Formula {
  id: string;
  name: string;
  formula: string;
  description: string;
  moduleId: string;
  moduleName: string;
}

export const corporateFinanceFormulas: Formula[] = [
  { id: "fv", name: "Future Value", formula: "FV = PV × (1 + r)ⁿ", description: "Calculates the future value of a present amount compounded over n periods at rate r.", moduleId: "week-3", moduleName: "Present and Future Value" },
  { id: "pv", name: "Present Value", formula: "PV = FV / (1 + r)ⁿ", description: "Discounts a future cash flow back to its present value.", moduleId: "week-3", moduleName: "Present and Future Value" },
  { id: "pv-annuity", name: "PV of Annuity", formula: "PV = C × [(1 − (1+r)⁻ⁿ) / r]", description: "Present value of a series of equal payments at regular intervals.", moduleId: "week-3", moduleName: "Present and Future Value" },
  { id: "perpetuity", name: "Perpetuity", formula: "PV = C / r", description: "Present value of an infinite series of equal cash flows.", moduleId: "week-3", moduleName: "Present and Future Value" },
  { id: "growing-perpetuity", name: "Growing Perpetuity", formula: "PV = C / (r − g)", description: "PV of cash flows growing at constant rate g forever.", moduleId: "week-3", moduleName: "Present and Future Value" },
  { id: "npv", name: "Net Present Value", formula: "NPV = Σ [CFₜ / (1+r)ᵗ] − I₀", description: "Sum of discounted cash flows minus the initial investment. Accept if NPV > 0.", moduleId: "week-4", moduleName: "Investment Decision Criteria" },
  { id: "irr", name: "Internal Rate of Return", formula: "NPV = 0 → solve for r (IRR)", description: "The discount rate that makes NPV equal to zero. Accept if IRR > required return.", moduleId: "week-4", moduleName: "Investment Decision Criteria" },
  { id: "wacc", name: "WACC", formula: "WACC = (E/V)×Rₑ + (D/V)×Rd×(1−T)", description: "Weighted average cost of capital considering equity, debt, and the tax shield.", moduleId: "week-8", moduleName: "Cost of Capital (WACC)" },
  { id: "capm", name: "CAPM", formula: "Rₑ = Rf + β(Rm − Rf)", description: "Expected return on equity based on systematic risk (beta).", moduleId: "week-8", moduleName: "Cost of Capital (WACC)" },
  { id: "dol", name: "Degree of Operating Leverage", formula: "DOL = % Δ EBIT / % Δ Sales", description: "Measures how sensitive operating income is to changes in revenue.", moduleId: "week-7", moduleName: "Business and Financial Risk" },
  { id: "working-capital", name: "Net Working Capital", formula: "NWC = Current Assets − Current Liabilities", description: "Measure of short-term liquidity and operational efficiency.", moduleId: "week-9", moduleName: "Short-term Financial Policy" },
  { id: "merger-value", name: "Merger Value Creation", formula: "Synergy = V(AB) − V(A) − V(B)", description: "The value created by combining two firms beyond their standalone values.", moduleId: "week-12", moduleName: "Mergers and Acquisitions" },
];

export const derivativesFormulas: Formula[] = [
  { id: "forward-price", name: "Forward Price", formula: "F₀ = S₀ × e^(rT)", description: "Forward price for an asset providing no income.", moduleId: "od-week-1", moduleName: "Introduction" },
  { id: "put-call-parity", name: "Put-Call Parity", formula: "C + Ke^(−rT) = P + S₀", description: "Relationship between European call, put, strike PV, and spot price.", moduleId: "od-week-1", moduleName: "Introduction" },
  { id: "bsm-call", name: "Black-Scholes (Call)", formula: "C = S₀N(d₁) − Ke^(−rT)N(d₂)", description: "Price of a European call option under the BSM model.", moduleId: "od-week-1", moduleName: "Introduction" },
  { id: "delta", name: "Delta", formula: "Δ = ∂C/∂S", description: "Rate of change of option price with respect to the underlying asset price.", moduleId: "od-week-1", moduleName: "Introduction" },
  { id: "gamma", name: "Gamma", formula: "Γ = ∂²C/∂S²", description: "Rate of change of delta with respect to the underlying asset price.", moduleId: "od-week-1", moduleName: "Introduction" },
  { id: "theta", name: "Theta", formula: "Θ = ∂C/∂t", description: "Rate of change of option price with respect to time (time decay).", moduleId: "od-week-1", moduleName: "Introduction" },
  { id: "vega", name: "Vega", formula: "ν = ∂C/∂σ", description: "Sensitivity of option price to changes in volatility.", moduleId: "od-week-1", moduleName: "Introduction" },
];

export function getFormulasForCourse(courseId: string): Formula[] {
  if (courseId === "corporate-finance") return corporateFinanceFormulas;
  if (courseId === "options-derivatives") return derivativesFormulas;
  return [];
}
