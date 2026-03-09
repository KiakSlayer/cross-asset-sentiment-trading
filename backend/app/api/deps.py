from __future__ import annotations

from app.services.asset_relationship_service import AssetRelationshipService
from app.services.auth_service import AuthService
from app.services.backtesting_service import BacktestingService
from app.services.bot_control_service import BotControlService
from app.services.forward_testing_service import ForwardTestingService
from app.services.model_degradation_service import ModelDegradationService
from app.services.opportunity_feed_service import OpportunityFeedService
from app.services.sentiment_event_service import SentimentEventService
from app.services.signal_service import SignalService
from app.services.signal_validation_service import SignalValidationService
from app.services.strategy_service import StrategyService


def get_auth_service() -> AuthService:
    return AuthService()


def get_strategy_service() -> StrategyService:
    return StrategyService()


def get_backtesting_service() -> BacktestingService:
    return BacktestingService()


def get_forward_testing_service() -> ForwardTestingService:
    return ForwardTestingService()


def get_signal_service() -> SignalService:
    return SignalService()


def get_signal_validation_service() -> SignalValidationService:
    return SignalValidationService()


def get_sentiment_event_service() -> SentimentEventService:
    return SentimentEventService()


def get_asset_relationship_service() -> AssetRelationshipService:
    return AssetRelationshipService()


def get_opportunity_feed_service() -> OpportunityFeedService:
    return OpportunityFeedService()


def get_bot_control_service() -> BotControlService:
    return BotControlService()


def get_model_degradation_service() -> ModelDegradationService:
    return ModelDegradationService()
