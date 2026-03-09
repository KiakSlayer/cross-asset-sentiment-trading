import type {
  BotGateStatus,
  ConfidenceDisplay,
  DegradationStatus,
  OpportunitySignal,
  PortfolioPosition,
  RecommendationExplanation,
  RiskLabelDisplay,
  ValidationStatus,
} from "@/types/domain";
import { OPPORTUNITY_IC_THRESHOLD } from "@/lib/mock-data";

function hasAuditBasis(auditBasis: string | null): boolean {
  return Boolean(auditBasis && auditBasis.trim().length > 0);
}

export function getEligibleOpportunities(
  signals: OpportunitySignal[],
  icThreshold = OPPORTUNITY_IC_THRESHOLD,
): OpportunitySignal[] {
  return signals.filter(
    (signal) =>
      signal.validationStatus === "passed" &&
      signal.informationCoefficient >= icThreshold,
  );
}

/**
 * Builds a user-facing confidence label from score buckets.
 *
 * How the score is computed:
 * Uses the existing numeric confidence score and maps it to plain-language buckets
 * (`High confidence`, `Medium confidence`, `Low confidence`) based on fixed ranges.
 *
 * What historical validation supports it:
 * The output is only shown when a confidence audit basis is present, which is expected to
 * reference walk-forward and forward-test validation artifacts.
 *
 * What conditions would cause it to be suppressed:
 * Suppressed when validation is not `passed`, score is missing, audit basis is missing,
 * or the signal already contains a suppression reason.
 */
export function buildConfidenceDisplay(signal: OpportunitySignal): ConfidenceDisplay {
  if (signal.validationStatus !== "passed") {
    return {
      label: null,
      score: null,
      auditBasis: null,
      suppressedReason: "Hidden because the signal did not pass validation.",
    };
  }

  if (!hasAuditBasis(signal.confidenceAuditBasis)) {
    return {
      label: null,
      score: null,
      auditBasis: null,
      suppressedReason: "Hidden because confidence audit evidence is missing.",
    };
  }

  if (signal.confidenceScore === null || signal.confidenceScore === undefined) {
    return {
      label: null,
      score: null,
      auditBasis: signal.confidenceAuditBasis,
      suppressedReason: "Hidden because confidence score is missing.",
    };
  }

  if (signal.suppressedReason) {
    return {
      label: null,
      score: null,
      auditBasis: signal.confidenceAuditBasis,
      suppressedReason: signal.suppressedReason,
    };
  }

  const label =
    signal.confidenceScore >= 0.8
      ? "High confidence"
      : signal.confidenceScore >= 0.65
        ? "Medium confidence"
        : "Low confidence";

  return {
    label,
    score: signal.confidenceScore,
    auditBasis: signal.confidenceAuditBasis,
    suppressedReason: null,
  };
}

/**
 * Builds a user-facing recommendation explanation card.
 *
 * How the score is computed:
 * Uses pre-computed observed evidence and inference text from the validated signal,
 * and pairs it with the uncertainty note as the recommendation explanation payload.
 *
 * What historical validation supports it:
 * Recommendation text is only shown when recommendation audit basis exists, which should
 * tie to historical walk-forward and forward-test records.
 *
 * What conditions would cause it to be suppressed:
 * Suppressed when validation is not `passed`, recommendation text is missing,
 * recommendation audit basis is missing, or signal has a suppression reason.
 */
export function buildRecommendationExplanation(
  signal: OpportunitySignal,
): RecommendationExplanation | null {
  if (signal.validationStatus !== "passed") {
    return null;
  }

  if (!signal.recommendationText || !hasAuditBasis(signal.recommendationAuditBasis)) {
    return null;
  }

  if (signal.suppressedReason) {
    return null;
  }

  return {
    observed: signal.observedEvidence,
    inferred: signal.inferenceSummary,
    uncertainty: signal.uncertaintyNote,
  };
}

/**
 * Builds a user-facing risk label for an open position.
 *
 * How the score is computed:
 * Uses the already assigned risk label from upstream risk checks without recalculating it.
 *
 * What historical validation supports it:
 * The label is only shown when a risk label audit basis exists and points to validated
 * historical behavior checks.
 *
 * What conditions would cause it to be suppressed:
 * Suppressed when the risk label is missing or the audit basis is missing.
 */
export function buildRiskLabelDisplay(position: PortfolioPosition): RiskLabelDisplay {
  if (!position.riskLabel) {
    return {
      label: null,
      auditBasis: null,
      suppressedReason: "Hidden because no risk label is available.",
    };
  }

  if (!hasAuditBasis(position.riskLabelAuditBasis)) {
    return {
      label: null,
      auditBasis: null,
      suppressedReason:
        position.riskSuppressionConditions ||
        "Hidden because risk label audit evidence is missing.",
    };
  }

  return {
    label: position.riskLabel,
    auditBasis: position.riskLabelAuditBasis,
    suppressedReason: null,
  };
}

export function evaluateBotActivationGate(params: {
  forwardTestGateStatus: ValidationStatus;
  degradationStatus: DegradationStatus;
  requiresForwardTestPass?: boolean;
}): BotGateStatus {
  const {
    forwardTestGateStatus,
    degradationStatus,
    requiresForwardTestPass = true,
  } = params;
  const blockers: string[] = [];

  if (requiresForwardTestPass && forwardTestGateStatus !== "passed") {
    blockers.push("Autonomous mode is locked until forward testing is marked as passed.");
  }

  if (degradationStatus !== "healthy") {
    blockers.push("Model health monitor is not healthy, so autonomous mode is locked.");
  }

  return {
    requiresForwardTestPass,
    forwardTestGateStatus,
    degradationStatus,
    canActivateAutonomousTrading: blockers.length === 0,
    blockers,
  };
}
