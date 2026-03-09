from __future__ import annotations

from pydantic import BaseModel

from app.schemas.common import ForwardTestStatus


class ForwardTestStartRequest(BaseModel):
    strategy_id: str
    duration_days: int


class ForwardTestStatusResponse(BaseModel):
    run_id: str
    strategy_id: str
    status: ForwardTestStatus
