from __future__ import annotations

from app.schemas.trade_position import PositionResponse, TradeResponse


class TradePositionService:
    """Trades and positions service scaffold."""

    def list_trades(self) -> list[TradeResponse]:
        return []

    def list_positions(self) -> list[PositionResponse]:
        return []
