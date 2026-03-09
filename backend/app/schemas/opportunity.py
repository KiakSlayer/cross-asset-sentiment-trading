from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel

from app.schemas.common import AuditBasis, ConfidenceLabel, ValidationStatus


class OpportunityFeedItem(BaseModel):
    """Opportunity item shown in the user feed after governance filters pass."""

    opportunity_id: str
    strategy_id: str
    asset_symbol: str
    validation_status: ValidationStatus
    information_coefficient: float
    confidence_label: ConfidenceLabel
    audit_basis: AuditBasis
    observed: str
    inferred: str
    uncertainty: str
    created_at: datetime
