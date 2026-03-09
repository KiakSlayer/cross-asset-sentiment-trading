from __future__ import annotations

from fastapi import APIRouter, Depends

from app.api.deps import get_forward_testing_service
from app.schemas.forward_testing import ForwardTestStartRequest, ForwardTestStatusResponse
from app.services.forward_testing_service import ForwardTestingService

router = APIRouter()


@router.post("/runs", response_model=ForwardTestStatusResponse)
def start_forward_test(
    request: ForwardTestStartRequest,
    service: ForwardTestingService = Depends(get_forward_testing_service),
) -> ForwardTestStatusResponse:
    return service.start_forward_test(request)


@router.get("/runs/{run_id}", response_model=ForwardTestStatusResponse)
def get_forward_test_status(
    run_id: str,
    service: ForwardTestingService = Depends(get_forward_testing_service),
) -> ForwardTestStatusResponse:
    return service.get_status(run_id)
