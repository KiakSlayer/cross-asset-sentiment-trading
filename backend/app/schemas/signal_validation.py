from __future__ import annotations

from pydantic import BaseModel

from app.schemas.common import ValidationStatus


class SignalValidationRequest(BaseModel):
    signal_id: str


class SignalValidationResponse(BaseModel):
    signal_id: str
    validation_status: ValidationStatus
    information_coefficient: float
    ic_threshold: float
