from __future__ import annotations

from fastapi import APIRouter, Depends

from app.api.deps import get_system_health_service
from app.schemas.system_health import SystemHealthResponse
from app.services.system_health_service import SystemHealthService

router = APIRouter()


@router.get("/", response_model=SystemHealthResponse)
def get_system_health(
    service: SystemHealthService = Depends(get_system_health_service),
) -> SystemHealthResponse:
    return service.get_system_health()
