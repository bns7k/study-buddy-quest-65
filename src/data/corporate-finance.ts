import { Course } from "@/types/course";

export const corporateFinanceCourse: Course = {
  id: "corporate-finance",
  title: "Corporate Finance",
  description: "Master the fundamentals of corporate finance, from valuation to M&A",
  emoji: "📊",
  modules: [
    {
      id: "week-1",
      weekNumber: 1,
      title: "Introduction to Corporate Finance",
      lessons: [
        {
          id: "w1-l1",
          title: "What is Corporate Finance?",
          explanation: "Corporate finance deals with how corporations handle funding sources, capital structuring, accounting, and investment decisions. The primary goal is to maximize shareholder value through long-term and short-term financial planning. Key areas include capital budgeting (deciding which projects to invest in), capital structure (deciding the mix of debt and equity), and working capital management (managing day-to-day finances).",
          questions: [
            { id: "w1q1", question: "What is the primary goal of corporate finance?", options: ["Minimize taxes", "Maximize shareholder value", "Increase employee salaries", "Reduce company size"], correctIndex: 1, explanation: "The primary goal of corporate finance is to maximize shareholder value through strategic financial decisions." },
            { id: "w1q2", question: "Which of the following is NOT a key area of corporate finance?", options: ["Capital budgeting", "Capital structure", "Product design", "Working capital management"], correctIndex: 2, explanation: "Product design is an operations function, not a core area of corporate finance." },
            { id: "w1q3", question: "Capital budgeting refers to:", options: ["Managing daily cash flows", "Deciding which projects to invest in", "Setting employee budgets", "Calculating taxes"], correctIndex: 1, explanation: "Capital budgeting is the process of evaluating and selecting long-term investments that are worth pursuing." },
          ],
        },
        {
          id: "w1-l2",
          title: "The Role of the Financial Manager",
          explanation: "Financial managers make three key decisions: investment decisions (what assets to buy), financing decisions (how to pay for assets), and dividend decisions (how to return money to shareholders). They act as intermediaries between the firm's operations and financial markets, ensuring capital flows efficiently.",
          questions: [
            { id: "w1q4", question: "Which decision involves choosing how to pay for assets?", options: ["Investment decision", "Financing decision", "Dividend decision", "Operating decision"], correctIndex: 1, explanation: "Financing decisions determine the optimal mix of debt and equity to fund the firm's assets." },
            { id: "w1q5", question: "Financial managers act as intermediaries between:", options: ["Employees and customers", "Operations and financial markets", "Government and shareholders", "Suppliers and retailers"], correctIndex: 1, explanation: "Financial managers bridge the gap between a firm's operations and the financial markets where capital is raised." },
            { id: "w1q6", question: "The dividend decision concerns:", options: ["How much to invest in new projects", "How to return money to shareholders", "Which bank to use", "How many employees to hire"], correctIndex: 1, explanation: "Dividend decisions determine how much of the firm's earnings should be distributed to shareholders vs. reinvested." },
          ],
        },
      ],
    },
    {
      id: "week-2",
      weekNumber: 2,
      title: "Corporate Governance & Information Asymmetry",
      lessons: [
        {
          id: "w2-l1",
          title: "Agency Problems",
          explanation: "Agency problems arise when managers (agents) may not act in the best interest of shareholders (principals). This conflict occurs because managers might pursue personal goals like empire building, excessive perks, or risk aversion. Solutions include performance-based compensation, board oversight, and the threat of takeover.",
          questions: [
            { id: "w2q1", question: "An agency problem occurs between:", options: ["Customers and suppliers", "Managers and shareholders", "Banks and governments", "Employees and customers"], correctIndex: 1, explanation: "Agency problems arise from the separation of ownership (shareholders) and control (managers)." },
            { id: "w2q2", question: "Which is a solution to agency problems?", options: ["Reducing transparency", "Performance-based compensation", "Eliminating dividends", "Increasing debt only"], correctIndex: 1, explanation: "Aligning manager compensation with firm performance helps reduce agency conflicts." },
            { id: "w2q3", question: "'Empire building' by managers is an example of:", options: ["Good governance", "Agency problem", "Efficient markets", "Capital budgeting"], correctIndex: 1, explanation: "Empire building—growing the firm beyond optimal size—is a classic agency problem where managers pursue personal prestige." },
          ],
        },
        {
          id: "w2-l2",
          title: "Information Asymmetry & Signaling",
          explanation: "Information asymmetry exists when managers know more about the firm's prospects than outside investors. This can lead to adverse selection and moral hazard. Firms use signals—like dividend increases, share buybacks, or capital structure changes—to convey private information to the market. The pecking order theory suggests firms prefer internal financing, then debt, then equity, partly because of information asymmetry concerns.",
          questions: [
            { id: "w2q4", question: "Information asymmetry means:", options: ["All investors have equal information", "Managers know more than outside investors", "Markets are perfectly efficient", "Financial statements are always accurate"], correctIndex: 1, explanation: "Information asymmetry refers to the imbalance where insiders have more information than external parties." },
            { id: "w2q5", question: "According to pecking order theory, firms first prefer:", options: ["Equity financing", "Debt financing", "Internal financing", "Convertible bonds"], correctIndex: 2, explanation: "The pecking order theory states firms prefer internal funds first, as they avoid the adverse selection costs of external financing." },
            { id: "w2q6", question: "A dividend increase can serve as a:", options: ["Tax reduction strategy only", "Signal of future profitability", "Sign of financial distress", "Legal requirement"], correctIndex: 1, explanation: "Dividend increases signal management's confidence in future cash flows, helping reduce information asymmetry." },
          ],
        },
      ],
    },
    {
      id: "week-3",
      weekNumber: 3,
      title: "Present and Future Value",
      lessons: [
        {
          id: "w3-l1",
          title: "Time Value of Money",
          explanation: "A dollar today is worth more than a dollar tomorrow because of its earning potential. Future Value (FV) = PV × (1 + r)^n, where PV is present value, r is the interest rate, and n is the number of periods. Present Value (PV) = FV / (1 + r)^n. This concept is the foundation of all financial valuation.",
          questions: [
            { id: "w3q1", question: "If you invest €100 at 10% for 2 years, the future value is:", options: ["€110", "€120", "€121", "€100"], correctIndex: 2, explanation: "FV = 100 × (1.10)² = 100 × 1.21 = €121. This includes compound interest." },
            { id: "w3q2", question: "The present value of €1,000 received in 3 years at 5% is approximately:", options: ["€950", "€864", "€900", "€1,000"], correctIndex: 1, explanation: "PV = 1000 / (1.05)³ = 1000 / 1.1576 ≈ €864." },
            { id: "w3q3", question: "Why is a dollar today worth more than a dollar tomorrow?", options: ["Inflation only", "Earning potential (opportunity cost)", "Government policy", "Supply and demand"], correctIndex: 1, explanation: "The time value of money is primarily driven by the opportunity cost—money today can be invested to earn returns." },
          ],
        },
        {
          id: "w3-l2",
          title: "Annuities and Perpetuities",
          explanation: "An annuity is a series of equal payments at regular intervals. PV of annuity = C × [(1 - (1+r)^-n) / r]. A perpetuity is an annuity that lasts forever: PV = C / r. A growing perpetuity has payments that grow at rate g: PV = C / (r - g). These formulas are essential for valuing bonds, mortgages, and stocks.",
          questions: [
            { id: "w3q4", question: "The present value of a perpetuity paying €50/year at 5% is:", options: ["€500", "€1,000", "€5,000", "€250"], correctIndex: 1, explanation: "PV of perpetuity = C/r = 50/0.05 = €1,000." },
            { id: "w3q5", question: "A growing perpetuity differs from a regular perpetuity because:", options: ["It has a fixed end date", "Payments grow at a constant rate", "It pays less over time", "It requires no discount rate"], correctIndex: 1, explanation: "A growing perpetuity has cash flows that increase at a constant growth rate g each period." },
            { id: "w3q6", question: "Which of these is best valued using an annuity formula?", options: ["A stock with varying dividends", "A 30-year fixed mortgage", "A startup's future revenues", "A one-time bonus payment"], correctIndex: 1, explanation: "A fixed mortgage has equal payments at regular intervals—the defining characteristic of an annuity." },
          ],
        },
      ],
    },
    {
      id: "week-4",
      weekNumber: 4,
      title: "Investment Decision Criteria",
      lessons: [
        {
          id: "w4-l1",
          title: "Net Present Value (NPV)",
          explanation: "NPV is the difference between the present value of cash inflows and outflows. NPV = Σ [CFt / (1+r)^t] - Initial Investment. If NPV > 0, the project creates value and should be accepted. NPV is considered the gold standard of investment criteria because it accounts for the time value of money and measures absolute value creation.",
          questions: [
            { id: "w4q1", question: "A project with NPV > 0 should be:", options: ["Rejected", "Accepted", "Delayed", "Reconsidered"], correctIndex: 1, explanation: "A positive NPV means the project creates value above the required return, so it should be accepted." },
            { id: "w4q2", question: "NPV is preferred over other methods because it:", options: ["Is simplest to calculate", "Ignores time value of money", "Measures absolute value creation", "Only considers payback period"], correctIndex: 2, explanation: "NPV directly measures how much value a project adds to the firm in present-value terms." },
            { id: "w4q3", question: "If the discount rate increases, the NPV of a project generally:", options: ["Increases", "Decreases", "Stays the same", "Doubles"], correctIndex: 1, explanation: "Higher discount rates reduce the present value of future cash flows, lowering NPV." },
          ],
        },
        {
          id: "w4-l2",
          title: "IRR and Payback Period",
          explanation: "The Internal Rate of Return (IRR) is the discount rate that makes NPV = 0. Accept if IRR > required return. However, IRR has limitations with non-conventional cash flows and mutually exclusive projects. The Payback Period measures how quickly the initial investment is recovered—simple but ignores cash flows after payback and the time value of money.",
          questions: [
            { id: "w4q4", question: "IRR is the rate where:", options: ["Profit is maximized", "NPV equals zero", "Revenue equals cost", "Cash flow is highest"], correctIndex: 1, explanation: "IRR is defined as the discount rate that makes the NPV of all cash flows equal to zero." },
            { id: "w4q5", question: "A major limitation of the payback period is:", options: ["It's too complex", "It ignores cash flows after payback", "It always agrees with NPV", "It considers risk"], correctIndex: 1, explanation: "The payback period ignores all cash flows that occur after the initial investment is recovered." },
            { id: "w4q6", question: "When comparing mutually exclusive projects, you should rely on:", options: ["IRR", "Payback period", "NPV", "Accounting rate of return"], correctIndex: 2, explanation: "NPV is more reliable for mutually exclusive projects because IRR can give misleading rankings due to scale and timing differences." },
          ],
        },
      ],
    },
    {
      id: "week-5",
      weekNumber: 5,
      title: "What-if Analysis",
      lessons: [
        {
          id: "w5-l1",
          title: "Sensitivity & Scenario Analysis",
          explanation: "Sensitivity analysis examines how NPV changes when one variable changes while others stay constant—identifying which variables matter most. Scenario analysis changes multiple variables simultaneously to model best-case, worst-case, and base-case outcomes. Both help managers understand project risk and make more informed decisions.",
          questions: [
            { id: "w5q1", question: "Sensitivity analysis changes:", options: ["All variables at once", "One variable at a time", "No variables", "Only the discount rate"], correctIndex: 1, explanation: "Sensitivity analysis isolates the effect of each variable by changing one at a time while holding others constant." },
            { id: "w5q2", question: "Scenario analysis differs from sensitivity analysis because it:", options: ["Uses fewer variables", "Changes multiple variables simultaneously", "Ignores uncertainty", "Only looks at best case"], correctIndex: 1, explanation: "Scenario analysis constructs coherent scenarios where multiple variables change together." },
            { id: "w5q3", question: "The main purpose of what-if analysis is to:", options: ["Eliminate all risk", "Understand project risk and key drivers", "Guarantee positive NPV", "Replace NPV analysis"], correctIndex: 1, explanation: "What-if analysis helps identify risk drivers and understand how uncertainty affects project value." },
          ],
        },
      ],
    },
    {
      id: "week-6",
      weekNumber: 6,
      title: "Real Options",
      lessons: [
        {
          id: "w6-l1",
          title: "Types of Real Options",
          explanation: "Real options give managers flexibility to adapt decisions as uncertainty resolves. Key types: Option to delay (wait for more information), Option to expand (scale up if successful), Option to abandon (cut losses), and Option to switch (change inputs/outputs). Traditional NPV can undervalue projects by ignoring this managerial flexibility.",
          questions: [
            { id: "w6q1", question: "A real option to abandon allows managers to:", options: ["Expand the project", "Cut losses if the project fails", "Delay the investment", "Change the product"], correctIndex: 1, explanation: "The abandonment option gives managers the right to shut down a project and recover salvage value if it underperforms." },
            { id: "w6q2", question: "Traditional NPV may undervalue projects because it ignores:", options: ["Cash flows", "Managerial flexibility", "The discount rate", "Initial investment"], correctIndex: 1, explanation: "Standard NPV assumes a fixed plan, but real options capture the value of adapting to new information." },
            { id: "w6q3", question: "The option to delay is most valuable when:", options: ["There is no uncertainty", "The project is certain to succeed", "There is high uncertainty about future conditions", "Interest rates are zero"], correctIndex: 2, explanation: "The option to wait is most valuable when uncertainty is high, as waiting reveals information that can improve decisions." },
          ],
        },
      ],
    },
    {
      id: "week-7",
      weekNumber: 7,
      title: "Business and Financial Risk",
      lessons: [
        {
          id: "w7-l1",
          title: "Operating & Financial Leverage",
          explanation: "Business risk comes from the uncertainty of operating income and depends on revenue volatility and operating leverage (the proportion of fixed costs). Financial risk is the additional risk from using debt—financial leverage amplifies both gains and losses. The degree of operating leverage (DOL) measures how sensitive EBIT is to changes in sales.",
          questions: [
            { id: "w7q1", question: "A firm with high fixed costs has:", options: ["Low operating leverage", "High operating leverage", "No financial risk", "Guaranteed profits"], correctIndex: 1, explanation: "High fixed costs mean a greater proportion of costs are fixed, leading to higher operating leverage." },
            { id: "w7q2", question: "Financial leverage amplifies:", options: ["Only gains", "Only losses", "Both gains and losses", "Neither gains nor losses"], correctIndex: 2, explanation: "Debt creates fixed interest payments that amplify returns in good times and magnify losses in bad times." },
            { id: "w7q3", question: "Business risk is primarily driven by:", options: ["Tax rates", "Dividend policy", "Revenue volatility and cost structure", "Share price"], correctIndex: 2, explanation: "Business risk depends on the variability of operating income, which is driven by revenue uncertainty and the fixed/variable cost mix." },
          ],
        },
      ],
    },
    {
      id: "week-8",
      weekNumber: 8,
      title: "Cost of Capital (WACC)",
      lessons: [
        {
          id: "w8-l1",
          title: "Weighted Average Cost of Capital",
          explanation: "WACC represents the firm's overall cost of financing and is used as the discount rate for project evaluation. WACC = (E/V) × Re + (D/V) × Rd × (1-T), where E is equity, D is debt, V is total value, Re is cost of equity, Rd is cost of debt, and T is the tax rate. The cost of equity is typically estimated using CAPM: Re = Rf + β(Rm - Rf).",
          questions: [
            { id: "w8q1", question: "In the WACC formula, (1-T) is applied to:", options: ["Cost of equity", "Cost of debt", "Total firm value", "Risk-free rate"], correctIndex: 1, explanation: "The tax shield (1-T) is applied to the cost of debt because interest payments are tax-deductible." },
            { id: "w8q2", question: "CAPM estimates the cost of equity as:", options: ["Rf + β(Rm - Rf)", "D/E × Rd", "EBIT / Total Assets", "Dividends / Price"], correctIndex: 0, explanation: "CAPM: Re = Risk-free rate + Beta × Market risk premium." },
            { id: "w8q3", question: "A firm with more debt in its capital structure will have:", options: ["Higher WACC always", "Lower WACC due to tax shield (up to a point)", "Zero WACC", "Unchanged WACC"], correctIndex: 1, explanation: "Debt is cheaper than equity (due to tax deductibility), so moderate debt lowers WACC, but too much increases financial distress costs." },
          ],
        },
      ],
    },
    {
      id: "week-9",
      weekNumber: 9,
      title: "Short-term Financial Policy",
      lessons: [
        {
          id: "w9-l1",
          title: "Working Capital Management",
          explanation: "Working capital = Current Assets - Current Liabilities. Managing working capital involves balancing liquidity (ability to pay short-term obligations) with profitability (earning returns on assets). The cash conversion cycle measures the time between paying suppliers and collecting from customers. A shorter cycle means faster cash turnover.",
          questions: [
            { id: "w9q1", question: "Working capital equals:", options: ["Total assets - Total liabilities", "Current assets - Current liabilities", "Revenue - Expenses", "Cash - Debt"], correctIndex: 1, explanation: "Net working capital is the difference between current assets and current liabilities." },
            { id: "w9q2", question: "A shorter cash conversion cycle means:", options: ["Slower cash collection", "Faster cash turnover", "More inventory", "Higher debt"], correctIndex: 1, explanation: "A shorter cycle means the firm converts its inventory and receivables to cash more quickly." },
            { id: "w9q3", question: "The main trade-off in working capital management is:", options: ["Risk vs. return", "Liquidity vs. profitability", "Growth vs. stability", "Debt vs. equity"], correctIndex: 1, explanation: "Holding more liquid assets improves safety but earns lower returns—the core working capital trade-off." },
          ],
        },
      ],
    },
    {
      id: "week-11",
      weekNumber: 11,
      title: "Dividend Policy",
      lessons: [
        {
          id: "w11-l1",
          title: "Dividend Theories & Policy",
          explanation: "Modigliani-Miller dividend irrelevance theorem states that in perfect markets, dividend policy doesn't affect firm value. However, real-world factors matter: taxes (dividends may be taxed higher than capital gains), signaling (dividend changes convey information), clientele effects (investors prefer certain payout patterns), and agency costs (dividends reduce free cash flow available for wasteful spending).",
          questions: [
            { id: "w11q1", question: "According to M&M, in perfect markets, dividends are:", options: ["Always beneficial", "Irrelevant to firm value", "Always harmful", "Required by law"], correctIndex: 1, explanation: "Modigliani-Miller's dividend irrelevance theorem states that dividend policy has no effect on firm value in perfect markets." },
            { id: "w11q2", question: "The 'bird in hand' theory suggests investors prefer:", options: ["Capital gains", "Current dividends over uncertain future gains", "Stock splits", "No payouts"], correctIndex: 1, explanation: "The bird-in-hand theory argues investors value certain current dividends more than uncertain future capital gains." },
            { id: "w11q3", question: "Dividends can reduce agency costs by:", options: ["Increasing managerial discretion", "Reducing free cash flow available for wasteful spending", "Eliminating information asymmetry", "Increasing tax payments"], correctIndex: 1, explanation: "Paying dividends forces firms to distribute cash, reducing the funds managers could spend on value-destroying projects." },
          ],
        },
      ],
    },
    {
      id: "week-12",
      weekNumber: 12,
      title: "Mergers and Acquisitions",
      lessons: [
        {
          id: "w12-l1",
          title: "Types and Motives for M&A",
          explanation: "Mergers can be horizontal (same industry), vertical (supply chain), or conglomerate (unrelated). Motives include synergies (cost savings or revenue enhancement), market power, diversification, tax benefits, and managerial hubris. The value of a merger = Value(AB) - Value(A) - Value(B). The acquiring firm must be careful not to overpay—the winner's curse.",
          questions: [
            { id: "w12q1", question: "A horizontal merger involves firms in:", options: ["Different industries", "The same industry", "Different countries only", "The supply chain"], correctIndex: 1, explanation: "Horizontal mergers combine firms in the same industry, often to gain market share or achieve economies of scale." },
            { id: "w12q2", question: "Synergies in M&A mean:", options: ["Combined value exceeds sum of parts", "Both firms lose value", "Only tax benefits", "No change in value"], correctIndex: 0, explanation: "Synergies exist when the combined entity is worth more than the two firms separately—'2+2=5' effect." },
            { id: "w12q3", question: "The 'winner's curse' in M&A refers to:", options: ["Winning a bidding war by overpaying", "Successfully completing a merger", "Finding synergies", "Reducing competition"], correctIndex: 0, explanation: "The winner's curse occurs when the winning bidder pays more than the target is worth, destroying value." },
          ],
        },
      ],
    },
    {
      id: "week-13",
      weekNumber: 13,
      title: "Bank Runs and Beliefs in Finance",
      lessons: [
        {
          id: "w13-l1",
          title: "Bank Runs & Financial Crises",
          explanation: "Banks transform short-term deposits into long-term loans (maturity transformation). This creates vulnerability: if depositors lose confidence and rush to withdraw (bank run), the bank may fail even if solvent. The Diamond-Dybvig model shows bank runs can be self-fulfilling prophecies—rational behavior leads to irrational outcomes. Deposit insurance and lender-of-last-resort facilities help prevent runs.",
          questions: [
            { id: "w13q1", question: "Maturity transformation means banks:", options: ["Only make short-term loans", "Convert short-term deposits into long-term loans", "Match deposit and loan maturities exactly", "Avoid lending entirely"], correctIndex: 1, explanation: "Banks take in short-term deposits and lend long-term, earning the spread but creating liquidity risk." },
            { id: "w13q2", question: "Bank runs can be self-fulfilling because:", options: ["Banks are always insolvent", "Rational fear of others withdrawing causes everyone to withdraw", "Deposit insurance eliminates all risk", "Central banks cause them"], correctIndex: 1, explanation: "If depositors believe others will withdraw, it's rational for them to withdraw too—even from a solvent bank—creating the very crisis they feared." },
            { id: "w13q3", question: "Deposit insurance helps prevent bank runs by:", options: ["Making banks more profitable", "Guaranteeing depositors won't lose money", "Increasing interest rates", "Eliminating all bank risk"], correctIndex: 1, explanation: "Deposit insurance removes depositors' incentive to rush to withdraw, breaking the self-fulfilling cycle." },
          ],
        },
      ],
    },
  ],
};
