from __future__ import annotations

from datetime import datetime, timezone

from app.schemas.system_health import HealthComponent, SystemHealthResponse


class SystemHealthService:
    """System health and logging visibility service scaffold."""

    def get_system_health(self) -> SystemHealthResponse:
        return SystemHealthResponse(
            checked_at=datetime.now(timezone.utc),
            overall_status="ok",
            components=[
                HealthComponent(name="api", status="ok", detail="API scaffold is running."),
                HealthComponent(name="db", status="unknown", detail="Connectivity checks not implemented."),
                HealthComponent(name="logging", status="ok", detail="Logging scaffold configured."),
            ],
        )
