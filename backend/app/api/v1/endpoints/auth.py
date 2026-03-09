from __future__ import annotations

from fastapi import APIRouter, Depends

from app.api.deps import get_auth_service
from app.schemas.auth import LoginRequest, TokenResponse, UserIdentityResponse
from app.services.auth_service import AuthService

router = APIRouter()


@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, service: AuthService = Depends(get_auth_service)) -> TokenResponse:
    return service.login(request)


@router.get("/me", response_model=UserIdentityResponse)
def read_me(service: AuthService = Depends(get_auth_service)) -> UserIdentityResponse:
    return service.get_current_user()
