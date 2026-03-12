from __future__ import annotations

from fastapi import APIRouter, Depends

from app.api.deps import get_sector_relevance_service
from app.schemas.sector_relevance import SectorRelevanceResponse
from app.services.sector_relevance_service import SectorRelevanceService

router = APIRouter()


@router.get("/", response_model=list[SectorRelevanceResponse])
def list_sector_relevance(
    service: SectorRelevanceService = Depends(get_sector_relevance_service),
) -> list[SectorRelevanceResponse]:
    return service.list_relevance()
