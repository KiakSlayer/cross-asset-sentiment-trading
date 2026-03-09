from __future__ import annotations

from fastapi import APIRouter, Depends

from app.api.deps import get_signal_validation_service
from app.schemas.signal_validation import SignalValidationRequest, SignalValidationResponse
from app.services.signal_validation_service import SignalValidationService

router = APIRouter()


@router.post("/evaluate", response_model=SignalValidationResponse)
def evaluate_signal(
    request: SignalValidationRequest,
    service: SignalValidationService = Depends(get_signal_validation_service),
) -> SignalValidationResponse:
    return service.validate_signal(request)
