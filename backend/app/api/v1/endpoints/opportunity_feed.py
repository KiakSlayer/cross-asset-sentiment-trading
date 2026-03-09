from __future__ import annotations

from fastapi import APIRouter, Depends

from app.api.deps import get_opportunity_feed_service
from app.schemas.opportunity import OpportunityFeedItem
from app.services.opportunity_feed_service import OpportunityFeedService

router = APIRouter()


@router.post("/eligible", response_model=list[OpportunityFeedItem])
def list_eligible_opportunities(
    candidates: list[OpportunityFeedItem],
    service: OpportunityFeedService = Depends(get_opportunity_feed_service),
) -> list[OpportunityFeedItem]:
    return service.list_eligible_opportunities(candidates)
