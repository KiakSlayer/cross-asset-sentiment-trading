import type {
  BacktestSummary,
  DashboardActivity,
  ForwardTestSummary,
  HoldingRow,
  OpportunityItem,
  OpportunitySignal,
  PortfolioSnapshot,
  RelationshipHealth,
  TradeHistoryRow,
  TradeRecord,
} from "@/types/domain";

export const OPPORTUNITY_IC_THRESHOLD = 0.08;

// Legacy mock exports kept for compatibility with helper tests.
export const backtestRuns: BacktestSummary[] = [
  {
    id: "bt-001",
    strategyName: "Sector Momentum Lite",
    runStatus: "passed",
    totalReturnPct: 6.4,
    maxDrawdownPct: 3.1,
    walkForwardWindows: 7,
    startedAt: "2026-01-08T09:00:00Z",
    endedAt: "2026-01-08T09:22:00Z",
    validationStatus: "passed",
  },
  {
    id: "bt-002",
    strategyName: "Sector Momentum Lite",
    runStatus: "passed",
    totalReturnPct: 5.2,
    maxDrawdownPct: 2.8,
    walkForwardWindows: 7,
    startedAt: "2026-02-03T09:00:00Z",
    endedAt: "2026-02-03T09:18:00Z",
    validationStatus: "passed",
  },
  {
    id: "bt-003",
    strategyName: "Sector Momentum Lite",
    runStatus: "failed",
    totalReturnPct: -1.6,
    maxDrawdownPct: 5.9,
    walkForwardWindows: 7,
    startedAt: "2026-03-01T09:00:00Z",
    endedAt: "2026-03-01T09:16:00Z",
    validationStatus: "failed",
  },
];

export const forwardTestRuns: ForwardTestSummary[] = [
  {
    id: "ft-001",
    strategyName: "Sector Momentum Lite",
    runStatus: "passed",
    passStatus: "passed",
    observedReturnPct: 1.7,
    observedMaxDrawdownPct: 1.1,
    environment: "paper",
    startedAt: "2026-03-03T00:00:00Z",
    endedAt: "2026-03-08T00:00:00Z",
    decisionReason: "Performance remained within trial safety limits.",
  },
  {
    id: "ft-002",
    strategyName: "Sector Momentum Lite",
    runStatus: "running",
    passStatus: "pending",
    observedReturnPct: 0.4,
    observedMaxDrawdownPct: 0.8,
    environment: "paper",
    startedAt: "2026-03-08T00:00:00Z",
    endedAt: "2026-03-15T00:00:00Z",
    decisionReason: "Trial run is still active.",
  },
];

export const opportunitySignals: OpportunitySignal[] = [
  {
    id: "sig-001",
    assetSymbol: "XLK",
    generatedAt: "2026-03-09T06:20:00Z",
    validationStatus: "passed",
    informationCoefficient: 0.14,
    icThreshold: OPPORTUNITY_IC_THRESHOLD,
    confidenceScore: 0.82,
    confidenceAuditBasis:
      "Calibrated on walk-forward windows and rechecked in paper trial.",
    recommendationAuditBasis:
      "Recommendation linked to run bt-002 and forward run ft-001.",
    recommendationText: "Consider gradual buy exposure.",
    uncertaintyNote: "Signal can weaken if headlines reverse quickly.",
    observedEvidence: "Tech earnings sentiment improved for 3 sessions.",
    inferenceSummary: "Sector upside pressure may continue short term.",
    suppressedReason: null,
  },
  {
    id: "sig-002",
    assetSymbol: "XLE",
    generatedAt: "2026-03-09T06:30:00Z",
    validationStatus: "passed",
    informationCoefficient: 0.05,
    icThreshold: OPPORTUNITY_IC_THRESHOLD,
    confidenceScore: 0.74,
    confidenceAuditBasis: "Latest quality score is below minimum threshold.",
    recommendationAuditBasis: "Linked to run bt-002.",
    recommendationText: "Wait for stronger confirmation.",
    uncertaintyNote: "Current relation strength is weaker than minimum.",
    observedEvidence: "Energy headlines improved, but price follow-through was mixed.",
    inferenceSummary: "Potential move exists but is not yet strong.",
    suppressedReason: "Below configured quality threshold.",
  },
  {
    id: "sig-003",
    assetSymbol: "XLF",
    generatedAt: "2026-03-09T06:40:00Z",
    validationStatus: "failed",
    informationCoefficient: 0.11,
    icThreshold: OPPORTUNITY_IC_THRESHOLD,
    confidenceScore: 0.68,
    confidenceAuditBasis: "Historical quality check failed in latest segment.",
    recommendationAuditBasis: "Linked to run bt-003.",
    recommendationText: "Do not take new exposure yet.",
    uncertaintyNote: "Recent windows failed consistency checks.",
    observedEvidence: "Signal direction flipped repeatedly.",
    inferenceSummary: "Relationship is currently unstable.",
    suppressedReason: "Validation status failed.",
  },
  {
    id: "sig-004",
    assetSymbol: "XLV",
    generatedAt: "2026-03-09T06:45:00Z",
    validationStatus: "passed",
    informationCoefficient: 0.1,
    icThreshold: OPPORTUNITY_IC_THRESHOLD,
    confidenceScore: 0.77,
    confidenceAuditBasis: null,
    recommendationAuditBasis: null,
    recommendationText: "Potential defensive allocation candidate.",
    uncertaintyNote: "Audit trail is incomplete for display.",
    observedEvidence: "Healthcare sentiment climbed as macro risk rose.",
    inferenceSummary: "Healthcare may attract defensive flows.",
    suppressedReason: "Missing audit record.",
  },
];

export const portfolioSnapshot: PortfolioSnapshot = {
  baseCurrency: "USD",
  currentEquity: 124560.33,
  cash: 32120.9,
  dailyPnl: 540.27,
  positions: [
    {
      symbol: "XLK",
      quantity: 320,
      averageEntryPrice: 198.5,
      currentPrice: 202.6,
      unrealizedPnl: 1312,
      riskLabel: "medium",
      riskLabelAuditBasis: "Derived from forward trial drawdown behavior.",
      riskSuppressionConditions: "Suppress if trial is stale.",
    },
    {
      symbol: "XLF",
      quantity: 280,
      averageEntryPrice: 40.4,
      currentPrice: 39.9,
      unrealizedPnl: -140,
      riskLabel: "low",
      riskLabelAuditBasis: "Derived from rolling volatility checks.",
      riskSuppressionConditions: "Suppress if monitor is stale.",
    },
    {
      symbol: "XLV",
      quantity: 140,
      averageEntryPrice: 148.5,
      currentPrice: 149.8,
      unrealizedPnl: 182,
      riskLabel: "medium",
      riskLabelAuditBasis: null,
      riskSuppressionConditions: "Suppress when no audit basis is available.",
    },
  ],
};

export const tradeHistory: TradeRecord[] = [
  {
    id: "tr-1001",
    timestamp: "2026-03-08T15:20:00Z",
    symbol: "XLK",
    side: "buy",
    quantity: 100,
    price: 201.2,
    notionalValue: 20120,
    status: "filled",
  },
  {
    id: "tr-1002",
    timestamp: "2026-03-08T18:10:00Z",
    symbol: "XLF",
    side: "sell",
    quantity: 60,
    price: 40.2,
    notionalValue: 2412,
    status: "filled",
  },
  {
    id: "tr-1003",
    timestamp: "2026-03-09T03:45:00Z",
    symbol: "XLE",
    side: "buy",
    quantity: 70,
    price: 89.5,
    notionalValue: 6265,
    status: "canceled",
  },
];

export const relationshipHealth: RelationshipHealth[] = [
  {
    pair: "XLK / QQQ",
    regime: "bull",
    correlation: 0.42,
    stabilityScore: 0.71,
    validationStatus: "passed",
    windowEnd: "2026-03-09T00:00:00Z",
  },
  {
    pair: "XLE / USO",
    regime: "volatile",
    correlation: 0.36,
    stabilityScore: 0.63,
    validationStatus: "passed",
    windowEnd: "2026-03-09T00:00:00Z",
  },
  {
    pair: "XLV / IYH",
    regime: "stressed",
    correlation: 0.48,
    stabilityScore: 0.52,
    validationStatus: "pending",
    windowEnd: "2026-03-09T00:00:00Z",
  },
];

// New page-oriented mock datasets.
export const dashboardStats = [
  { label: "Your portfolio", value: "$124,560", subtitle: "Today's change +$540" },
  { label: "Top opportunities", value: "4", subtitle: "Validated and ready" },
  { label: "Strategy test", value: "Passed", subtitle: "Latest test cleared" },
  { label: "Bot status", value: "Paused", subtitle: "Waiting for health check" },
];

export const marketPulse = [
  { sector: "Technology", sentiment: "positive", note: "Earnings outlook improved" },
  { sector: "Energy", sentiment: "neutral", note: "Macro signals mixed" },
  { sector: "Healthcare", sentiment: "positive", note: "Defensive demand rising" },
  { sector: "Financials", sentiment: "warning", note: "Rate-sensitive pressure" },
];

export const topOpportunities: OpportunityItem[] = [
  {
    id: "opp-1",
    sector: "Technology",
    etf: "XLK",
    suggestedAction: "Watch for breakout buy",
    confidence: "high",
    riskLevel: "medium",
    whatHappened: "Positive earnings and social sentiment rose together over 3 days.",
    whyThisMatters: "Aligned momentum in sentiment and price can support short-term strength.",
    uncertaintyNote: "Momentum may fade if macro headlines turn negative.",
    validationStatus: "passed",
  },
  {
    id: "opp-2",
    sector: "Healthcare",
    etf: "XLV",
    suggestedAction: "Defensive accumulation",
    confidence: "medium",
    riskLevel: "low",
    whatHappened: "Risk-off headlines boosted healthcare mentions and inflows.",
    whyThisMatters: "Defensive sectors can attract capital during uncertain weeks.",
    uncertaintyNote: "Performance may lag if risk appetite returns quickly.",
    validationStatus: "passed",
  },
  {
    id: "opp-3",
    sector: "Energy",
    etf: "XLE",
    suggestedAction: "Wait for confirmation",
    confidence: "medium",
    riskLevel: "high",
    whatHappened: "Oil-related news improved, but price moves were inconsistent.",
    whyThisMatters: "Mixed direction increases reversal risk.",
    uncertaintyNote: "Further macro releases can change the setup rapidly.",
    validationStatus: "pending",
  },
  {
    id: "opp-4",
    sector: "Financials",
    etf: "XLF",
    suggestedAction: "No action",
    confidence: "low",
    riskLevel: "high",
    whatHappened: "Conflicting rate signals caused unstable trading patterns.",
    whyThisMatters: "Unstable patterns reduce trust in short-term entry timing.",
    uncertaintyNote: "Setup can improve if volatility cools.",
    validationStatus: "failed",
  },
];

export const recentActivity: DashboardActivity[] = [
  {
    id: "act-1",
    time: "2026-03-12T03:15:00Z",
    message: "Simulated Technology buy scenario completed.",
    mode: "assisted",
  },
  {
    id: "act-2",
    time: "2026-03-12T01:20:00Z",
    message: "Forward test divergence warning triggered.",
    mode: "bot",
  },
  {
    id: "act-3",
    time: "2026-03-11T22:05:00Z",
    message: "Healthcare opportunity moved to validated state.",
    mode: "manual",
  },
];

export const backtestMetrics = [
  { label: "Total return", value: "6.4%", subtitle: "Strategy test" },
  { label: "Benchmark return", value: "4.1%", subtitle: "SPY benchmark" },
  { label: "Max drawdown", value: "3.1%", subtitle: "Largest drop" },
  { label: "Win rate", value: "58%", subtitle: "Winning trades" },
];

export const portfolioGrowthData = [
  { label: "Jan", value: 100000 },
  { label: "Feb", value: 102600 },
  { label: "Mar", value: 104200 },
  { label: "Apr", value: 105800 },
  { label: "May", value: 104900 },
  { label: "Jun", value: 106400 },
];

export const benchmarkGrowthData = [
  { label: "Jan", value: 100000 },
  { label: "Feb", value: 101900 },
  { label: "Mar", value: 102700 },
  { label: "Apr", value: 103500 },
  { label: "May", value: 102900 },
  { label: "Jun", value: 104100 },
];

export const backtestTradeSummary = [
  { metric: "Total trades", value: "94" },
  { metric: "Average holding", value: "7 trading days" },
  { metric: "Best trade", value: "+4.2%" },
  { metric: "Worst trade", value: "-2.1%" },
];

export const forwardTestMetrics = [
  { label: "Realized return", value: "1.7%", subtitle: "Current forward test" },
  { label: "Drawdown", value: "1.1%", subtitle: "Largest drop" },
  { label: "Win rate", value: "55%", subtitle: "Closed positions" },
  { label: "Eligibility", value: "Review", subtitle: "Needs health confirmation" },
];

export const forwardVsBacktestComparison = [
  { metric: "Return", expected: "2.0%", actual: "1.7%", divergence: "Low" },
  { metric: "Drawdown", expected: "1.0%", actual: "1.1%", divergence: "Low" },
  { metric: "Win rate", expected: "58%", actual: "55%", divergence: "Medium" },
  { metric: "Trade frequency", expected: "22", actual: "31", divergence: "High" },
];

export const forwardWarnings = [
  "Trade frequency is running higher than expected.",
  "Keep bot in pause mode until model health returns to healthy.",
];

export const opportunityFilterOptions = {
  sector: ["all", "Technology", "Healthcare", "Energy", "Financials"],
  confidence: ["all", "high", "medium", "low"],
  risk: ["all", "low", "medium", "high"],
};

export const holdings: HoldingRow[] = [
  {
    symbol: "XLK",
    sector: "Technology",
    quantity: 320,
    averagePrice: 198.5,
    currentPrice: 202.6,
    realizedPnl: 420,
    unrealizedPnl: 1312,
    riskLevel: "medium",
  },
  {
    symbol: "XLV",
    sector: "Healthcare",
    quantity: 140,
    averagePrice: 148.5,
    currentPrice: 149.8,
    realizedPnl: 155,
    unrealizedPnl: 182,
    riskLevel: "low",
  },
  {
    symbol: "XLE",
    sector: "Energy",
    quantity: 110,
    averagePrice: 88.4,
    currentPrice: 87.3,
    realizedPnl: -80,
    unrealizedPnl: -121,
    riskLevel: "high",
  },
];

export const allocationData = [
  { label: "Technology", value: 42 },
  { label: "Healthcare", value: 27 },
  { label: "Energy", value: 18 },
  { label: "Cash", value: 13 },
];

export const sectorExposure = [
  { sector: "Technology", exposure: "42%", note: "Within target range" },
  { sector: "Healthcare", exposure: "27%", note: "Slightly above target" },
  { sector: "Energy", exposure: "18%", note: "At upper bound" },
];

export const riskSummary = [
  "No single position exceeds the 10% cap.",
  "Portfolio drawdown remains below configured limit.",
  "One high-risk position should be monitored closely.",
];

export const tradeHistoryRows: TradeHistoryRow[] = [
  {
    id: "th-1",
    timestamp: "2026-03-12T01:40:00Z",
    symbol: "XLK",
    side: "buy",
    quantity: 50,
    price: 202.2,
    mode: "assisted",
    status: "filled",
  },
  {
    id: "th-2",
    timestamp: "2026-03-11T18:20:00Z",
    symbol: "XLE",
    side: "sell",
    quantity: 20,
    price: 88.1,
    mode: "bot",
    status: "filled",
  },
  {
    id: "th-3",
    timestamp: "2026-03-11T15:12:00Z",
    symbol: "XLV",
    side: "buy",
    quantity: 30,
    price: 149.2,
    mode: "manual",
    status: "canceled",
  },
];

export const botControlSummary = {
  status: "paused" as const,
  mode: "assisted" as const,
  openPositions: 5,
  todayActions: 7,
  cumulativePnl: "+$4,220",
  riskSettings: [
    "Max position size: 10%",
    "Daily loss guard: 2%",
    "Hard stop-loss: 5%",
    "Take-profit target: 12%",
  ],
  regimeSummary: "Market is currently volatile with mixed sector leadership.",
  warnings: [
    "Model health is warning. Keep autonomous mode paused.",
    "Forward-test trade frequency is above expectation.",
  ],
};

export const analyticsReturnBreakdown = [
  { label: "Strategy return", value: "6.4%", subtitle: "Backtest window" },
  { label: "Forward return", value: "1.7%", subtitle: "Current trial" },
  { label: "Sector hit rate", value: "61%", subtitle: "Winning sector calls" },
  { label: "Signal quality", value: "B+", subtitle: "Source consistency" },
];

export const monthlyPerformance = [
  { label: "Jan", value: 1.8 },
  { label: "Feb", value: 2.3 },
  { label: "Mar", value: 1.4 },
  { label: "Apr", value: 2.1 },
  { label: "May", value: -0.4 },
  { label: "Jun", value: 1.1 },
];

export const sectorHitRate = [
  { label: "Technology", value: 68 },
  { label: "Healthcare", value: 63 },
  { label: "Energy", value: 52 },
  { label: "Financials", value: 49 },
];

export const signalSourceEffectiveness = [
  { source: "News", contribution: "High", consistency: "Stable" },
  { source: "Tweets", contribution: "Medium", consistency: "Variable" },
  { source: "Macro events", contribution: "High", consistency: "Stable" },
];

export const backtestForwardCompare = [
  { metric: "Return", backtest: "6.4%", forward: "1.7%" },
  { metric: "Win rate", backtest: "58%", forward: "55%" },
  { metric: "Drawdown", backtest: "3.1%", forward: "1.1%" },
];

export const modelHealthSummary = {
  status: "warning" as const,
  note: "Prediction drift increased this week. Monitor before bot restart.",
};

export const dashboardBot = {
  status: "paused" as const,
  mode: "assisted" as const,
  openPositions: 5,
  todayActions: 7,
  cumulativePnl: "+$4,220",
};

export const dashboardPortfolio = {
  currentValue: portfolioSnapshot.currentEquity,
  dailyPnl: portfolioSnapshot.dailyPnl,
  cash: portfolioSnapshot.cash,
};
