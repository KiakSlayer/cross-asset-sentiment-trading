from __future__ import annotations

from fastapi import APIRouter, Depends

from app.api.deps import get_strategy_service
from app.schemas.strategy import StrategyCreateRequest, StrategyResponse
from app.services.strategy_service import StrategyService

router = APIRouter()


@router.post("/", response_model=StrategyResponse)
def create_strategy(
    request: StrategyCreateRequest,
    service: StrategyService = Depends(get_strategy_service),
) -> StrategyResponse:
    return service.create_strategy(request)


@router.get("/", response_model=list[StrategyResponse])
def list_strategies(service: StrategyService = Depends(get_strategy_service)) -> list[StrategyResponse]:
    return service.list_strategies()
