from __future__ import annotations

from pydantic import BaseModel, EmailStr


class UserProfileResponse(BaseModel):
    user_id: str
    email: EmailStr
    display_name: str | None = None
    risk_profile: str | None = None
