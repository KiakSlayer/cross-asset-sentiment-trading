from __future__ import annotations

from fastapi import FastAPI

from app.api.v1.router import api_router
from app.core.config import get_settings
from app.core.logging import configure_logging


def create_app() -> FastAPI:
    """Create and configure the FastAPI application instance."""

    settings = get_settings()
    configure_logging(settings.app_env, settings.app_debug)

    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        debug=settings.app_debug,
    )

    @app.get("/health", tags=["system"])
    def health_check() -> dict[str, str]:
        return {"status": "ok"}

    app.include_router(api_router, prefix=settings.api_v1_prefix)
    return app


app = create_app()
