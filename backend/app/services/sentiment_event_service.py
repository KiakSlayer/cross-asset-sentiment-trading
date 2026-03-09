from __future__ import annotations

from app.schemas.sentiment_event import SentimentEventCreateRequest, SentimentEventResponse


class SentimentEventService:
    """Sentiment events service scaffold."""

    def create_event(self, request: SentimentEventCreateRequest) -> SentimentEventResponse:
        return SentimentEventResponse(
            event_id="placeholder-event-id",
            asset_symbol=request.asset_symbol,
            source=request.source,
            sentiment_score=request.sentiment_score,
            event_time=request.event_time,
        )

    def list_events(self) -> list[SentimentEventResponse]:
        return []
