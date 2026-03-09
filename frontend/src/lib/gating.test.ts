import { describe, expect, it } from "vitest";

import {
  buildConfidenceDisplay,
  buildRecommendationExplanation,
  buildRiskLabelDisplay,
  evaluateBotActivationGate,
  getEligibleOpportunities,
} from "./gating";
import { OPPORTUNITY_IC_THRESHOLD, opportunitySignals, portfolioSnapshot } from "./mock-data";

describe("gating helpers", () => {
  it("filters opportunity feed to passed signals above IC threshold", () => {
    const eligible = getEligibleOpportunities(opportunitySignals, OPPORTUNITY_IC_THRESHOLD);

    expect(eligible.every((signal) => signal.validationStatus === "passed")).toBe(true);
    expect(
      eligible.every((signal) => signal.informationCoefficient >= OPPORTUNITY_IC_THRESHOLD),
    ).toBe(true);
    expect(eligible.map((signal) => signal.id)).toEqual(["sig-001", "sig-004"]);
  });

  it("blocks autonomous activation if forward test is not passed", () => {
    const gate = evaluateBotActivationGate({
      forwardTestGateStatus: "pending",
      degradationStatus: "healthy",
      requiresForwardTestPass: true,
    });

    expect(gate.canActivateAutonomousTrading).toBe(false);
    expect(gate.blockers).toContain(
      "Autonomous mode is locked until forward testing is marked as passed.",
    );
  });

  it("blocks autonomous activation if model health is not healthy", () => {
    const gate = evaluateBotActivationGate({
      forwardTestGateStatus: "passed",
      degradationStatus: "warning",
      requiresForwardTestPass: true,
    });

    expect(gate.canActivateAutonomousTrading).toBe(false);
    expect(gate.blockers).toContain(
      "Model health monitor is not healthy, so autonomous mode is locked.",
    );
  });

  it("suppresses confidence note without audit basis", () => {
    const hidden = buildConfidenceDisplay(opportunitySignals[3]);

    expect(hidden.label).toBeNull();
    expect(hidden.suppressedReason).toBe(
      "Hidden because confidence audit evidence is missing.",
    );
  });

  it("shows recommendation only when auditable basis exists", () => {
    const visible = buildRecommendationExplanation(opportunitySignals[0]);
    const hidden = buildRecommendationExplanation(opportunitySignals[3]);

    expect(visible).not.toBeNull();
    expect(hidden).toBeNull();
  });

  it("suppresses risk label when audit evidence is missing", () => {
    const visible = buildRiskLabelDisplay(portfolioSnapshot.positions[0]);
    const hidden = buildRiskLabelDisplay(portfolioSnapshot.positions[2]);

    expect(visible.label).toBe("balanced");
    expect(hidden.label).toBeNull();
    expect(hidden.suppressedReason).toContain("Suppress");
  });
});
