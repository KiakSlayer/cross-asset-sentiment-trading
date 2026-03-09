from __future__ import annotations

from datetime import datetime, timezone

from app.schemas.model_degradation import ModelDegradationStatusResponse


class ModelDegradationService:
    """Model degradation monitoring service scaffold."""

    def get_status(self, strategy_id: str) -> ModelDegradationStatusResponse:
        return ModelDegradationStatusResponse(
            strategy_id=strategy_id,
            status="unknown",
            monitored_at=datetime.now(timezone.utc),
            details="Monitoring pipeline scaffolded but not implemented.",
        )
