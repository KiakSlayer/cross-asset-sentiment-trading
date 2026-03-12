from __future__ import annotations

from dataclasses import dataclass


@dataclass
class SectorRelevanceModel:
    signal_id: str
    sector: str
    relevance_score: float
