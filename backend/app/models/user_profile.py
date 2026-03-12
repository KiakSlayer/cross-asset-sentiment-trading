from __future__ import annotations

from dataclasses import dataclass


@dataclass
class UserProfileModel:
    user_id: str
    email: str
