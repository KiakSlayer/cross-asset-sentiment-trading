from __future__ import annotations

from fastapi import APIRouter, Depends

from app.api.deps import get_bot_control_service
from app.schemas.bot_control import BotActivationDecision, BotActivationRequest, BotStatusResponse
from app.services.bot_control_service import BotControlService

router = APIRouter()


@router.post("/activate", response_model=BotActivationDecision)
def activate_bot(
    request: BotActivationRequest,
    service: BotControlService = Depends(get_bot_control_service),
) -> BotActivationDecision:
    return service.evaluate_activation(request)


@router.get("/status/{strategy_id}", response_model=BotStatusResponse)
def get_bot_status(
    strategy_id: str,
    service: BotControlService = Depends(get_bot_control_service),
) -> BotStatusResponse:
    return service.get_status(strategy_id)
