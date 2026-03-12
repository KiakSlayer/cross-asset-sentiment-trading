from __future__ import annotations

from fastapi import APIRouter, Depends

from app.api.deps import get_portfolio_service
from app.schemas.portfolio import PortfolioSummaryResponse
from app.services.portfolio_service import PortfolioService

router = APIRouter()


@router.get("/", response_model=list[PortfolioSummaryResponse])
def list_portfolios(
    service: PortfolioService = Depends(get_portfolio_service),
) -> list[PortfolioSummaryResponse]:
    return service.list_portfolios()
