from __future__ import annotations

from app.core.security import create_access_token
from app.schemas.auth import LoginRequest, TokenResponse, UserIdentityResponse


class AuthService:
    """Authentication service scaffold."""

    def login(self, request: LoginRequest) -> TokenResponse:
        """Authenticate user credentials and return a bearer token placeholder."""

        token = create_access_token(subject=request.email)
        return TokenResponse(access_token=token)

    def get_current_user(self) -> UserIdentityResponse:
        """Return a placeholder identity object for authenticated contexts."""

        return UserIdentityResponse(
            user_id="placeholder-user-id",
            email="user@example.com",
            is_active=True,
        )
