from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel


class SentimentEventCreateRequest(BaseModel):
    asset_symbol: str
    source: str
    sentiment_score: float
    event_time: datetime


class SentimentEventResponse(BaseModel):
    event_id: str
    asset_symbol: str
    source: str
    sentiment_score: float
    event_time: datetime
