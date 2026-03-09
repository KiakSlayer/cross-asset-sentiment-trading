export type ValidationStatus = "pending" | "passed" | "failed" | "suppressed";

export type RunStatus = "pending" | "running" | "passed" | "failed" | "canceled";

export type DegradationStatus = "healthy" | "warning" | "degraded" | "halted";

export type RegimeType =
  | "bull"
  | "bear"
  | "sideways"
  | "volatile"
  | "stressed"
  | "unknown";

export interface RecommendationExplanation {
  observed: string;
  inferred: string;
  uncertainty: string;
}

export interface OpportunitySignal {
  id: string;
  assetSymbol: string;
  generatedAt: string;
  validationStatus: ValidationStatus;
  informationCoefficient: number;
  icThreshold: number;
  confidenceScore: number | null;
  confidenceAuditBasis: string | null;
  recommendationAuditBasis: string | null;
  recommendationText: string | null;
  uncertaintyNote: string;
  observedEvidence: string;
  inferenceSummary: string;
  suppressedReason: string | null;
}

export interface BacktestSummary {
  id: string;
  strategyName: string;
  runStatus: RunStatus;
  totalReturnPct: number;
  maxDrawdownPct: number;
  walkForwardWindows: number;
  startedAt: string;
  endedAt: string;
  validationStatus: ValidationStatus;
}

export interface ForwardTestSummary {
  id: string;
  strategyName: string;
  runStatus: RunStatus;
  passStatus: ValidationStatus;
  observedReturnPct: number;
  observedMaxDrawdownPct: number;
  environment: "paper" | "sandbox";
  startedAt: string;
  endedAt: string;
  decisionReason: string;
}

export interface BotGateStatus {
  requiresForwardTestPass: boolean;
  forwardTestGateStatus: ValidationStatus;
  degradationStatus: DegradationStatus;
  canActivateAutonomousTrading: boolean;
  blockers: string[];
}

export interface PortfolioPosition {
  symbol: string;
  quantity: number;
  averageEntryPrice: number;
  currentPrice: number;
  unrealizedPnl: number;
  riskLabel: string | null;
  riskLabelAuditBasis: string | null;
  riskSuppressionConditions: string | null;
}

export interface PortfolioSnapshot {
  baseCurrency: string;
  currentEquity: number;
  cash: number;
  dailyPnl: number;
  positions: PortfolioPosition[];
}

export interface TradeRecord {
  id: string;
  timestamp: string;
  symbol: string;
  side: "buy" | "sell";
  quantity: number;
  price: number;
  notionalValue: number;
  status: "filled" | "canceled" | "rejected";
}

export interface RelationshipHealth {
  pair: string;
  regime: RegimeType;
  correlation: number;
  stabilityScore: number;
  validationStatus: ValidationStatus;
  windowEnd: string;
}

export interface ConfidenceDisplay {
  label: string | null;
  score: number | null;
  auditBasis: string | null;
  suppressedReason: string | null;
}

export interface RiskLabelDisplay {
  label: string | null;
  auditBasis: string | null;
  suppressedReason: string | null;
}
