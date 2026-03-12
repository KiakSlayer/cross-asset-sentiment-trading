from __future__ import annotations

from dataclasses import dataclass


@dataclass
class SignalModel:
    signal_id: str
    validation_status: str
    information_coefficient: float
