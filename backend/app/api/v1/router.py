from __future__ import annotations

from fastapi import APIRouter

from app.api.v1.endpoints import (
    asset_relationships,
    auth,
    backtesting,
    bot_control,
    forward_testing,
    historical_ingestion,
    model_degradation,
    opportunity_feed,
    portfolios,
    sector_relevance,
    sentiment_events,
    signal_validation,
    signals,
    strategies,
    system_health,
    trades_positions,
    users_profiles,
)

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users_profiles.router, prefix="/users", tags=["users-profiles"])
api_router.include_router(strategies.router, prefix="/strategies", tags=["strategies"])
api_router.include_router(historical_ingestion.router, prefix="/historical-ingestion", tags=["historical-ingestion"])
api_router.include_router(sentiment_events.router, prefix="/sentiment-events", tags=["sentiment-events"])
api_router.include_router(sector_relevance.router, prefix="/sector-relevance", tags=["sector-relevance"])
api_router.include_router(signals.router, prefix="/signals", tags=["signals"])
api_router.include_router(signal_validation.router, prefix="/signal-validation", tags=["signal-validation"])
api_router.include_router(backtesting.router, prefix="/backtesting", tags=["backtesting"])
api_router.include_router(forward_testing.router, prefix="/forward-testing", tags=["forward-testing"])
api_router.include_router(opportunity_feed.router, prefix="/opportunities", tags=["opportunity-feed"])
api_router.include_router(portfolios.router, prefix="/portfolios", tags=["portfolios"])
api_router.include_router(trades_positions.router, prefix="/trades-positions", tags=["trades-positions"])
api_router.include_router(asset_relationships.router, prefix="/asset-relationships", tags=["asset-relationships"])
api_router.include_router(bot_control.router, prefix="/bot-control", tags=["bot-control"])
api_router.include_router(model_degradation.router, prefix="/model-degradation", tags=["model-degradation"])
api_router.include_router(system_health.router, prefix="/system-health", tags=["system-health"])
