from __future__ import annotations

from fastapi import APIRouter, Depends

from app.api.deps import get_trade_position_service
from app.schemas.trade_position import PositionResponse, TradeResponse
from app.services.trade_position_service import TradePositionService

router = APIRouter()


@router.get("/trades", response_model=list[TradeResponse])
def list_trades(
    service: TradePositionService = Depends(get_trade_position_service),
) -> list[TradeResponse]:
    return service.list_trades()


@router.get("/positions", response_model=list[PositionResponse])
def list_positions(
    service: TradePositionService = Depends(get_trade_position_service),
) -> list[PositionResponse]:
    return service.list_positions()
