from __future__ import annotations

from app.schemas.common import ForwardTestStatus
from app.schemas.forward_testing import ForwardTestStartRequest, ForwardTestStatusResponse


class ForwardTestingService:
    """Forward testing service scaffold used for autonomous-trading gating."""

    def start_forward_test(self, request: ForwardTestStartRequest) -> ForwardTestStatusResponse:
        return ForwardTestStatusResponse(
            run_id="placeholder-forward-run",
            strategy_id=request.strategy_id,
            status=ForwardTestStatus.NOT_STARTED,
        )

    def get_status(self, run_id: str) -> ForwardTestStatusResponse:
        return ForwardTestStatusResponse(
            run_id=run_id,
            strategy_id="placeholder-strategy-id",
            status=ForwardTestStatus.NOT_STARTED,
        )
