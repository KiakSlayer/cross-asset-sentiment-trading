from __future__ import annotations

from app.core.config import get_settings
from app.schemas.common import ValidationStatus
from app.schemas.signal_validation import SignalValidationRequest, SignalValidationResponse


class SignalValidationService:
    """Signal validation service scaffold."""

    def validate_signal(self, request: SignalValidationRequest) -> SignalValidationResponse:
        settings = get_settings()
        return SignalValidationResponse(
            signal_id=request.signal_id,
            validation_status=ValidationStatus.PENDING,
            information_coefficient=0.0,
            ic_threshold=settings.ic_threshold,
        )
