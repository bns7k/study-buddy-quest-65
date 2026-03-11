import { Course } from "@/types/course";

export const optionsDerivativesCourse: Course = {
  id: "options-derivatives",
  title: "Options, Futures & Other Derivatives",
  description: "Master derivatives markets from futures mechanics to exotic options",
  emoji: "📈",
  modules: [
    {
      id: "od-week-1",
      weekNumber: 1,
      title: "Introduction",
      lessons: [
        {
          id: "od-w1-l1",
          title: "Exchange-Traded & OTC Markets",
          explanation:
            "Derivatives are financial instruments whose value depends on (or derives from) an underlying asset. They are traded on exchanges (standardized contracts) or over-the-counter (OTC, customized between parties). Exchange-traded markets offer transparency and reduced counterparty risk through clearinghouses. OTC markets are larger by volume but carry more counterparty risk. Post-2008 regulations have pushed OTC trading toward central clearing.",
          questions: [
            { id: "od-w1q1", question: "A derivative's value depends on:", options: ["Its own historical price", "An underlying asset", "The stock exchange index only", "Government bonds only"], correctIndex: 1, explanation: "By definition, a derivative derives its value from an underlying asset such as a stock, bond, commodity, or interest rate." },
            { id: "od-w1q2", question: "Which market type offers standardized contracts?", options: ["OTC markets", "Exchange-traded markets", "Private markets", "Dark pools"], correctIndex: 1, explanation: "Exchange-traded markets use standardized contracts with set quantities, expiration dates, and delivery terms." },
            { id: "od-w1q3", question: "What reduces counterparty risk on exchanges?", options: ["Bilateral agreements", "Clearinghouses", "Verbal contracts", "Deregulation"], correctIndex: 1, explanation: "Clearinghouses stand between buyers and sellers, guaranteeing both sides of every trade." },
          ],
        },
        {
          id: "od-w1-l2",
          title: "Forward Contracts, Futures & Options",
          explanation:
            "A forward contract is an OTC agreement to buy/sell an asset at a future date for a set price. A futures contract is similar but exchange-traded with daily settlement (marking to market). An option gives the holder the right (not obligation) to buy (call) or sell (put) the underlying at a specified strike price. Hedgers use derivatives to reduce risk, speculators to bet on direction, and arbitrageurs to exploit price discrepancies.",
          questions: [
            { id: "od-w1q4", question: "What distinguishes a futures contract from a forward?", options: ["Futures are OTC", "Futures are exchange-traded with daily settlement", "Forwards have daily settlement", "There is no difference"], correctIndex: 1, explanation: "Futures are standardized, exchange-traded, and marked to market daily, unlike OTC forwards." },
            { id: "od-w1q5", question: "A call option gives the right to:", options: ["Sell the underlying", "Buy the underlying", "Lend money", "Issue bonds"], correctIndex: 1, explanation: "A call option gives the holder the right (not obligation) to buy the underlying asset at the strike price." },
            { id: "od-w1q6", question: "Arbitrageurs aim to:", options: ["Take large directional bets", "Reduce portfolio risk", "Exploit price discrepancies for riskless profit", "Provide liquidity only"], correctIndex: 2, explanation: "Arbitrageurs lock in riskless profit by simultaneously trading in two or more markets to exploit price differences." },
          ],
        },
      ],
    },
    {
      id: "od-week-2",
      weekNumber: 2,
      title: "Mechanics of Futures Markets",
      lessons: [
        {
          id: "od-w2-l1",
          title: "Futures Contract Specifications & Margins",
          explanation:
            "A futures contract specifies the asset, contract size, delivery location, and delivery month. Margin accounts protect against default: the initial margin is the deposit required to open a position, and the maintenance margin is the minimum balance before a margin call is triggered. Daily settlement (marking to market) means gains/losses are settled each day. If the margin falls below maintenance level, the trader must deposit variation margin.",
          questions: [
            { id: "od-w2q1", question: "Initial margin is:", options: ["The final settlement payment", "A deposit required to open a futures position", "A fee paid to brokers", "The total contract value"], correctIndex: 1, explanation: "Initial margin is the upfront deposit that acts as a good-faith guarantee when entering a futures position." },
            { id: "od-w2q2", question: "What triggers a margin call?", options: ["Profit exceeding initial margin", "Balance falling below maintenance margin", "Contract expiration", "Market closing"], correctIndex: 1, explanation: "When the account balance drops below the maintenance margin level, the trader receives a margin call to top up." },
            { id: "od-w2q3", question: "Marking to market means:", options: ["Setting the opening price", "Daily settlement of gains and losses", "Closing a position", "Adjusting the strike price"], correctIndex: 1, explanation: "Marking to market settles profits and losses daily, crediting or debiting the margin account." },
          ],
        },
        {
          id: "od-w2-l2",
          title: "Convergence, Delivery & Order Types",
          explanation:
            "As a futures contract approaches expiration, the futures price converges to the spot price. If it didn't, arbitrage opportunities would arise. Most futures contracts are closed out before delivery. Types of orders include market orders (immediate execution), limit orders (execute at specified price or better), and stop-loss orders (triggered when price reaches a certain level).",
          questions: [
            { id: "od-w2q4", question: "At expiration, the futures price:", options: ["Diverges from spot", "Equals the spot price", "Becomes zero", "Doubles the spot price"], correctIndex: 1, explanation: "Convergence ensures futures price equals spot price at expiration; otherwise arbitrage profits would exist." },
            { id: "od-w2q5", question: "A limit order:", options: ["Executes immediately at market price", "Executes at a specified price or better", "Is only for futures", "Cannot be cancelled"], correctIndex: 1, explanation: "A limit order specifies the worst acceptable price, providing price protection but no guarantee of execution." },
            { id: "od-w2q6", question: "Most futures contracts are:", options: ["Held to delivery", "Closed out before delivery", "Converted to options", "Cancelled by the exchange"], correctIndex: 1, explanation: "The vast majority of futures positions are closed before expiration by entering an offsetting trade." },
          ],
        },
      ],
    },
    {
      id: "od-week-3",
      weekNumber: 3,
      title: "Hedging Strategies Using Futures",
      lessons: [
        {
          id: "od-w3-l1",
          title: "Short & Long Hedges",
          explanation:
            "A short hedge involves selling futures to protect against a price decline in an asset you own or plan to sell. A long hedge involves buying futures to protect against a price increase in an asset you plan to buy. Basis risk arises when the hedge is imperfect—the difference between the spot and futures price (the basis) may change unpredictably.",
          questions: [
            { id: "od-w3q1", question: "A producer worried about falling prices should use:", options: ["A long hedge", "A short hedge", "No hedge", "A straddle"], correctIndex: 1, explanation: "A short hedge (selling futures) protects against price declines by locking in a selling price." },
            { id: "od-w3q2", question: "Basis risk refers to:", options: ["The risk of total loss", "Uncertainty in the spot-futures price difference", "Interest rate changes", "Currency fluctuation"], correctIndex: 1, explanation: "Basis risk is the risk that the basis (spot price minus futures price) changes unpredictably." },
            { id: "od-w3q3", question: "A manufacturer needing to buy raw materials in 3 months should use:", options: ["A short hedge", "A long hedge", "Sell call options", "Do nothing"], correctIndex: 1, explanation: "A long hedge (buying futures) locks in the purchase price and protects against rising costs." },
          ],
        },
        {
          id: "od-w3-l2",
          title: "Optimal Hedge Ratio & Cross-Hedging",
          explanation:
            "The minimum variance hedge ratio (h*) equals ρ × (σS/σF), where ρ is the correlation between spot and futures price changes, σS is the standard deviation of spot price changes, and σF is that of futures. Cross-hedging uses a futures contract on a related (but different) asset when no futures exist for the exact asset being hedged. Stock index futures can hedge equity portfolio risk using the portfolio's beta.",
          questions: [
            { id: "od-w3q4", question: "The optimal hedge ratio depends on:", options: ["Only futures prices", "Correlation and volatility of spot and futures", "The contract expiry date only", "The number of contracts only"], correctIndex: 1, explanation: "h* = ρ × (σS/σF) combines the correlation between price changes and relative volatilities." },
            { id: "od-w3q5", question: "Cross-hedging is used when:", options: ["A perfect futures match exists", "No futures exist for the exact asset", "Only for currencies", "Hedging is not needed"], correctIndex: 1, explanation: "Cross-hedging uses futures on a correlated asset when a direct futures contract isn't available." },
            { id: "od-w3q6", question: "To hedge a stock portfolio using index futures, you need the portfolio's:", options: ["Dividend yield", "Beta", "Book value", "Market cap only"], correctIndex: 1, explanation: "The number of index futures contracts needed equals β × (Portfolio Value / Futures Value)." },
          ],
        },
      ],
    },
    {
      id: "od-week-4",
      weekNumber: 4,
      title: "Interest Rates",
      lessons: [
        {
          id: "od-w4-l1",
          title: "Types of Rates & Bond Pricing",
          explanation:
            "Key interest rate types include Treasury rates (risk-free), LIBOR/SOFR (interbank rates), and repo rates. Compounding frequency matters: the same annual rate yields more with more frequent compounding. A zero-coupon rate (spot rate) is the rate earned on an investment with a single payoff at maturity. Bond prices equal the present value of all future cash flows discounted at appropriate zero rates.",
          questions: [
            { id: "od-w4q1", question: "Which rate is considered risk-free?", options: ["LIBOR", "Corporate bond rate", "Treasury rate", "Repo rate"], correctIndex: 2, explanation: "Treasury rates are considered risk-free because they're backed by the government." },
            { id: "od-w4q2", question: "More frequent compounding leads to:", options: ["Lower effective return", "Higher effective return", "No change", "Lower nominal rate"], correctIndex: 1, explanation: "With more compounding periods, interest earns interest more often, increasing the effective annual rate." },
            { id: "od-w4q3", question: "A bond price equals:", options: ["Its face value", "PV of future cash flows at zero rates", "The sum of coupon payments", "The market cap"], correctIndex: 1, explanation: "Bond pricing uses the present value of all cash flows, each discounted at the appropriate spot rate." },
          ],
        },
        {
          id: "od-w4-l2",
          title: "Duration, Convexity & Forward Rates",
          explanation:
            "Duration measures a bond's sensitivity to interest rate changes — it's the weighted average time of cash flows. Modified duration approximates the percentage price change for a 1% rate change. Convexity captures the curvature in the price-yield relationship that duration misses. Forward rates are future interest rates implied by today's spot rates and can be locked in using forward rate agreements (FRAs).",
          questions: [
            { id: "od-w4q4", question: "Duration measures:", options: ["Credit risk", "Sensitivity to interest rate changes", "Liquidity risk", "Default probability"], correctIndex: 1, explanation: "Duration quantifies how much a bond's price changes when interest rates move." },
            { id: "od-w4q5", question: "Convexity is important because:", options: ["Duration is always exact", "It captures curvature duration misses", "It replaces duration", "It measures default risk"], correctIndex: 1, explanation: "Duration gives a linear approximation; convexity accounts for the non-linear relationship between price and yield." },
            { id: "od-w4q6", question: "A forward rate agreement (FRA) locks in:", options: ["A spot rate today", "A future interest rate", "A stock price", "A dividend payment"], correctIndex: 1, explanation: "FRAs allow parties to fix an interest rate for a future period, hedging against rate movements." },
          ],
        },
      ],
    },
    {
      id: "od-week-5",
      weekNumber: 5,
      title: "Determination of Forward & Futures Prices",
      lessons: [
        {
          id: "od-w5-l1",
          title: "Cost of Carry & Pricing Formulas",
          explanation:
            "For investment assets, the forward price F₀ = S₀ × e^(rT) where S₀ is the spot price, r is the risk-free rate, and T is time to maturity. If the asset provides known income (like dividends), F₀ = (S₀ - I) × e^(rT). For assets with a known yield q, F₀ = S₀ × e^((r-q)T). The cost of carry includes storage costs, financing costs, minus any income earned.",
          questions: [
            { id: "od-w5q1", question: "For a non-dividend stock, the forward price formula is:", options: ["F = S₀/e^(rT)", "F = S₀ × e^(rT)", "F = S₀ + r", "F = S₀ - rT"], correctIndex: 1, explanation: "The forward price equals the spot price grown at the risk-free rate: F₀ = S₀ × e^(rT)." },
            { id: "od-w5q2", question: "Known income from the asset:", options: ["Increases the forward price", "Decreases the forward price", "Has no effect", "Doubles the spot price"], correctIndex: 1, explanation: "Known income (like dividends) reduces the forward price since the holder receives income during the holding period." },
            { id: "od-w5q3", question: "Cost of carry includes:", options: ["Only the asset price", "Storage, financing costs minus income", "Only dividends", "Only interest"], correctIndex: 1, explanation: "Cost of carry = storage costs + financing costs − income earned on the asset." },
          ],
        },
        {
          id: "od-w5-l2",
          title: "Futures vs Forward Prices & Consumption Assets",
          explanation:
            "When interest rates are constant, forward and futures prices are theoretically equal. When rates are stochastic and correlated with the asset, they may differ. For consumption assets (like oil), the forward price may be less than the cost-of-carry model predicts because of convenience yield — the benefit of physically holding the asset. This leads to: F₀ = S₀ × e^((r+u-y)T) where u is storage cost and y is convenience yield.",
          questions: [
            { id: "od-w5q4", question: "Convenience yield reflects:", options: ["The cost of futures trading", "Benefits of physically holding the asset", "Exchange fees", "Tax advantages"], correctIndex: 1, explanation: "Convenience yield captures the non-monetary benefits of holding the physical commodity (e.g., avoiding supply disruption)." },
            { id: "od-w5q5", question: "Forward and futures prices are equal when:", options: ["Markets are closed", "Interest rates are constant", "The asset pays dividends", "Volatility is high"], correctIndex: 1, explanation: "With constant/deterministic interest rates, the daily settlement of futures doesn't create a difference from forwards." },
            { id: "od-w5q6", question: "For consumption assets, futures prices may be lower than cost-of-carry because of:", options: ["High demand", "Convenience yield", "Low supply", "Regulation"], correctIndex: 1, explanation: "Convenience yield creates a benefit to holding the physical asset that's not available to futures holders." },
          ],
        },
      ],
    },
    {
      id: "od-week-6",
      weekNumber: 6,
      title: "Interest Rate Futures",
      lessons: [
        {
          id: "od-w6-l1",
          title: "Treasury Bond & Eurodollar Futures",
          explanation:
            "Treasury bond futures require delivery of a government bond with at least 15 years to maturity. The conversion factor adjusts for coupon differences between deliverable bonds. The cheapest-to-deliver (CTD) bond minimizes the cost to the short position. Eurodollar futures are based on 3-month LIBOR/SOFR rates and are widely used for hedging short-term interest rate exposure.",
          questions: [
            { id: "od-w6q1", question: "The cheapest-to-deliver bond:", options: ["Has the highest coupon", "Minimizes cost to the short position", "Is always a zero-coupon bond", "Is the most expensive"], correctIndex: 1, explanation: "The CTD bond maximizes (Quoted futures price × Conversion factor − Quoted bond price) for the short." },
            { id: "od-w6q2", question: "Eurodollar futures are based on:", options: ["Euro exchange rate", "3-month interbank rates", "10-year Treasury yield", "Commodity prices"], correctIndex: 1, explanation: "Eurodollar futures settle based on 3-month LIBOR/SOFR, reflecting short-term interbank borrowing rates." },
            { id: "od-w6q3", question: "The conversion factor adjusts for:", options: ["Currency differences", "Coupon and maturity differences among deliverable bonds", "Market volatility", "Default risk"], correctIndex: 1, explanation: "Since many bonds are deliverable, the conversion factor normalizes their values relative to the futures contract." },
          ],
        },
      ],
    },
    {
      id: "od-week-7",
      weekNumber: 7,
      title: "Swaps",
      lessons: [
        {
          id: "od-w7-l1",
          title: "Interest Rate Swaps",
          explanation:
            "In a plain vanilla interest rate swap, one party pays fixed and receives floating (typically LIBOR/SOFR), while the counterparty does the opposite. The notional principal is not exchanged. Swaps can be valued as a portfolio of forward rate agreements (FRAs) or as the difference between a fixed-rate bond and a floating-rate bond. The swap rate is the fixed rate that makes the swap's initial value zero.",
          questions: [
            { id: "od-w7q1", question: "In a plain vanilla swap, the notional principal is:", options: ["Exchanged at inception", "Exchanged at maturity", "Never exchanged", "Exchanged monthly"], correctIndex: 2, explanation: "The notional principal is only used to calculate interest payments — it's never physically exchanged." },
            { id: "od-w7q2", question: "A swap can be valued as:", options: ["A single bond", "A portfolio of FRAs", "A stock option", "A futures contract"], correctIndex: 1, explanation: "Each payment in a swap corresponds to a forward rate agreement, so a swap equals a portfolio of FRAs." },
            { id: "od-w7q3", question: "The swap rate makes the initial swap value:", options: ["Positive for fixed payer", "Negative for both", "Zero", "Equal to notional"], correctIndex: 2, explanation: "The swap rate is set so neither party has an advantage at inception — the swap starts with zero value." },
          ],
        },
        {
          id: "od-w7-l2",
          title: "Currency Swaps & Comparative Advantage",
          explanation:
            "A currency swap involves exchanging principal and interest payments in different currencies. Unlike interest rate swaps, the notional principals in both currencies are exchanged at start and end. The comparative advantage argument suggests that credit quality differences in borrowing costs across currencies create opportunities for mutually beneficial swaps. Financial intermediaries facilitate most swap transactions.",
          questions: [
            { id: "od-w7q4", question: "In a currency swap, the principal is:", options: ["Never exchanged", "Exchanged at start and end", "Only exchanged at start", "Netted each period"], correctIndex: 1, explanation: "Unlike interest rate swaps, currency swaps involve actual exchange of principal amounts in two currencies." },
            { id: "od-w7q5", question: "Comparative advantage in swaps arises from:", options: ["Equal borrowing costs", "Differences in credit-quality spreads across markets", "Government regulation", "Tax evasion"], correctIndex: 1, explanation: "When the credit spread differs between fixed and floating markets, both parties can benefit from swapping." },
            { id: "od-w7q6", question: "Most swaps are arranged through:", options: ["Direct negotiation", "Stock exchanges", "Financial intermediaries", "Central banks"], correctIndex: 2, explanation: "Banks and financial intermediaries act as dealers, warehousing swap risk and matching counterparties." },
          ],
        },
      ],
    },
    {
      id: "od-week-8",
      weekNumber: 8,
      title: "Securitization & the Credit Crisis of 2007",
      lessons: [
        {
          id: "od-w8-l1",
          title: "Securitization & CDOs",
          explanation:
            "Securitization pools assets (like mortgages) and sells tranches with different risk levels. Senior tranches get paid first and have the lowest risk; equity/junior tranches absorb losses first but offer higher returns. Collateralized Debt Obligations (CDOs) repackage these risks. The 2007 crisis was fueled by subprime lending, excessive securitization, poor credit ratings, and lack of transparency in the originate-to-distribute model.",
          questions: [
            { id: "od-w8q1", question: "In securitization, the equity tranche:", options: ["Has the lowest risk", "Absorbs losses first", "Gets paid first", "Has a AAA rating"], correctIndex: 1, explanation: "The equity tranche is first to absorb losses, bearing the highest risk in exchange for higher potential returns." },
            { id: "od-w8q2", question: "The originate-to-distribute model:", options: ["Keeps loans on the originator's books", "Sells loans to investors after origination", "Only applies to government bonds", "Eliminates all risk"], correctIndex: 1, explanation: "Banks originated mortgages and quickly sold them to investors via securitization, reducing incentive for careful lending." },
            { id: "od-w8q3", question: "CDOs contributed to the crisis because:", options: ["They were too simple", "They obscured the true risk of underlying assets", "They only held government bonds", "They were heavily regulated"], correctIndex: 1, explanation: "CDOs repackaged risk in complex ways that made it difficult for investors and rating agencies to assess true exposure." },
          ],
        },
      ],
    },
    {
      id: "od-week-9",
      weekNumber: 9,
      title: "OIS Discounting, Credit Issues & Funding Costs",
      lessons: [
        {
          id: "od-w9-l1",
          title: "OIS Discounting & CVA/DVA",
          explanation:
            "After the 2007 crisis, OIS (Overnight Index Swap) rates replaced LIBOR as the standard discount rate for collateralized derivatives. Credit Valuation Adjustment (CVA) accounts for counterparty default risk. Debit Valuation Adjustment (DVA) reflects the possibility that you yourself might default. Funding Valuation Adjustment (FVA) accounts for the cost of funding uncollateralized positions.",
          questions: [
            { id: "od-w9q1", question: "OIS rates replaced LIBOR for discounting because:", options: ["They are higher", "They better reflect the risk-free rate for collateralized trades", "They are simpler to calculate", "They are set by governments"], correctIndex: 1, explanation: "OIS rates are closer to risk-free for collateralized derivatives, as LIBOR embedded bank credit risk." },
            { id: "od-w9q2", question: "CVA adjusts for:", options: ["Funding costs", "Counterparty default risk", "Market volatility", "Tax implications"], correctIndex: 1, explanation: "CVA is the expected loss due to the possibility that the counterparty defaults when the derivative has positive value." },
            { id: "od-w9q3", question: "FVA accounts for:", options: ["Foreign exchange risk", "The cost of funding uncollateralized positions", "Future interest rates", "Counterparty credit quality"], correctIndex: 1, explanation: "FVA reflects the cost or benefit of funding when a derivative position is not collateralized." },
          ],
        },
      ],
    },
    {
      id: "od-week-10",
      weekNumber: 10,
      title: "Mechanics of Options Markets",
      lessons: [
        {
          id: "od-w10-l1",
          title: "Option Types, Positions & Specifications",
          explanation:
            "Call options give the right to buy; put options give the right to sell. Being long a call means you bought it (bullish view); being short (writing) a call means you sold it and have an obligation. American options can be exercised any time before expiration; European options only at expiration. Options have standardized strike prices, expirations, and contract sizes on exchanges. LEAPS are long-term options with expirations up to 3 years.",
          questions: [
            { id: "od-w10q1", question: "An American option differs from European in that:", options: ["It can only be exercised at expiry", "It can be exercised any time before expiry", "It's only traded in America", "It has no premium"], correctIndex: 1, explanation: "American options offer early exercise flexibility, while European options can only be exercised at maturity." },
            { id: "od-w10q2", question: "Writing a call option means:", options: ["Buying the right to purchase", "Selling the obligation to deliver if exercised", "Buying a put option", "Exercising immediately"], correctIndex: 1, explanation: "The writer (seller) of a call takes on the obligation to sell the underlying if the buyer exercises." },
            { id: "od-w10q3", question: "LEAPS are:", options: ["Short-term futures", "Long-term options (up to 3 years)", "A type of swap", "Government bonds"], correctIndex: 1, explanation: "LEAPS (Long-term Equity AnticiPation Securities) are options with extended expiration dates, up to 3 years." },
          ],
        },
      ],
    },
    {
      id: "od-week-11",
      weekNumber: 11,
      title: "Properties of Stock Options",
      lessons: [
        {
          id: "od-w11-l1",
          title: "Factors Affecting Option Prices & Put-Call Parity",
          explanation:
            "Six factors affect option prices: stock price (S), strike price (K), time to expiration (T), volatility (σ), risk-free rate (r), and dividends. For European options, put-call parity states: c + Ke^(-rT) = p + S₀. This means a call plus a bond equals a put plus the stock. An American call on a non-dividend stock should never be exercised early because the time value is always positive.",
          questions: [
            { id: "od-w11q1", question: "Put-call parity for European options states:", options: ["c = p", "c + Ke^(-rT) = p + S₀", "c - p = S₀", "c × p = K"], correctIndex: 1, explanation: "Put-call parity links European call and put prices through: call + PV(strike) = put + stock price." },
            { id: "od-w11q2", question: "Higher volatility leads to:", options: ["Lower call and put prices", "Higher call and put prices", "Higher call, lower put", "No effect"], correctIndex: 1, explanation: "Higher volatility increases the chance of large moves, benefiting both calls and puts (more upside potential)." },
            { id: "od-w11q3", question: "An American call on a non-dividend stock should:", options: ["Always be exercised early", "Never be exercised early", "Be exercised at mid-life", "Depend on strike price only"], correctIndex: 1, explanation: "Early exercise sacrifices time value; it's always better to sell the call than exercise it early (no dividends)." },
          ],
        },
      ],
    },
    {
      id: "od-week-12",
      weekNumber: 12,
      title: "Trading Strategies Involving Options",
      lessons: [
        {
          id: "od-w12-l1",
          title: "Spreads & Combinations",
          explanation:
            "A bull spread buys a call at K₁ and sells a call at K₂ (K₂ > K₁), profiting from moderate price increases with limited risk. A bear spread profits from price declines. A butterfly spread combines options at three strikes to profit from low volatility. A straddle (buy call + put at same strike) profits from large moves in either direction. A strangle uses different strikes and is cheaper but needs larger moves.",
          questions: [
            { id: "od-w12q1", question: "A bull spread profits from:", options: ["Large price declines", "Moderate price increases", "No price movement", "High volatility"], correctIndex: 1, explanation: "A bull spread uses calls (or puts) to create a position that profits from moderate upward price movement." },
            { id: "od-w12q2", question: "A straddle is profitable when:", options: ["The stock stays flat", "The stock moves significantly in either direction", "Interest rates rise", "Dividends increase"], correctIndex: 1, explanation: "A straddle (long call + long put, same strike) profits when the stock makes a big move up or down." },
            { id: "od-w12q3", question: "A butterfly spread profits from:", options: ["Large price movements", "Low volatility / stable prices", "High interest rates", "Currency fluctuations"], correctIndex: 1, explanation: "A butterfly spread earns maximum profit when the price stays near the middle strike at expiration." },
          ],
        },
      ],
    },
    {
      id: "od-week-13",
      weekNumber: 13,
      title: "Binomial Trees",
      lessons: [
        {
          id: "od-w13-l1",
          title: "One-Step & Multi-Step Binomial Models",
          explanation:
            "The binomial model prices options by constructing a tree of possible future stock prices. In each step, the price moves up by factor u or down by factor d. The risk-neutral probability p = (e^(rΔt) - d)/(u - d). Option values are calculated backward from expiry. For American options, at each node we check whether early exercise is more valuable. Multi-step trees converge to Black-Scholes as steps increase.",
          questions: [
            { id: "od-w13q1", question: "In the binomial model, the risk-neutral probability p equals:", options: ["0.5 always", "(e^(rΔt) - d)/(u - d)", "u/(u + d)", "σ√Δt"], correctIndex: 1, explanation: "The risk-neutral probability ensures the expected return on the stock equals the risk-free rate." },
            { id: "od-w13q2", question: "Option values in a binomial tree are calculated:", options: ["Forward from today", "Backward from expiry", "At random nodes", "Only at the root"], correctIndex: 1, explanation: "We start with payoffs at expiry and work backward, discounting expected values at the risk-free rate." },
            { id: "od-w13q3", question: "As the number of steps increases, binomial prices converge to:", options: ["Zero", "The Black-Scholes price", "The spot price", "The forward price"], correctIndex: 1, explanation: "The binomial model is a discrete approximation of Black-Scholes; with more steps, it converges to the continuous model." },
          ],
        },
      ],
    },
    {
      id: "od-week-14",
      weekNumber: 14,
      title: "Wiener Processes & Itô's Lemma",
      lessons: [
        {
          id: "od-w14-l1",
          title: "Stochastic Processes & Geometric Brownian Motion",
          explanation:
            "A Wiener process (Brownian motion) has independent, normally distributed increments: Δz = ε√Δt where ε ~ N(0,1). A generalized Wiener process adds drift: dx = a·dt + b·dz. Stock prices follow Geometric Brownian Motion (GBM): dS/S = μ·dt + σ·dz, meaning returns (not prices) are normally distributed. Itô's lemma shows how a function G(S,t) changes when S follows GBM, giving dG = (∂G/∂S·μS + ∂G/∂t + ½·∂²G/∂S²·σ²S²)dt + ∂G/∂S·σS·dz.",
          questions: [
            { id: "od-w14q1", question: "In GBM, what is normally distributed?", options: ["Stock prices", "Stock returns (percentage changes)", "Dividends", "Interest rates"], correctIndex: 1, explanation: "GBM models log-returns as normally distributed, meaning prices themselves are lognormally distributed." },
            { id: "od-w14q2", question: "Itô's lemma is used to:", options: ["Price bonds", "Find how a function of a stochastic variable changes", "Calculate dividends", "Measure correlation"], correctIndex: 1, explanation: "Itô's lemma is the stochastic calculus chain rule — it derives the process followed by any function of a diffusion." },
            { id: "od-w14q3", question: "A Wiener process has:", options: ["Dependent increments", "Constant increments", "Independent, normally distributed increments", "No randomness"], correctIndex: 2, explanation: "Wiener process increments Δz = ε√Δt are independent and follow N(0, Δt)." },
          ],
        },
      ],
    },
    {
      id: "od-week-15",
      weekNumber: 15,
      title: "The Black-Scholes-Merton Model",
      lessons: [
        {
          id: "od-w15-l1",
          title: "BSM Formula & Assumptions",
          explanation:
            "The Black-Scholes-Merton model prices European options assuming: stock prices follow GBM with constant volatility, no dividends (basic form), continuous trading, no transaction costs, and constant risk-free rate. The call price: c = S₀·N(d₁) - K·e^(-rT)·N(d₂), where d₁ = [ln(S₀/K) + (r + σ²/2)T]/(σ√T) and d₂ = d₁ - σ√T. N(x) is the cumulative standard normal distribution.",
          questions: [
            { id: "od-w15q1", question: "The BSM model assumes volatility is:", options: ["Time-varying", "Stochastic", "Constant", "Zero"], correctIndex: 2, explanation: "A key BSM assumption is constant volatility over the option's life — a limitation that led to models like stochastic vol." },
            { id: "od-w15q2", question: "N(d₂) in the BSM formula represents:", options: ["The stock's volatility", "The risk-neutral probability of the option finishing in-the-money", "The dividend yield", "The forward price"], correctIndex: 1, explanation: "N(d₂) is the risk-neutral probability that the option will be exercised (finish in-the-money at expiry)." },
            { id: "od-w15q3", question: "The BSM model is for:", options: ["American options only", "European options", "Futures only", "Bonds only"], correctIndex: 1, explanation: "The standard BSM formula applies to European options; American options require adjustments (like binomial trees)." },
          ],
        },
      ],
    },
    {
      id: "od-week-16",
      weekNumber: 16,
      title: "Employee Stock Options",
      lessons: [
        {
          id: "od-w16-l1",
          title: "ESO Features & Valuation",
          explanation:
            "Employee stock options (ESOs) differ from exchange-traded options: they have longer maturities (10+ years), vesting periods, cannot be sold, and are forfeited if the employee leaves. Early exercise is common due to non-transferability. Accounting standards (IFRS 2 / ASC 718) require firms to expense ESOs at grant date using fair value, typically estimated via modified Black-Scholes or binomial models with expected life instead of actual maturity.",
          questions: [
            { id: "od-w16q1", question: "ESOs differ from exchange-traded options because:", options: ["They have shorter maturities", "They cannot be sold and have vesting periods", "They trade on exchanges", "They have no exercise price"], correctIndex: 1, explanation: "ESOs are non-transferable, have vesting requirements, and are forfeited upon early departure." },
            { id: "od-w16q2", question: "Accounting standards require ESOs to be:", options: ["Ignored in financial statements", "Expensed at fair value at grant date", "Only disclosed in footnotes", "Valued at intrinsic value only"], correctIndex: 1, explanation: "IFRS 2 and ASC 718 require fair value measurement at grant date, recognized as an expense over the vesting period." },
            { id: "od-w16q3", question: "Early exercise of ESOs is common because:", options: ["They are American options", "They cannot be sold, so employees exercise to realize value", "The strike price changes", "Employers force exercise"], correctIndex: 1, explanation: "Since ESOs can't be sold, employees exercise early to convert them to cash, sacrificing remaining time value." },
          ],
        },
      ],
    },
    {
      id: "od-week-17",
      weekNumber: 17,
      title: "Options on Stock Indices & Currencies",
      lessons: [
        {
          id: "od-w17-l1",
          title: "Index Options & Currency Options",
          explanation:
            "Index options settle in cash (no delivery of stocks). Portfolio insurance uses index put options to limit downside: buy puts on the index to protect against market declines. For currency options, the foreign risk-free rate replaces the dividend yield: c = S₀·e^(-rfT)·N(d₁) - K·e^(-rT)·N(d₂). Range forwards combine a long put and short call (or vice versa) to create a range of acceptable exchange rates at zero net cost.",
          questions: [
            { id: "od-w17q1", question: "Index options settle in:", options: ["Physical shares", "Cash", "Bonds", "Futures"], correctIndex: 1, explanation: "Index options are cash-settled — the holder receives the difference between the index level and strike in cash." },
            { id: "od-w17q2", question: "In currency option pricing, the foreign risk-free rate acts as:", options: ["The domestic rate", "A dividend yield", "Volatility", "The strike price"], correctIndex: 1, explanation: "The foreign risk-free rate functions like a continuous dividend yield in the Garman-Kohlhagen model." },
            { id: "od-w17q3", question: "Portfolio insurance typically uses:", options: ["Index call options", "Index put options", "Currency forwards", "Interest rate swaps"], correctIndex: 1, explanation: "Buying index puts protects a portfolio against market declines while preserving upside potential." },
          ],
        },
      ],
    },
    {
      id: "od-week-18",
      weekNumber: 18,
      title: "Futures Options",
      lessons: [
        {
          id: "od-w18-l1",
          title: "Options on Futures & Black's Model",
          explanation:
            "A futures call option gives the right to enter a long futures position at the strike price. When exercised, the holder gets a futures position plus cash equal to the difference between the current futures price and the strike. Black's model prices European futures options: c = e^(-rT)[F₀·N(d₁) - K·N(d₂)] where F₀ is the current futures price. This is popular because it avoids needing to model the spot price process directly.",
          questions: [
            { id: "od-w18q1", question: "Exercising a futures call option gives you:", options: ["The underlying commodity", "A long futures position and cash", "A short futures position", "Only cash"], correctIndex: 1, explanation: "Exercise delivers a long futures position at the strike plus cash equal to (current futures price − strike)." },
            { id: "od-w18q2", question: "Black's model uses which price as input?", options: ["Spot price", "Forward/futures price", "Strike price only", "Historical average price"], correctIndex: 1, explanation: "Black's model replaces the spot price with the futures price, simplifying the pricing of futures options." },
            { id: "od-w18q3", question: "Black's model is popular because:", options: ["It requires no assumptions", "It avoids modeling the spot price directly", "It works for American options", "It ignores volatility"], correctIndex: 1, explanation: "By using the futures price, Black's model bypasses the need to model storage costs, dividends, or convenience yield." },
          ],
        },
      ],
    },
    {
      id: "od-week-19",
      weekNumber: 19,
      title: "The Greek Letters",
      lessons: [
        {
          id: "od-w19-l1",
          title: "Delta, Gamma, Theta, Vega & Rho",
          explanation:
            "The Greeks measure option sensitivity: Delta (Δ) = ∂C/∂S (price sensitivity to stock), Gamma (Γ) = ∂²C/∂S² (rate of delta change), Theta (Θ) = ∂C/∂t (time decay), Vega (ν) = ∂C/∂σ (sensitivity to volatility), Rho (ρ) = ∂C/∂r (sensitivity to interest rates). Delta hedging involves adjusting a position's stock holdings to make delta zero. Gamma measures the hedging error from infrequent rebalancing.",
          questions: [
            { id: "od-w19q1", question: "Delta measures:", options: ["Time decay", "Sensitivity of option price to stock price", "Sensitivity to volatility", "Interest rate risk"], correctIndex: 1, explanation: "Delta (∂C/∂S) shows how much the option price changes for a $1 change in the underlying stock." },
            { id: "od-w19q2", question: "Gamma is important because:", options: ["It measures time decay", "It shows how quickly delta changes, affecting hedge accuracy", "It measures dividend risk", "It's always constant"], correctIndex: 1, explanation: "High gamma means delta changes rapidly, requiring more frequent rebalancing to maintain a delta-neutral hedge." },
            { id: "od-w19q3", question: "Theta is typically negative for long options because:", options: ["Stock prices fall over time", "Options lose time value as expiration approaches", "Interest rates decrease", "Volatility decreases"], correctIndex: 1, explanation: "As time passes, the probability of favorable price moves decreases, eroding the option's time value." },
          ],
        },
      ],
    },
    {
      id: "od-week-20",
      weekNumber: 20,
      title: "Volatility Smiles",
      lessons: [
        {
          id: "od-w20-l1",
          title: "Implied Volatility Patterns",
          explanation:
            "The volatility smile shows that implied volatility varies with strike price, contradicting BSM's constant volatility assumption. For equity options, a 'volatility skew' shows higher implied vol for lower strikes (crash protection). For currency options, a symmetric smile appears. The smile reflects fat tails and negative skewness in actual return distributions. Practitioners use the smile to quote and manage risk, not just BSM.",
          questions: [
            { id: "od-w20q1", question: "The volatility smile contradicts BSM's assumption of:", options: ["No arbitrage", "Constant volatility", "Risk-neutral pricing", "Continuous trading"], correctIndex: 1, explanation: "BSM assumes constant implied volatility across strikes, but market prices show it varies — creating the smile." },
            { id: "od-w20q2", question: "Equity options typically show:", options: ["A symmetric smile", "A volatility skew (higher vol at lower strikes)", "Flat implied volatility", "Higher vol at higher strikes"], correctIndex: 1, explanation: "The skew reflects demand for downside protection (puts) and the observed negative skewness of equity returns." },
            { id: "od-w20q3", question: "The smile reflects:", options: ["BSM model accuracy", "Fat tails in actual return distributions", "Perfect lognormality", "Zero transaction costs"], correctIndex: 1, explanation: "Real-world returns have fatter tails and more extreme events than the lognormal distribution assumed by BSM." },
          ],
        },
      ],
    },
    {
      id: "od-week-21",
      weekNumber: 21,
      title: "Basic Numerical Procedures",
      lessons: [
        {
          id: "od-w21-l1",
          title: "Trees, Monte Carlo & Finite Differences",
          explanation:
            "When analytical solutions don't exist, numerical methods are used. Binomial/trinomial trees discretize price movements and work well for American options. Monte Carlo simulation generates many random price paths and averages the discounted payoffs — excellent for path-dependent and high-dimensional problems. Finite difference methods solve the BSM PDE on a grid — efficient for low-dimensional American options.",
          questions: [
            { id: "od-w21q1", question: "Monte Carlo simulation is best for:", options: ["Simple European options", "Path-dependent and high-dimensional problems", "Only American options", "Bond pricing only"], correctIndex: 1, explanation: "Monte Carlo excels when there are many underlying variables or path-dependent payoffs (like Asian or barrier options)." },
            { id: "od-w21q2", question: "Binomial trees are particularly useful for:", options: ["Path-dependent options only", "American options with early exercise", "Only European options", "Interest rate models only"], correctIndex: 1, explanation: "Trees allow checking early exercise at each node, making them ideal for pricing American options." },
            { id: "od-w21q3", question: "Finite difference methods solve:", options: ["Integral equations", "The BSM partial differential equation on a grid", "Only forward contracts", "Algebraic equations"], correctIndex: 1, explanation: "FDM discretizes the BSM PDE in time and stock price dimensions, solving it numerically on a grid." },
          ],
        },
      ],
    },
    {
      id: "od-week-22",
      weekNumber: 22,
      title: "Value at Risk",
      lessons: [
        {
          id: "od-w22-l1",
          title: "VaR Measures & Approaches",
          explanation:
            "Value at Risk (VaR) estimates the maximum loss over a given time horizon at a specified confidence level. For example, 'the 1-day 99% VaR is $10M' means there's a 1% chance of losing more than $10M in a day. Methods include: historical simulation (uses actual past returns), model-building/variance-covariance (assumes normal distribution), and Monte Carlo simulation. Expected Shortfall (ES/CVaR) measures the expected loss given that VaR is exceeded.",
          questions: [
            { id: "od-w22q1", question: "A 99% 1-day VaR of $5M means:", options: ["Expected profit is $5M", "1% chance of losing more than $5M in one day", "Maximum possible loss is $5M", "5% chance of any loss"], correctIndex: 1, explanation: "VaR states the loss level that will be exceeded only X% of the time over the specified horizon." },
            { id: "od-w22q2", question: "Expected Shortfall measures:", options: ["The most likely loss", "The expected loss given VaR is exceeded", "The minimum loss", "The median loss"], correctIndex: 1, explanation: "ES (CVaR) answers: 'If we're in the worst X% of scenarios, what's our average loss?'" },
            { id: "od-w22q3", question: "Historical simulation VaR:", options: ["Assumes normality", "Uses actual past returns without distributional assumptions", "Requires a covariance matrix", "Only works for stocks"], correctIndex: 1, explanation: "Historical simulation re-values the portfolio using actual past market moves, making no distributional assumptions." },
          ],
        },
      ],
    },
    {
      id: "od-week-23",
      weekNumber: 23,
      title: "Estimating Volatilities & Correlations",
      lessons: [
        {
          id: "od-w23-l1",
          title: "EWMA & GARCH Models",
          explanation:
            "Volatility estimation methods include: equally weighted historical variance (all past observations weighted equally), EWMA (Exponentially Weighted Moving Average) which gives more weight to recent observations with decay factor λ (typically 0.94), and GARCH(1,1) which models volatility as mean-reverting: σ²ₙ = ω + α·u²ₙ₋₁ + β·σ²ₙ₋₁. GARCH captures volatility clustering and mean reversion. Maximum likelihood estimation fits these models to data.",
          questions: [
            { id: "od-w23q1", question: "EWMA gives more weight to:", options: ["Older observations", "Recent observations", "All observations equally", "Random observations"], correctIndex: 1, explanation: "EWMA uses a decay factor λ < 1, so weights decrease exponentially for older observations." },
            { id: "od-w23q2", question: "GARCH models capture:", options: ["Only trend", "Volatility clustering and mean reversion", "Only seasonal patterns", "Constant volatility"], correctIndex: 1, explanation: "GARCH models the tendency for high/low volatility to persist (clustering) while reverting to a long-run average." },
            { id: "od-w23q3", question: "In EWMA, the typical decay factor λ is:", options: ["0.50", "0.94", "0.99", "0.10"], correctIndex: 1, explanation: "RiskMetrics popularized λ = 0.94 for daily data, providing a good balance between responsiveness and stability." },
          ],
        },
      ],
    },
    {
      id: "od-week-24",
      weekNumber: 24,
      title: "Credit Risk",
      lessons: [
        {
          id: "od-w24-l1",
          title: "Credit Ratings, Default Probabilities & Credit Spreads",
          explanation:
            "Credit risk is the risk of loss due to a borrower's failure to pay. Rating agencies (S&P, Moody's, Fitch) assign ratings. Default probabilities can be estimated from historical data or from bond credit spreads: the spread over risk-free rate reflects the market's assessment of default risk. The Merton model treats equity as a call option on the firm's assets, with default occurring when asset value falls below debt. Recovery rates indicate how much creditors receive in default.",
          questions: [
            { id: "od-w24q1", question: "In the Merton model, equity is modeled as:", options: ["A put option on debt", "A call option on the firm's assets", "A forward contract", "A swap"], correctIndex: 1, explanation: "Merton's insight: shareholders have a call option on firm assets with strike = debt face value; default = assets < debt." },
            { id: "od-w24q2", question: "Credit spreads reflect:", options: ["Liquidity only", "The market's assessment of default risk", "Only interest rate risk", "Exchange rate risk"], correctIndex: 1, explanation: "The spread over risk-free rates compensates investors for bearing credit (default) risk." },
            { id: "od-w24q3", question: "The recovery rate is:", options: ["The return on equity", "The fraction creditors receive in default", "The coupon rate", "The risk-free rate"], correctIndex: 1, explanation: "Recovery rate indicates how many cents on the dollar creditors can expect to receive when a borrower defaults." },
          ],
        },
      ],
    },
    {
      id: "od-week-25",
      weekNumber: 25,
      title: "Credit Derivatives",
      lessons: [
        {
          id: "od-w25-l1",
          title: "CDS, CDOs & Credit Indices",
          explanation:
            "A Credit Default Swap (CDS) provides insurance against default: the protection buyer pays a periodic premium (spread) and receives a payoff if the reference entity defaults. CDS spreads are a market measure of credit risk. Credit indices (like CDX and iTraxx) are portfolios of CDS on multiple names. Synthetic CDOs use CDS to create tranched credit exposure without owning the underlying bonds.",
          questions: [
            { id: "od-w25q1", question: "A CDS protection buyer:", options: ["Receives periodic premiums", "Pays periodic premiums and receives payoff on default", "Sells insurance", "Owns the reference bond"], correctIndex: 1, explanation: "The protection buyer pays a spread (like insurance premium) and receives compensation if the reference entity defaults." },
            { id: "od-w25q2", question: "CDS spreads are a measure of:", options: ["Liquidity risk", "Market credit risk assessment", "Interest rate risk", "Currency risk"], correctIndex: 1, explanation: "CDS spreads directly reflect the market's real-time pricing of default risk for a given entity." },
            { id: "od-w25q3", question: "Synthetic CDOs use:", options: ["Physical bonds only", "CDS to create tranched credit exposure", "Equity options", "Currency forwards"], correctIndex: 1, explanation: "Synthetic CDOs sell CDS protection to gain credit exposure without actually purchasing the underlying bonds." },
          ],
        },
      ],
    },
    {
      id: "od-week-26",
      weekNumber: 26,
      title: "Exotic Options",
      lessons: [
        {
          id: "od-w26-l1",
          title: "Barrier, Asian, Lookback & Compound Options",
          explanation:
            "Exotic options have non-standard features. Barrier options activate (knock-in) or deactivate (knock-out) when the price hits a barrier level. Asian options have payoffs based on the average price over a period. Lookback options pay based on the maximum or minimum price during the option's life. Compound options are options on options. Binary/digital options pay a fixed amount if in-the-money at expiry.",
          questions: [
            { id: "od-w26q1", question: "A knock-out barrier option:", options: ["Activates when hitting the barrier", "Ceases to exist when hitting the barrier", "Has no barrier", "Is always in-the-money"], correctIndex: 1, explanation: "A knock-out option terminates (becomes worthless) if the underlying price reaches the barrier level." },
            { id: "od-w26q2", question: "Asian option payoffs are based on:", options: ["The price at expiry only", "The average price over a period", "The maximum price", "The minimum price"], correctIndex: 1, explanation: "Asian options use the average underlying price, reducing the impact of manipulation and volatility near expiry." },
            { id: "od-w26q3", question: "A binary/digital option pays:", options: ["A variable amount based on how deep in-the-money", "A fixed amount if in-the-money at expiry", "Nothing ever", "The stock price"], correctIndex: 1, explanation: "Binary options have an all-or-nothing payoff — a fixed amount if the condition is met, zero otherwise." },
          ],
        },
      ],
    },
    {
      id: "od-week-27",
      weekNumber: 27,
      title: "More on Models & Numerical Procedures",
      lessons: [
        {
          id: "od-w27-l1",
          title: "Stochastic Volatility & Jump-Diffusion Models",
          explanation:
            "To address BSM's limitations, advanced models include: stochastic volatility models (like Heston) where volatility itself follows a random process, local volatility models where volatility is a deterministic function of stock price and time, and jump-diffusion models (like Merton's jump model) where the stock can experience sudden jumps. These models better capture the volatility smile and fat tails observed in market data.",
          questions: [
            { id: "od-w27q1", question: "The Heston model assumes volatility is:", options: ["Constant", "Stochastic (random)", "Always increasing", "Zero"], correctIndex: 1, explanation: "In Heston's model, volatility follows its own mean-reverting stochastic process, generating realistic smiles." },
            { id: "od-w27q2", question: "Jump-diffusion models add:", options: ["Continuous volatility only", "Sudden discontinuous jumps in price", "Constant drift", "Deterministic paths"], correctIndex: 1, explanation: "Jump-diffusion combines continuous GBM with Poisson-distributed jumps to capture sudden large price moves." },
            { id: "od-w27q3", question: "Local volatility models make volatility a function of:", options: ["Time only", "Stock price and time", "Interest rates", "Other stocks"], correctIndex: 1, explanation: "Local volatility σ(S,t) is calibrated to match all observed option prices, making it deterministic given S and t." },
          ],
        },
      ],
    },
    {
      id: "od-week-28",
      weekNumber: 28,
      title: "Martingales & Measures",
      lessons: [
        {
          id: "od-w28-l1",
          title: "Risk-Neutral Pricing & Change of Numéraire",
          explanation:
            "A martingale is a stochastic process with no drift (expected future value equals current value). In the risk-neutral world, all traded assets have expected return equal to the risk-free rate. The equivalent martingale measure makes discounted asset prices martingales. Change of numéraire technique switches the unit of measurement (e.g., from cash to a bond), simplifying pricing. This is the theoretical foundation for pricing all derivatives.",
          questions: [
            { id: "od-w28q1", question: "A martingale has:", options: ["Positive drift", "No drift (expected future = current value)", "Negative drift", "Constant value"], correctIndex: 1, explanation: "A martingale's expected future value equals its current value — no systematic tendency to increase or decrease." },
            { id: "od-w28q2", question: "In the risk-neutral world:", options: ["All assets earn their real-world return", "All assets earn the risk-free rate in expectation", "Risk premiums are maximized", "Volatility is zero"], correctIndex: 1, explanation: "Risk-neutral pricing sets expected returns to the risk-free rate, simplifying derivative valuation." },
            { id: "od-w28q3", question: "Change of numéraire:", options: ["Changes the currency", "Switches the unit of measurement to simplify pricing", "Eliminates risk", "Is never used in practice"], correctIndex: 1, explanation: "Changing numéraire (e.g., measuring in units of a bond) can make pricing formulas simpler and more elegant." },
          ],
        },
      ],
    },
    {
      id: "od-week-29",
      weekNumber: 29,
      title: "Interest Rate Derivatives: Standard Market Models",
      lessons: [
        {
          id: "od-w29-l1",
          title: "Caps, Floors & Swaptions",
          explanation:
            "Bond options give the right to buy/sell bonds at a set price. Interest rate caps set a maximum rate on floating-rate debt (each caplet is a call on the interest rate). Floors set a minimum rate. Swaptions give the right to enter a swap — a payer swaption lets you pay fixed (bet on rising rates), a receiver swaption lets you receive fixed. Black's model is used to price caps, floors, and European swaptions.",
          questions: [
            { id: "od-w29q1", question: "An interest rate cap provides:", options: ["A minimum interest rate", "A maximum interest rate on floating debt", "A fixed-to-floating swap", "A credit guarantee"], correctIndex: 1, explanation: "A cap protects floating-rate borrowers by capping the maximum rate they pay — each caplet is like a call on rates." },
            { id: "od-w29q2", question: "A payer swaption gives the right to:", options: ["Receive fixed in a swap", "Pay fixed in a swap", "Cancel a swap", "Buy a bond"], correctIndex: 1, explanation: "A payer swaption benefits when rates rise, as the holder can lock in paying a lower fixed rate." },
            { id: "od-w29q3", question: "Caps, floors, and swaptions are typically priced using:", options: ["The binomial model", "Black's model", "The CAPM", "The Gordon growth model"], correctIndex: 1, explanation: "Black's model (adapted from Black-Scholes for futures) is the market standard for pricing these interest rate derivatives." },
          ],
        },
      ],
    },
    {
      id: "od-week-30",
      weekNumber: 30,
      title: "Convexity, Timing & Quanto Adjustments",
      lessons: [
        {
          id: "od-w30-l1",
          title: "Adjustments for Non-Standard Payoffs",
          explanation:
            "Convexity adjustments are needed when the payoff is a non-linear function of an interest rate. For example, pricing a derivative that pays LIBOR² requires a convexity adjustment because E[R²] ≠ (E[R])². Timing adjustments account for when a rate is observed versus when it's paid. Quanto adjustments are needed for derivatives where the underlying is in one currency but the payoff is in another — they depend on the correlation between the underlying and the exchange rate.",
          questions: [
            { id: "od-w30q1", question: "A convexity adjustment is needed when:", options: ["Payoffs are linear in the rate", "Payoffs are non-linear in the rate", "Only for equity options", "Interest rates are constant"], correctIndex: 1, explanation: "Non-linear payoffs require adjustment because the expected value of a non-linear function ≠ the function of the expected value." },
            { id: "od-w30q2", question: "A quanto adjustment depends on:", options: ["Only the interest rate", "Correlation between underlying and exchange rate", "The strike price only", "The risk-free rate only"], correctIndex: 1, explanation: "Quanto adjustments account for the interaction between the underlying's value and the exchange rate movements." },
            { id: "od-w30q3", question: "Timing adjustments account for:", options: ["Credit risk", "The gap between when a rate is observed and when it's paid", "Dividend timing", "Tax payment dates"], correctIndex: 1, explanation: "When a rate is observed at one time but paid at another, the difference requires a timing adjustment." },
          ],
        },
      ],
    },
    {
      id: "od-week-31",
      weekNumber: 31,
      title: "Interest Rate Derivatives: Short Rate Models",
      lessons: [
        {
          id: "od-w31-l1",
          title: "Vasicek, CIR & Hull-White Models",
          explanation:
            "Short rate models describe the evolution of the instantaneous short rate. The Vasicek model: dr = a(b-r)dt + σdz features mean reversion but allows negative rates. The Cox-Ingersoll-Ross (CIR) model: dr = a(b-r)dt + σ√r·dz prevents negative rates. The Hull-White model: dr = [θ(t) - ar]dt + σdz fits the current term structure exactly by making θ(t) time-dependent. These models price bonds and interest rate derivatives via trees or analytical formulas.",
          questions: [
            { id: "od-w31q1", question: "The Vasicek model's main limitation is:", options: ["No mean reversion", "It allows negative interest rates", "It's too complex", "No closed-form solution"], correctIndex: 1, explanation: "With a normal distribution for rate changes, the Vasicek model can produce negative rates (problematic pre-2008)." },
            { id: "od-w31q2", question: "The Hull-White model fits the current term structure because:", options: ["It uses constant parameters", "θ(t) is time-dependent and calibrated to market data", "It ignores the yield curve", "It uses CIR dynamics"], correctIndex: 1, explanation: "The time-dependent θ(t) function allows Hull-White to match any observed initial yield curve exactly." },
            { id: "od-w31q3", question: "CIR prevents negative rates by:", options: ["Setting a floor", "Making volatility proportional to √r", "Using log rates", "Ignoring mean reversion"], correctIndex: 1, explanation: "When r approaches zero, the σ√r term shrinks volatility to zero, preventing rates from going negative." },
          ],
        },
      ],
    },
    {
      id: "od-week-32",
      weekNumber: 32,
      title: "HJM, LMM & Multiple Zero Curves",
      lessons: [
        {
          id: "od-w32-l1",
          title: "Heath-Jarrow-Morton & LIBOR Market Model",
          explanation:
            "The HJM framework models the entire forward rate curve, not just the short rate. Any no-arbitrage model can be expressed as HJM. The LIBOR Market Model (LMM/BGM) directly models forward LIBOR rates, making it natural for pricing caps and swaptions. LMM can match cap volatilities by construction. In practice, multiple zero curves (OIS, LIBOR 1M, 3M, 6M) are used simultaneously for accurate pricing and hedging.",
          questions: [
            { id: "od-w32q1", question: "The HJM framework models:", options: ["Only the short rate", "The entire forward rate curve", "Only bond prices", "Only swap rates"], correctIndex: 1, explanation: "HJM specifies the dynamics of all instantaneous forward rates simultaneously, giving a complete yield curve model." },
            { id: "od-w32q2", question: "The LIBOR Market Model directly models:", options: ["The short rate", "Forward LIBOR rates", "Bond prices", "Stock prices"], correctIndex: 1, explanation: "LMM models the forward LIBOR rates that are directly observable and used to price caps and floors." },
            { id: "od-w32q3", question: "Post-crisis pricing uses:", options: ["A single discount curve", "Multiple zero curves (OIS + different tenor LIBORs)", "No discount curve", "Only the Treasury curve"], correctIndex: 1, explanation: "Modern multi-curve pricing uses OIS for discounting and separate curves for each LIBOR tenor." },
          ],
        },
      ],
    },
    {
      id: "od-week-33",
      weekNumber: 33,
      title: "Swaps Revisited",
      lessons: [
        {
          id: "od-w33-l1",
          title: "Non-Standard Swaps",
          explanation:
            "Beyond plain vanilla, many swap variations exist. Compounding swaps pay interest on interest. Currency swaps can have different structures (fixed-fixed, fixed-floating, floating-floating). Equity swaps exchange equity returns for a fixed or floating rate. Accrual swaps pay only on days when a rate falls within a range. Cancelable swaps include early termination options. Commodity swaps exchange fixed payments for commodity price-linked payments.",
          questions: [
            { id: "od-w33q1", question: "An equity swap exchanges:", options: ["Two fixed rates", "Equity returns for a fixed or floating rate", "Two currencies", "Commodity prices"], correctIndex: 1, explanation: "Equity swaps allow one party to gain equity exposure while paying/receiving an interest rate." },
            { id: "od-w33q2", question: "A cancelable swap includes:", options: ["An option to extend", "An early termination option", "A mandatory termination date", "No optionality"], correctIndex: 1, explanation: "A cancelable swap embeds a swaption that allows one party to terminate the swap before maturity." },
            { id: "od-w33q3", question: "An accrual swap pays only on days when:", options: ["Markets are open", "A rate falls within a specified range", "The stock rises", "Dividends are paid"], correctIndex: 1, explanation: "Accrual swaps accrue interest only on days when the reference rate is within a pre-specified range." },
          ],
        },
      ],
    },
    {
      id: "od-week-34",
      weekNumber: 34,
      title: "Energy & Commodity Derivatives",
      lessons: [
        {
          id: "od-w34-l1",
          title: "Commodity Markets & Energy Derivatives",
          explanation:
            "Energy derivatives (oil, gas, electricity) have unique features. Electricity cannot be stored economically, so spot prices can spike dramatically. Natural gas and oil markets use futures curves that can be in contango (futures > spot) or backwardation (futures < spot). Commodity models often use mean-reverting processes because prices tend to revert to production costs. Weather derivatives (based on temperature) help energy companies manage demand risk.",
          questions: [
            { id: "od-w34q1", question: "Electricity prices can spike because:", options: ["Storage is cheap", "Electricity cannot be economically stored", "Demand is constant", "Supply is unlimited"], correctIndex: 1, explanation: "Unlike oil or gas, electricity must be consumed when produced — supply-demand imbalances cause extreme price spikes." },
            { id: "od-w34q2", question: "Contango in futures markets means:", options: ["Futures < spot", "Futures > spot", "Futures = spot", "No futures exist"], correctIndex: 1, explanation: "In contango, futures prices exceed the spot price, typically reflecting storage costs and financing." },
            { id: "od-w34q3", question: "Commodity prices often use mean-reverting models because:", options: ["They always increase", "Prices tend to revert to production cost levels", "They never change", "They follow GBM exactly"], correctIndex: 1, explanation: "When prices are high, production increases driving prices down; when low, production cuts push prices up — mean reversion." },
          ],
        },
      ],
    },
    {
      id: "od-week-35",
      weekNumber: 35,
      title: "Real Options",
      lessons: [
        {
          id: "od-w35-l1",
          title: "Valuing Flexibility in Investment Decisions",
          explanation:
            "Real options apply option pricing theory to business investment decisions. Types include: the option to defer (wait for more info), option to expand (scale up if successful), option to abandon (cut losses), and option to switch (change inputs/outputs). Traditional NPV undervalues projects by ignoring managerial flexibility. Risk-neutral valuation and binomial trees can be used to value these embedded options in real assets.",
          questions: [
            { id: "od-w35q1", question: "Real options differ from financial options because:", options: ["They trade on exchanges", "They represent flexibility in real business decisions", "They have no value", "They are always European"], correctIndex: 1, explanation: "Real options capture the value of managerial flexibility (defer, expand, abandon) in physical investment projects." },
            { id: "od-w35q2", question: "Traditional NPV undervalues projects because:", options: ["It uses too high a discount rate", "It ignores the value of managerial flexibility", "It overestimates cash flows", "It ignores taxes"], correctIndex: 1, explanation: "NPV assumes a fixed plan; real options capture the value of adapting decisions as uncertainty resolves." },
            { id: "od-w35q3", question: "The option to abandon is valuable when:", options: ["The project is always profitable", "The project may turn unprofitable and can be shut down", "There's no uncertainty", "Costs are zero"], correctIndex: 1, explanation: "The ability to stop a project and recover salvage value limits downside risk, adding value versus a committed investment." },
          ],
        },
      ],
    },
    {
      id: "od-week-36",
      weekNumber: 36,
      title: "Derivatives Mishaps & Lessons",
      lessons: [
        {
          id: "od-w36-l1",
          title: "Famous Derivatives Disasters",
          explanation:
            "Major derivatives losses provide important lessons. Barings Bank (1995): Nick Leeson's unauthorized speculation on Nikkei futures caused $1.3B loss and bank collapse. Orange County (1994): leveraged interest rate bets lost $1.7B. Long-Term Capital Management (1998): highly leveraged convergence trades nearly caused systemic crisis. Key lessons: set position limits, separate front and back offices, monitor risk in real-time, understand the risks of leverage, and maintain adequate liquidity.",
          questions: [
            { id: "od-w36q1", question: "Barings Bank collapsed due to:", options: ["Market-wide crash", "Unauthorized speculation by a single trader", "Government seizure", "Cyber attack"], correctIndex: 1, explanation: "Nick Leeson hid massive losses from unauthorized Nikkei futures trading, ultimately bankrupting the 233-year-old bank." },
            { id: "od-w36q2", question: "LTCM's near-collapse highlighted the danger of:", options: ["Low leverage", "Excessive leverage in convergence trades", "Too little diversification only", "Investing in bonds"], correctIndex: 1, explanation: "LTCM used extreme leverage (25:1+); when markets diverged instead of converging, losses were magnified catastrophically." },
            { id: "od-w36q3", question: "A key risk management lesson is:", options: ["Leverage is always safe", "Separate front and back office functions", "Ignore position limits", "Concentrate all bets"], correctIndex: 1, explanation: "Separating trading (front office) from settlement/risk management (back office) prevents traders from hiding losses." },
          ],
        },
      ],
    },
  ],
};
