from __future__ import annotations

from app.services.asset_relationship_service import AssetRelationshipService
from app.services.auth_service import AuthService
from app.services.backtesting_service import BacktestingService
from app.services.bot_control_service import BotControlService
from app.services.forward_testing_service import ForwardTestingService
from app.services.historical_ingestion_service import HistoricalIngestionService
from app.services.model_degradation_service import ModelDegradationService
from app.services.opportunity_feed_service import OpportunityFeedService
from app.services.portfolio_service import PortfolioService
from app.services.sector_relevance_service import SectorRelevanceService
from app.services.sentiment_event_service import SentimentEventService
from app.services.signal_service import SignalService
from app.services.signal_validation_service import SignalValidationService
from app.services.strategy_service import StrategyService
from app.services.system_health_service import SystemHealthService
from app.services.trade_position_service import TradePositionService
from app.services.user_profile_service import UserProfileService


def get_auth_service() -> AuthService:
    return AuthService()


def get_user_profile_service() -> UserProfileService:
    return UserProfileService()


def get_strategy_service() -> StrategyService:
    return StrategyService()


def get_historical_ingestion_service() -> HistoricalIngestionService:
    return HistoricalIngestionService()


def get_sector_relevance_service() -> SectorRelevanceService:
    return SectorRelevanceService()


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


def get_portfolio_service() -> PortfolioService:
    return PortfolioService()


def get_trade_position_service() -> TradePositionService:
    return TradePositionService()


def get_bot_control_service() -> BotControlService:
    return BotControlService()


def get_model_degradation_service() -> ModelDegradationService:
    return ModelDegradationService()


def get_system_health_service() -> SystemHealthService:
    return SystemHealthService()
