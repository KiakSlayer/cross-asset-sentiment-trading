from __future__ import annotations

from pydantic import BaseModel


class TradeResponse(BaseModel):
    trade_id: str
    portfolio_id: str
    symbol: str
    side: str
    quantity: float
    status: str


class PositionResponse(BaseModel):
    position_id: str
    portfolio_id: str
    symbol: str
    quantity: float
    avg_price: float
    status: str
