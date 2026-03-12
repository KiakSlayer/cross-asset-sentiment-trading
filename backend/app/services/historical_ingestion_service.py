from __future__ import annotations

from app.schemas.historical_ingestion import (
    HistoricalIngestionJobResponse,
    HistoricalIngestionRequest,
)


class HistoricalIngestionService:
    """Historical data ingestion service scaffold."""

    def start_ingestion(self, request: HistoricalIngestionRequest) -> HistoricalIngestionJobResponse:
        return HistoricalIngestionJobResponse(job_id="placeholder-ingestion-job", status="queued")
