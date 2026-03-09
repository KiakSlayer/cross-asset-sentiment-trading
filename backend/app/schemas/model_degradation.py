from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel


class ModelDegradationStatusResponse(BaseModel):
    strategy_id: str
    status: str
    monitored_at: datetime
    details: str
