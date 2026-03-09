from __future__ import annotations

from app.schemas.strategy import StrategyCreateRequest, StrategyResponse


class StrategyService:
    """Strategy management service scaffold."""

    def create_strategy(self, request: StrategyCreateRequest) -> StrategyResponse:
        return StrategyResponse(strategy_id="placeholder-strategy-id", name=request.name)

    def list_strategies(self) -> list[StrategyResponse]:
        return []
