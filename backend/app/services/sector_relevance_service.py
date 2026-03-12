from __future__ import annotations

from app.schemas.sector_relevance import SectorRelevanceResponse


class SectorRelevanceService:
    """Sector relevance and propagation service scaffold."""

    def list_relevance(self) -> list[SectorRelevanceResponse]:
        return []
