from __future__ import annotations

from pydantic import BaseModel


class HistoricalIngestionRequest(BaseModel):
    source: str
    symbols: list[str]
    start_date: str
    end_date: str


class HistoricalIngestionJobResponse(BaseModel):
    job_id: str
    status: str
