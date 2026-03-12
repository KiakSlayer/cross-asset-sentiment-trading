from __future__ import annotations

from fastapi import APIRouter, Depends

from app.api.deps import get_historical_ingestion_service
from app.schemas.historical_ingestion import (
    HistoricalIngestionJobResponse,
    HistoricalIngestionRequest,
)
from app.services.historical_ingestion_service import HistoricalIngestionService

router = APIRouter()


@router.post("/jobs", response_model=HistoricalIngestionJobResponse)
def start_ingestion(
    request: HistoricalIngestionRequest,
    service: HistoricalIngestionService = Depends(get_historical_ingestion_service),
) -> HistoricalIngestionJobResponse:
    return service.start_ingestion(request)
