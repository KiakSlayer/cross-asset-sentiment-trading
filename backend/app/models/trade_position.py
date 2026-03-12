from __future__ import annotations

from dataclasses import dataclass


@dataclass
class TradeModel:
    trade_id: str
    symbol: str


@dataclass
class PositionModel:
    position_id: str
    symbol: str
