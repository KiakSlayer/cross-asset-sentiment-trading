from __future__ import annotations

from datetime import datetime, timezone


def utc_now_iso() -> str:
    """Return a UTC ISO timestamp for logs and lightweight metadata."""

    return datetime.now(timezone.utc).isoformat()
