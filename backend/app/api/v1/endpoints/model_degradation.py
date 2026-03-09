from __future__ import annotations

from fastapi import APIRouter, Depends

from app.api.deps import get_model_degradation_service
from app.schemas.model_degradation import ModelDegradationStatusResponse
from app.services.model_degradation_service import ModelDegradationService

router = APIRouter()


@router.get("/{strategy_id}", response_model=ModelDegradationStatusResponse)
def get_degradation_status(
    strategy_id: str,
    service: ModelDegradationService = Depends(get_model_degradation_service),
) -> ModelDegradationStatusResponse:
    return service.get_status(strategy_id)
