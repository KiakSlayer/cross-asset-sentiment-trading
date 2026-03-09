from __future__ import annotations

import logging


def configure_logging(environment: str, debug: bool) -> None:
    """Configure application logging with environment-aware defaults."""

    level = logging.DEBUG if debug else logging.INFO
    logging.basicConfig(
        level=level,
        format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
    )
    logging.getLogger("uvicorn.access").setLevel(level)
    logging.getLogger(__name__).debug("Logging configured for %s", environment)
