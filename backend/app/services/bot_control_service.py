from __future__ import annotations

from app.schemas.common import ForwardTestStatus
from app.schemas.bot_control import BotActivationDecision, BotActivationRequest, BotStatusResponse


class BotControlService:
    """Bot control scaffold enforcing autonomous activation prerequisites."""

    def evaluate_activation(self, request: BotActivationRequest) -> BotActivationDecision:
        if request.enable_autonomous and request.forward_test_status != ForwardTestStatus.PASSED:
            return BotActivationDecision(
                strategy_id=request.strategy_id,
                activation_allowed=False,
                reason="Forward test has not passed.",
            )

        if request.enable_autonomous and not request.risk_controls_configured:
            return BotActivationDecision(
                strategy_id=request.strategy_id,
                activation_allowed=False,
                reason="Risk controls must be configured before autonomous activation.",
            )

        return BotActivationDecision(
            strategy_id=request.strategy_id,
            activation_allowed=True,
            reason="Activation request satisfies scaffold guardrails.",
        )

    def get_status(self, strategy_id: str) -> BotStatusResponse:
        return BotStatusResponse(
            strategy_id=strategy_id,
            autonomous_enabled=False,
            guardrails_active=True,
        )

    def preview_risk_label(self, strategy_id: str) -> str:
        """Return a placeholder user-facing risk label.

        how the score is computed: Risk labels are derived from configured risk
        controls, strategy behavior metrics, and suitability constraints.
        what historical validation supports it: Labels are expected to reference
        historical performance evidence from walk-forward and forward tests.
        what conditions would cause it to be suppressed: Suppress when required
        risk controls are missing or the strategy fails activation gates.
        """

        return f"Strategy {strategy_id} risk label: pending validation evidence"
