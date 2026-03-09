from __future__ import annotations

from fastapi import APIRouter, Depends

from app.api.deps import get_signal_service
from app.schemas.signal import SignalResponse
from app.services.signal_service import SignalService

router = APIRouter()


@router.get("/", response_model=list[SignalResponse])
def list_signals(service: SignalService = Depends(get_signal_service)) -> list[SignalResponse]:
    return service.list_signals()


@router.get("/{signal_id}", response_model=SignalResponse)
def get_signal(signal_id: str, service: SignalService = Depends(get_signal_service)) -> SignalResponse:
    return service.get_signal(signal_id)
