from __future__ import annotations

from sqlalchemy.orm import Session


class BaseRepository:
    """Base repository with a request-scoped SQLAlchemy session."""

    def __init__(self, db: Session | None = None) -> None:
        self.db = db
