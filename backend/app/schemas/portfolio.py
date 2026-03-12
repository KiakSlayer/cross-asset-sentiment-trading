from __future__ import annotations

from pydantic import BaseModel


class PortfolioSummaryResponse(BaseModel):
    portfolio_id: str
    user_id: str
    total_value: float
    cash_balance: float
