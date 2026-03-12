from __future__ import annotations

from app.schemas.user_profile import UserProfileResponse


class UserProfileService:
    """User and profile service scaffold."""

    def get_current_profile(self) -> UserProfileResponse:
        return UserProfileResponse(
            user_id="placeholder-user-id",
            email="user@example.com",
            display_name="New User",
            risk_profile="pending",
        )
