from __future__ import annotations

from pydantic import BaseModel


class StrategyCreateRequest(BaseModel):
    name: str
    description: str | None = None


class StrategyResponse(BaseModel):
    strategy_id: str
    name: str
    status: str = "draft"
