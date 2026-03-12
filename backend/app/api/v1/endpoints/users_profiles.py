from __future__ import annotations

from fastapi import APIRouter, Depends

from app.api.deps import get_user_profile_service
from app.schemas.user_profile import UserProfileResponse
from app.services.user_profile_service import UserProfileService

router = APIRouter()


@router.get("/me", response_model=UserProfileResponse)
def get_my_profile(
    service: UserProfileService = Depends(get_user_profile_service),
) -> UserProfileResponse:
    return service.get_current_profile()
