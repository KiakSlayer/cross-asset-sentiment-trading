from __future__ import annotations

from pydantic import BaseModel


class SectorRelevanceResponse(BaseModel):
    signal_id: str
    sector: str
    relevance_score: float
    propagation_notes: str
