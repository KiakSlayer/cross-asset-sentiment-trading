from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel


class HealthComponent(BaseModel):
    name: str
    status: str
    detail: str


class SystemHealthResponse(BaseModel):
    checked_at: datetime
    overall_status: str
    components: list[HealthComponent]
