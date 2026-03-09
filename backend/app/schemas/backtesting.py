from __future__ import annotations

from pydantic import BaseModel, Field


class WalkForwardConfig(BaseModel):
    train_window_days: int = Field(..., gt=0)
    test_window_days: int = Field(..., gt=0)
    step_days: int = Field(..., gt=0)


class BacktestRequest(BaseModel):
    strategy_id: str
    walk_forward: WalkForwardConfig


class BacktestRunResponse(BaseModel):
    run_id: str
    strategy_id: str
    status: str
