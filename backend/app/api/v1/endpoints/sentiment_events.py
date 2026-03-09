from __future__ import annotations

from fastapi import APIRouter, Depends

from app.api.deps import get_sentiment_event_service
from app.schemas.sentiment_event import SentimentEventCreateRequest, SentimentEventResponse
from app.services.sentiment_event_service import SentimentEventService

router = APIRouter()


@router.post("/", response_model=SentimentEventResponse)
def create_sentiment_event(
    request: SentimentEventCreateRequest,
    service: SentimentEventService = Depends(get_sentiment_event_service),
) -> SentimentEventResponse:
    return service.create_event(request)


@router.get("/", response_model=list[SentimentEventResponse])
def list_sentiment_events(
    service: SentimentEventService = Depends(get_sentiment_event_service),
) -> list[SentimentEventResponse]:
    return service.list_events()
