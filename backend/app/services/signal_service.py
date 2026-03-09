from __future__ import annotations

from datetime import datetime, timezone

from app.schemas.common import AuditBasis, ConfidenceLabel, ValidationStatus
from app.schemas.signal import SignalResponse


class SignalService:
    """Signal service scaffold."""

    def list_signals(self) -> list[SignalResponse]:
        return []

    def get_signal(self, signal_id: str) -> SignalResponse:
        return SignalResponse(
            signal_id=signal_id,
            strategy_id="placeholder-strategy-id",
            asset_symbol="BTCUSDT",
            validation_status=ValidationStatus.PENDING,
            information_coefficient=0.0,
            confidence_label=ConfidenceLabel.LOW,
            confidence_score=0.0,
            audit_basis=AuditBasis(
                method="placeholder_method",
                validation_window="placeholder_window",
                evidence_ref="placeholder_evidence",
                suppression_conditions="missing validation evidence",
            ),
            observed="Insufficient data to produce a validated signal.",
            inferred="No recommendation should be inferred at this time.",
            uncertainty="Confidence is suppressed until validation passes.",
            generated_at=datetime.now(timezone.utc),
        )

    def build_user_facing_recommendation(self, signal: SignalResponse) -> str:
        """Produce a plain-language recommendation message for the UI.

        how the score is computed: Confidence and recommendation text are mapped
        from precomputed validation artifacts and calibrated model outputs.
        what historical validation supports it: This placeholder expects
        walk-forward and forward-test evidence linked by `audit_basis.evidence_ref`.
        what conditions would cause it to be suppressed: Suppress when validation
        is not passed, IC is below threshold, or audit evidence is unavailable.
        """

        return (
            f"Observed: {signal.observed} Inferred: {signal.inferred} "
            f"Uncertainty: {signal.uncertainty}"
        )
