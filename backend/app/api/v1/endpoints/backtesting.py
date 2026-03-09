from __future__ import annotations

from fastapi import APIRouter, Depends

from app.api.deps import get_backtesting_service
from app.schemas.backtesting import BacktestRequest, BacktestRunResponse
from app.services.backtesting_service import BacktestingService

router = APIRouter()


@router.post("/runs", response_model=BacktestRunResponse)
def start_backtest(
    request: BacktestRequest,
    service: BacktestingService = Depends(get_backtesting_service),
) -> BacktestRunResponse:
    return service.start_backtest(request)
