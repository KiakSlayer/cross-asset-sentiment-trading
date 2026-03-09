from __future__ import annotations

from pydantic import BaseModel

from app.schemas.common import ForwardTestStatus


class BotActivationRequest(BaseModel):
    strategy_id: str
    enable_autonomous: bool
    forward_test_status: ForwardTestStatus
    risk_profile_id: str | None = None
    risk_controls_configured: bool = False


class BotActivationDecision(BaseModel):
    strategy_id: str
    activation_allowed: bool
    reason: str


class BotStatusResponse(BaseModel):
    strategy_id: str
    autonomous_enabled: bool
    guardrails_active: bool
