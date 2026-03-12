from __future__ import annotations

from dataclasses import dataclass


@dataclass
class SystemHealthModel:
    component: str
    status: str
