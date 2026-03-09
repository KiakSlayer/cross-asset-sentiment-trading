from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel

from app.schemas.common import AuditBasis, ConfidenceLabel, ValidationStatus


class SignalResponse(BaseModel):
    signal_id: str
    strategy_id: str
    asset_symbol: str
    validation_status: ValidationStatus
    information_coefficient: float
    confidence_label: ConfidenceLabel
    confidence_score: float
    audit_basis: AuditBasis
    observed: str
    inferred: str
    uncertainty: str
    generated_at: datetime
