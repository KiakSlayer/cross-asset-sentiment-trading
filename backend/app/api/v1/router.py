from __future__ import annotations

from fastapi import APIRouter

from app.api.v1.endpoints import (
    asset_relationships,
    auth,
    backtesting,
    bot_control,
    forward_testing,
    model_degradation,
    opportunity_feed,
    sentiment_events,
    signal_validation,
    signals,
    strategies,
)

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(strategies.router, prefix="/strategies", tags=["strategies"])
api_router.include_router(backtesting.router, prefix="/backtesting", tags=["backtesting"])
api_router.include_router(forward_testing.router, prefix="/forward-testing", tags=["forward-testing"])
api_router.include_router(signals.router, prefix="/signals", tags=["signals"])
api_router.include_router(signal_validation.router, prefix="/signal-validation", tags=["signal-validation"])
api_router.include_router(sentiment_events.router, prefix="/sentiment-events", tags=["sentiment-events"])
api_router.include_router(asset_relationships.router, prefix="/asset-relationships", tags=["asset-relationships"])
api_router.include_router(opportunity_feed.router, prefix="/opportunities", tags=["opportunity-feed"])
api_router.include_router(bot_control.router, prefix="/bot-control", tags=["bot-control"])
api_router.include_router(model_degradation.router, prefix="/model-degradation", tags=["model-degradation"])
