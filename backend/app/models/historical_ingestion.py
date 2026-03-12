from __future__ import annotations

from dataclasses import dataclass


@dataclass
class HistoricalIngestionJobModel:
    job_id: str
    status: str
