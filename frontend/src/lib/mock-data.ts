import type {
  BacktestSummary,
  ForwardTestSummary,
  OpportunitySignal,
  PortfolioSnapshot,
  RelationshipHealth,
  TradeRecord,
} from "@/types/domain";

export const OPPORTUNITY_IC_THRESHOLD = 0.08;

export const dashboardStats = [
  { label: "Ready opportunities", value: "2", caption: "Passed checks + quality threshold" },
  { label: "Active strategy", value: "Lead-Lag Core", caption: "Configured for multi-asset watchlist" },
  { label: "Bot mode", value: "Paper", caption: "Autonomous mode still gated" },
  { label: "Model health", value: "Healthy", caption: "No degradation trigger" },
];

export const equityCurveData = [
  { label: "Week 1", value: 100000 },
  { label: "Week 2", value: 100850 },
  { label: "Week 3", value: 101600 },
  { label: "Week 4", value: 102100 },
  { label: "Week 5", value: 101750 },
  { label: "Week 6", value: 102900 },
  { label: "Week 7", value: 103250 },
  { label: "Week 8", value: 104200 },
];

export const backtestRuns: BacktestSummary[] = [
  {
    id: "bt-001",
    strategyName: "Lead-Lag Core",
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
    strategyName: "Lead-Lag Core",
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
    strategyName: "Lead-Lag Core",
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
    strategyName: "Lead-Lag Core",
    runStatus: "passed",
    passStatus: "passed",
    observedReturnPct: 1.7,
    observedMaxDrawdownPct: 1.1,
    environment: "paper",
    startedAt: "2026-03-03T00:00:00Z",
    endedAt: "2026-03-08T00:00:00Z",
    decisionReason: "Performance stayed inside loss limits during the trial run.",
  },
  {
    id: "ft-002",
    strategyName: "Lead-Lag Core",
    runStatus: "running",
    passStatus: "pending",
    observedReturnPct: 0.4,
    observedMaxDrawdownPct: 0.8,
    environment: "paper",
    startedAt: "2026-03-08T00:00:00Z",
    endedAt: "2026-03-15T00:00:00Z",
    decisionReason: "Trial run is still active, so promotion is not decided yet.",
  },
];

export const opportunitySignals: OpportunitySignal[] = [
  {
    id: "sig-001",
    assetSymbol: "BTC-USD",
    generatedAt: "2026-03-09T06:20:00Z",
    validationStatus: "passed",
    informationCoefficient: 0.14,
    icThreshold: OPPORTUNITY_IC_THRESHOLD,
    confidenceScore: 0.82,
    confidenceAuditBasis:
      "Calibrated on 24 months of walk-forward windows and rechecked in a 30-day paper trial.",
    recommendationAuditBasis:
      "Recommendation text linked to validation artifact run bt-002 and forward run ft-001.",
    recommendationText: "Consider a small staged buy if your risk plan allows.",
    uncertaintyNote: "Signal can weaken if the correlation regime shifts quickly.",
    observedEvidence: "Bitcoin demand sentiment rose for 3 sessions while price drift stayed muted.",
    inferenceSummary: "Short-term upside pressure may appear before the broader market reacts.",
    suppressedReason: null,
  },
  {
    id: "sig-002",
    assetSymbol: "ETH-USD",
    generatedAt: "2026-03-09T06:30:00Z",
    validationStatus: "passed",
    informationCoefficient: 0.05,
    icThreshold: OPPORTUNITY_IC_THRESHOLD,
    confidenceScore: 0.74,
    confidenceAuditBasis:
      "Calibrated on walk-forward windows, but latest information coefficient is below minimum threshold.",
    recommendationAuditBasis:
      "Linked to validation artifact run bt-002.",
    recommendationText: "Wait for stronger confirmation before acting.",
    uncertaintyNote: "Current relation strength is weaker than the configured minimum.",
    observedEvidence: "Sentiment improved, but price follow-through remained mixed.",
    inferenceSummary: "Potential move exists but is not strong enough for feed inclusion.",
    suppressedReason: "Below configured information coefficient threshold.",
  },
  {
    id: "sig-003",
    assetSymbol: "SPY",
    generatedAt: "2026-03-09T06:40:00Z",
    validationStatus: "failed",
    informationCoefficient: 0.11,
    icThreshold: OPPORTUNITY_IC_THRESHOLD,
    confidenceScore: 0.68,
    confidenceAuditBasis:
      "Historical quality check failed for the latest walk-forward segment.",
    recommendationAuditBasis: "Linked to validation artifact run bt-003.",
    recommendationText: "Do not take new exposure until checks pass again.",
    uncertaintyNote: "Recent trial windows failed consistency checks.",
    observedEvidence: "Signal direction flipped multiple times during out-of-sample windows.",
    inferenceSummary: "Relationship is unstable, so forecast quality is unreliable.",
    suppressedReason: "Validation status failed.",
  },
  {
    id: "sig-004",
    assetSymbol: "GLD",
    generatedAt: "2026-03-09T06:45:00Z",
    validationStatus: "passed",
    informationCoefficient: 0.1,
    icThreshold: OPPORTUNITY_IC_THRESHOLD,
    confidenceScore: 0.77,
    confidenceAuditBasis: null,
    recommendationAuditBasis: null,
    recommendationText: "Potential defensive allocation candidate.",
    uncertaintyNote: "Audit trail is incomplete; this note is hidden from users.",
    observedEvidence: "Risk-off headlines increased while gold inflow sentiment climbed.",
    inferenceSummary: "Gold may benefit as a near-term defensive position.",
    suppressedReason: "Missing audit record for user-facing confidence and recommendation.",
  },
];

export const strategyChecklist = [
  "Pick assets you understand and can explain in plain language.",
  "Set your maximum daily loss limit before enabling any automation.",
  "Keep walk-forward validation enabled (required).",
  "Require a passed forward test before autonomous mode (required).",
  "Turn on model degradation monitoring alerts (required).",
];

export const strategyControlSummary = {
  watchlist: ["BTC-USD", "ETH-USD", "SPY", "GLD"],
  refreshMinutes: 30,
  riskBudgetPct: 10,
  maxSinglePositionPct: 5,
  forwardTestRequired: true,
};

export const portfolioSnapshot: PortfolioSnapshot = {
  baseCurrency: "USD",
  currentEquity: 124560.33,
  cash: 32120.9,
  dailyPnl: 540.27,
  positions: [
    {
      symbol: "BTC-USD",
      quantity: 0.85,
      averageEntryPrice: 60800,
      currentPrice: 61950,
      unrealizedPnl: 977.5,
      riskLabel: "balanced",
      riskLabelAuditBasis: "Risk score derived from drawdown behavior in forward run ft-001.",
      riskSuppressionConditions: "Suppress if forward test is older than 30 days.",
    },
    {
      symbol: "SPY",
      quantity: 130,
      averageEntryPrice: 504.2,
      currentPrice: 501.8,
      unrealizedPnl: -312,
      riskLabel: "conservative",
      riskLabelAuditBasis: "Risk score derived from rolling volatility checks and stop-loss behavior.",
      riskSuppressionConditions: "Suppress if volatility monitor is stale.",
    },
    {
      symbol: "GLD",
      quantity: 220,
      averageEntryPrice: 188.5,
      currentPrice: 190.4,
      unrealizedPnl: 418,
      riskLabel: "balanced",
      riskLabelAuditBasis: null,
      riskSuppressionConditions: "Suppress when no audit basis is available.",
    },
  ],
};

export const tradeHistory: TradeRecord[] = [
  {
    id: "tr-1001",
    timestamp: "2026-03-08T15:20:00Z",
    symbol: "BTC-USD",
    side: "buy",
    quantity: 0.12,
    price: 61550,
    notionalValue: 7386,
    status: "filled",
  },
  {
    id: "tr-1002",
    timestamp: "2026-03-08T18:10:00Z",
    symbol: "SPY",
    side: "sell",
    quantity: 20,
    price: 503.6,
    notionalValue: 10072,
    status: "filled",
  },
  {
    id: "tr-1003",
    timestamp: "2026-03-09T03:45:00Z",
    symbol: "ETH-USD",
    side: "buy",
    quantity: 1.5,
    price: 3380,
    notionalValue: 5070,
    status: "canceled",
  },
];

export const relationshipHealth: RelationshipHealth[] = [
  {
    pair: "BTC-USD / SPY",
    regime: "volatile",
    correlation: 0.42,
    stabilityScore: 0.71,
    validationStatus: "passed",
    windowEnd: "2026-03-09T00:00:00Z",
  },
  {
    pair: "ETH-USD / QQQ",
    regime: "bull",
    correlation: 0.36,
    stabilityScore: 0.63,
    validationStatus: "passed",
    windowEnd: "2026-03-09T00:00:00Z",
  },
  {
    pair: "GLD / DXY",
    regime: "stressed",
    correlation: -0.48,
    stabilityScore: 0.52,
    validationStatus: "pending",
    windowEnd: "2026-03-09T00:00:00Z",
  },
];

export const degradationMetrics = [
  { label: "Prediction error ratio", value: 0.86, threshold: 1.1 },
  { label: "Signal consistency ratio", value: 0.91, threshold: 0.8 },
  { label: "Forward-vs-backtest drift", value: 0.73, threshold: 1 },
];

export const monthlyReturns = [
  { label: "Jan", value: 1.8 },
  { label: "Feb", value: 2.3 },
  { label: "Mar", value: 1.4 },
  { label: "Apr", value: 2.1 },
  { label: "May", value: -0.4 },
  { label: "Jun", value: 1.1 },
];
