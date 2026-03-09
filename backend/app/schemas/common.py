from __future__ import annotations

from enum import Enum

from pydantic import BaseModel, Field


class ValidationStatus(str, Enum):
    """Validation lifecycle status for any signal or recommendation."""

    PENDING = "pending"
    PASSED = "passed"
    FAILED = "failed"
    SUPPRESSED = "suppressed"


class ForwardTestStatus(str, Enum):
    """Forward-test lifecycle status used to gate autonomous trading."""

    NOT_STARTED = "not_started"
    RUNNING = "running"
    PASSED = "passed"
    FAILED = "failed"


class ConfidenceLabel(str, Enum):
    """User-facing confidence labels calibrated from historical evidence."""

    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class AuditBasis(BaseModel):
    """Audit metadata required for confidence, recommendation, and risk outputs."""

    method: str = Field(..., description="Computation or labeling method identifier.")
    validation_window: str = Field(..., description="Historical period used for validation.")
    evidence_ref: str = Field(..., description="Reference to reproducible validation evidence.")
    suppression_conditions: str = Field(..., description="Conditions that suppress the output.")


class ObservedInferredUncertainty(BaseModel):
    """Plain-language explanation contract for retail-friendly recommendations."""

    observed: str = Field(..., description="What was directly observed in data.")
    inferred: str = Field(..., description="What was inferred from the observation.")
    uncertainty: str = Field(..., description="What uncertainty remains.")
