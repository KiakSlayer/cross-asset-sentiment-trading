from __future__ import annotations

from dataclasses import dataclass


@dataclass
class StrategyModel:
    strategy_id: str
    forward_test_eligibility: str
