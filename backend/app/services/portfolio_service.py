from __future__ import annotations

from app.schemas.portfolio import PortfolioSummaryResponse


class PortfolioService:
    """Portfolio tracking service scaffold."""

    def list_portfolios(self) -> list[PortfolioSummaryResponse]:
        return []
