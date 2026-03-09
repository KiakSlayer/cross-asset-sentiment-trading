from __future__ import annotations

from app.schemas.backtesting import BacktestRequest, BacktestRunResponse


class BacktestingService:
    """Backtesting service scaffold with walk-forward contract entrypoint."""

    def start_backtest(self, request: BacktestRequest) -> BacktestRunResponse:
        return BacktestRunResponse(
            run_id="placeholder-backtest-run",
            strategy_id=request.strategy_id,
            status="pending",
        )
