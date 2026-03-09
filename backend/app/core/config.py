from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    app_name: str = "Cross-Asset Sentiment-Driven Systematic Trading Platform API"
    app_env: str = "development"
    app_debug: bool = False
    app_version: str = "0.1.0"
    api_v1_prefix: str = "/api/v1"

    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/crossasset_trading"

    jwt_secret_key: str = "change-me"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    ic_threshold: float = 0.05
    allow_autonomous_trading: bool = False
    require_forward_test_pass: bool = True
    require_degradation_monitor_health: bool = True

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return a cached settings instance for dependency reuse."""

    return Settings()
