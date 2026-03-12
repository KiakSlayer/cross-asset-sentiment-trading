from __future__ import annotations

"""Relational models for the Cross-Asset Sentiment-Driven trading platform.

This schema is designed to preserve auditability for user-facing outputs, with
explicit fields for confidence, validation evidence, and suppression reasons.
"""

import uuid
from typing import Any

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    DateTime,
    Enum as SAEnum,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, TimestampMixin
from .enums import (
    AuditAction,
    BotActivationStatus,
    DegradationStatus,
    EligibilityStatus,
    OpportunityStatus,
    PositionStatus,
    RegimeType,
    RiskLevel,
    RunStatus,
    TextSourceType,
    TradeSide,
    TradeStatus,
    ValidationStatus,
)


class User(TimestampMixin, Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(320), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="true")

    profile: Mapped["UserProfile"] = relationship(back_populates="user", uselist=False)
    risk_suitability: Mapped["RiskSuitability"] = relationship(back_populates="user", uselist=False)


class UserProfile(TimestampMixin, Base):
    __tablename__ = "user_profiles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    display_name: Mapped[str | None] = mapped_column(String(120), nullable=True)
    timezone: Mapped[str] = mapped_column(String(64), nullable=False, server_default="UTC")
    experience_level: Mapped[str] = mapped_column(String(32), nullable=False, server_default="beginner")

    user: Mapped["User"] = relationship(back_populates="profile")


class RiskSuitability(TimestampMixin, Base):
    __tablename__ = "risk_suitability"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    risk_level: Mapped[RiskLevel] = mapped_column(SAEnum(RiskLevel, name="risk_level"), nullable=False)
    max_portfolio_drawdown_pct: Mapped[float] = mapped_column(Numeric(7, 4), nullable=False)
    max_single_position_pct: Mapped[float] = mapped_column(Numeric(7, 4), nullable=False)
    daily_loss_limit_pct: Mapped[float] = mapped_column(Numeric(7, 4), nullable=False)
    assessment_method: Mapped[str] = mapped_column(String(128), nullable=False)
    assessment_version: Mapped[str | None] = mapped_column(String(64), nullable=True)
    assessment_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    label_audit_basis: Mapped[str] = mapped_column(Text, nullable=False)
    suppression_conditions: Mapped[str] = mapped_column(Text, nullable=False)
    effective_from: Mapped[Any] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    expires_at: Mapped[Any | None] = mapped_column(DateTime(timezone=True), nullable=True)

    user: Mapped["User"] = relationship(back_populates="risk_suitability")

    __table_args__ = (
        CheckConstraint(
            "max_portfolio_drawdown_pct >= 0 AND max_portfolio_drawdown_pct <= 1",
            name="risk_drawdown_bounds",
        ),
        CheckConstraint(
            "max_single_position_pct >= 0 AND max_single_position_pct <= 1",
            name="risk_position_bounds",
        ),
        CheckConstraint(
            "daily_loss_limit_pct >= 0 AND daily_loss_limit_pct <= 1",
            name="risk_daily_loss_bounds",
        ),
    )


class Strategy(TimestampMixin, Base):
    __tablename__ = "strategies"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    universe: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False, server_default="{}")
    regime_filter: Mapped[RegimeType] = mapped_column(
        SAEnum(RegimeType, name="regime_type"), nullable=False, server_default=RegimeType.UNKNOWN.value
    )
    min_required_ic: Mapped[float] = mapped_column(Numeric(8, 6), nullable=False, server_default="0")
    autonomous_eligibility_status: Mapped[EligibilityStatus] = mapped_column(
        SAEnum(EligibilityStatus, name="eligibility_status"),
        nullable=False,
        server_default=EligibilityStatus.PENDING_FORWARD_TEST.value,
    )
    autonomous_eligibility_reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    eligible_after_forward_test_run_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(
            "forward_test_runs.id",
            use_alter=True,
            name="fk_strategies_eligible_after_forward_test_run_id_forward_test_runs",
        ),
        nullable=True,
    )
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="true")

    __table_args__ = (
        UniqueConstraint("owner_user_id", "name", name="uq_strategies_owner_name"),
        CheckConstraint("min_required_ic >= -1 AND min_required_ic <= 1", name="strategy_min_ic_bounds"),
    )


class MarketDataRecord(TimestampMixin, Base):
    __tablename__ = "market_data_records"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    asset_symbol: Mapped[str] = mapped_column(String(32), nullable=False)
    timeframe: Mapped[str] = mapped_column(String(16), nullable=False)
    market_timestamp: Mapped[Any] = mapped_column(DateTime(timezone=True), nullable=False)
    open_price: Mapped[float] = mapped_column(Numeric(20, 8), nullable=False)
    high_price: Mapped[float] = mapped_column(Numeric(20, 8), nullable=False)
    low_price: Mapped[float] = mapped_column(Numeric(20, 8), nullable=False)
    close_price: Mapped[float] = mapped_column(Numeric(20, 8), nullable=False)
    volume: Mapped[float | None] = mapped_column(Numeric(24, 8), nullable=True)
    data_source: Mapped[str] = mapped_column(String(64), nullable=False)

    __table_args__ = (
        UniqueConstraint(
            "asset_symbol",
            "timeframe",
            "market_timestamp",
            "data_source",
            name="uq_market_data_records_symbol_timeframe_ts_source",
        ),
        CheckConstraint("high_price >= low_price", name="market_data_hl_order"),
        Index("ix_market_data_records_symbol_ts", "asset_symbol", "market_timestamp"),
    )


class TextEvent(TimestampMixin, Base):
    __tablename__ = "text_events"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source_type: Mapped[TextSourceType] = mapped_column(
        SAEnum(TextSourceType, name="text_source_type"), nullable=False
    )
    external_event_id: Mapped[str | None] = mapped_column(String(128), nullable=True)
    published_at: Mapped[Any | None] = mapped_column(DateTime(timezone=True), nullable=True)
    ingested_at: Mapped[Any] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())
    language: Mapped[str | None] = mapped_column(String(16), nullable=True)
    title: Mapped[str | None] = mapped_column(Text, nullable=True)
    body: Mapped[str | None] = mapped_column(Text, nullable=True)
    source_author: Mapped[str | None] = mapped_column(String(160), nullable=True)
    source_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    event_metadata: Mapped[dict[str, Any] | None] = mapped_column("metadata", JSONB, nullable=True)

    __table_args__ = (
        UniqueConstraint("source_type", "external_event_id", name="uq_text_events_source_external_id"),
        Index("ix_text_events_source_published", "source_type", "published_at"),
    )


class SentimentEvent(TimestampMixin, Base):
    __tablename__ = "sentiment_events"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    text_event_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("text_events.id", ondelete="SET NULL"), nullable=True
    )
    target_asset: Mapped[str | None] = mapped_column(String(32), nullable=True)
    target_sector: Mapped[str | None] = mapped_column(String(64), nullable=True)
    event_time: Mapped[Any] = mapped_column(DateTime(timezone=True), nullable=False)
    raw_sentiment_score: Mapped[float] = mapped_column(Numeric(10, 6), nullable=False)
    normalized_sentiment_score: Mapped[float] = mapped_column(Numeric(10, 6), nullable=False)
    event_confidence_score: Mapped[float | None] = mapped_column(Numeric(10, 6), nullable=True)
    event_information_coefficient: Mapped[float | None] = mapped_column(Numeric(10, 6), nullable=True)
    validation_status: Mapped[ValidationStatus] = mapped_column(
        SAEnum(ValidationStatus, name="validation_status"), nullable=False
    )
    regime_context: Mapped[RegimeType] = mapped_column(SAEnum(RegimeType, name="regime_type"), nullable=False)

    __table_args__ = (
        CheckConstraint(
            "target_asset IS NOT NULL OR target_sector IS NOT NULL",
            name="sentiment_event_target_required",
        ),
        CheckConstraint(
            "raw_sentiment_score >= -1 AND raw_sentiment_score <= 1",
            name="sentiment_raw_bounds",
        ),
        CheckConstraint(
            "normalized_sentiment_score >= -1 AND normalized_sentiment_score <= 1",
            name="sentiment_norm_bounds",
        ),
        CheckConstraint(
            "event_confidence_score IS NULL OR (event_confidence_score >= 0 AND event_confidence_score <= 1)",
            name="sentiment_confidence_bounds",
        ),
        Index("ix_sentiment_events_target_time", "target_asset", "target_sector", "event_time"),
    )


class SectorRelevanceScore(TimestampMixin, Base):
    __tablename__ = "sector_relevance_scores"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    text_event_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("text_events.id", ondelete="CASCADE"), nullable=False
    )
    sector_code: Mapped[str] = mapped_column(String(64), nullable=False)
    relevance_score: Mapped[float] = mapped_column(Numeric(10, 6), nullable=False)
    scoring_method: Mapped[str] = mapped_column(String(128), nullable=False)
    model_version: Mapped[str] = mapped_column(String(64), nullable=False)

    __table_args__ = (
        UniqueConstraint(
            "text_event_id",
            "sector_code",
            "model_version",
            name="uq_sector_relevance_text_sector_model",
        ),
        CheckConstraint("relevance_score >= 0 AND relevance_score <= 1", name="sector_relevance_bounds"),
        Index("ix_sector_relevance_sector", "sector_code"),
    )


class SectorPrediction(TimestampMixin, Base):
    __tablename__ = "sector_predictions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    strategy_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("strategies.id", ondelete="CASCADE"), nullable=False
    )
    sector_code: Mapped[str] = mapped_column(String(64), nullable=False)
    prediction_time: Mapped[Any] = mapped_column(DateTime(timezone=True), nullable=False)
    horizon_hours: Mapped[int] = mapped_column(Integer, nullable=False)
    predicted_return: Mapped[float | None] = mapped_column(Numeric(12, 6), nullable=True)
    predicted_direction: Mapped[str | None] = mapped_column(String(16), nullable=True)
    confidence_score: Mapped[float | None] = mapped_column(Numeric(10, 6), nullable=True)
    model_version: Mapped[str] = mapped_column(String(64), nullable=False)
    feature_snapshot: Mapped[dict[str, Any] | None] = mapped_column(JSONB, nullable=True)

    __table_args__ = (
        CheckConstraint("horizon_hours > 0", name="sector_prediction_horizon_positive"),
        CheckConstraint(
            "confidence_score IS NULL OR (confidence_score >= 0 AND confidence_score <= 1)",
            name="sector_prediction_confidence_bounds",
        ),
        Index("ix_sector_predictions_strategy_time", "strategy_id", "prediction_time"),
    )

class BacktestRun(TimestampMixin, Base):
    __tablename__ = "backtest_runs"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    strategy_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("strategies.id", ondelete="CASCADE"), nullable=False
    )
    triggered_by_user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    run_status: Mapped[RunStatus] = mapped_column(
        SAEnum(RunStatus, name="run_status"), nullable=False, server_default=RunStatus.PENDING.value
    )
    walk_forward_config: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False)
    in_sample_start: Mapped[Any] = mapped_column(DateTime(timezone=True), nullable=False)
    in_sample_end: Mapped[Any] = mapped_column(DateTime(timezone=True), nullable=False)
    out_of_sample_start: Mapped[Any] = mapped_column(DateTime(timezone=True), nullable=False)
    out_of_sample_end: Mapped[Any] = mapped_column(DateTime(timezone=True), nullable=False)
    total_return_pct: Mapped[float | None] = mapped_column(Numeric(12, 6), nullable=True)
    sharpe_ratio: Mapped[float | None] = mapped_column(Numeric(10, 6), nullable=True)
    max_drawdown_pct: Mapped[float | None] = mapped_column(Numeric(10, 6), nullable=True)
    validation_summary: Mapped[dict[str, Any] | None] = mapped_column(JSONB, nullable=True)
    started_at: Mapped[Any | None] = mapped_column(DateTime(timezone=True), nullable=True)
    ended_at: Mapped[Any | None] = mapped_column(DateTime(timezone=True), nullable=True)

    __table_args__ = (
        CheckConstraint("in_sample_start < in_sample_end", name="backtest_in_sample_order"),
        CheckConstraint("out_of_sample_start < out_of_sample_end", name="backtest_oos_order"),
        CheckConstraint("in_sample_end <= out_of_sample_start", name="backtest_no_leakage"),
    )


class ForwardTestRun(TimestampMixin, Base):
    __tablename__ = "forward_test_runs"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    strategy_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("strategies.id", ondelete="CASCADE"), nullable=False
    )
    baseline_backtest_run_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("backtest_runs.id", ondelete="SET NULL"), nullable=True
    )
    triggered_by_user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    run_status: Mapped[RunStatus] = mapped_column(
        SAEnum(RunStatus, name="run_status"), nullable=False, server_default=RunStatus.PENDING.value
    )
    environment: Mapped[str] = mapped_column(String(32), nullable=False, server_default="paper")
    start_date: Mapped[Any] = mapped_column(DateTime(timezone=True), nullable=False)
    end_date: Mapped[Any] = mapped_column(DateTime(timezone=True), nullable=False)
    realized_return: Mapped[float | None] = mapped_column(Numeric(12, 6), nullable=True)
    realized_sharpe: Mapped[float | None] = mapped_column(Numeric(10, 6), nullable=True)
    drawdown: Mapped[float | None] = mapped_column(Numeric(10, 6), nullable=True)
    divergence_from_backtest: Mapped[float | None] = mapped_column(Numeric(10, 6), nullable=True)
    rolling_information_coefficient: Mapped[float | None] = mapped_column(Numeric(10, 6), nullable=True)
    eligibility_status: Mapped[EligibilityStatus] = mapped_column(
        SAEnum(EligibilityStatus, name="eligibility_status"),
        nullable=False,
        server_default=EligibilityStatus.PENDING_FORWARD_TEST.value,
    )
    pass_criteria: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False)
    decision_reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    started_at: Mapped[Any | None] = mapped_column(DateTime(timezone=True), nullable=True)
    ended_at: Mapped[Any | None] = mapped_column(DateTime(timezone=True), nullable=True)

    __table_args__ = (
        CheckConstraint("start_date < end_date", name="forward_time_order"),
        CheckConstraint(
            "rolling_information_coefficient IS NULL OR (rolling_information_coefficient >= -1 AND rolling_information_coefficient <= 1)",
            name="forward_rolling_ic_bounds",
        ),
    )


class Signal(TimestampMixin, Base):
    __tablename__ = "signals"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    strategy_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("strategies.id", ondelete="CASCADE"), nullable=False
    )
    source_event_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("text_events.id", ondelete="SET NULL"), nullable=True
    )
    backtest_run_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("backtest_runs.id", ondelete="SET NULL"), nullable=True
    )
    forward_test_run_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("forward_test_runs.id", ondelete="SET NULL"), nullable=True
    )
    target_asset: Mapped[str | None] = mapped_column(String(32), nullable=True)
    target_sector: Mapped[str | None] = mapped_column(String(64), nullable=True)
    signal_direction: Mapped[str] = mapped_column(String(16), nullable=False)
    signal_strength: Mapped[float] = mapped_column(Numeric(12, 6), nullable=False)
    generation_method: Mapped[str] = mapped_column(String(160), nullable=False)
    in_sample_period: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False)
    out_of_sample_result: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False)
    information_coefficient: Mapped[float] = mapped_column(Numeric(12, 6), nullable=False)
    calibration_score: Mapped[float] = mapped_column(Numeric(12, 6), nullable=False)
    validation_status: Mapped[ValidationStatus] = mapped_column(
        SAEnum(ValidationStatus, name="validation_status"), nullable=False
    )
    confidence_label: Mapped[str | None] = mapped_column(String(40), nullable=True)
    confidence_score: Mapped[float | None] = mapped_column(Numeric(12, 6), nullable=True)
    confidence_audit_basis: Mapped[str | None] = mapped_column(Text, nullable=True)
    recommendation_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    recommendation_audit_basis: Mapped[str | None] = mapped_column(Text, nullable=True)
    uncertainty_note: Mapped[str | None] = mapped_column(Text, nullable=True)
    generated_at: Mapped[Any] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())
    expires_at: Mapped[Any | None] = mapped_column(DateTime(timezone=True), nullable=True)
    suppression_reason: Mapped[str | None] = mapped_column(Text, nullable=True)

    __table_args__ = (
        CheckConstraint(
            "backtest_run_id IS NULL OR forward_test_run_id IS NULL",
            name="signal_single_test_source",
        ),
        CheckConstraint(
            "target_asset IS NOT NULL OR target_sector IS NOT NULL",
            name="signal_target_required",
        ),
        CheckConstraint(
            "information_coefficient >= -1 AND information_coefficient <= 1",
            name="signal_ic_bounds",
        ),
        CheckConstraint("calibration_score >= 0 AND calibration_score <= 1", name="signal_calibration_bounds"),
        CheckConstraint(
            "confidence_score IS NULL OR (confidence_score >= 0 AND confidence_score <= 1)",
            name="signal_confidence_bounds",
        ),
        Index("ix_signals_feed_filter", "validation_status", "information_coefficient", "generated_at"),
    )


class SignalValidationMetadata(TimestampMixin, Base):
    __tablename__ = "signal_validation_metadata"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    signal_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("signals.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )
    validator_version: Mapped[str] = mapped_column(String(64), nullable=False)
    ic_threshold: Mapped[float] = mapped_column(Numeric(12, 6), nullable=False)
    ic_window_observations: Mapped[int] = mapped_column(Integer, nullable=False)
    passed_ic_threshold: Mapped[bool] = mapped_column(Boolean, nullable=False)
    calibration_method: Mapped[str] = mapped_column(String(128), nullable=False)
    calibration_dataset_period: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False)
    historical_validation_summary: Mapped[str] = mapped_column(Text, nullable=False)
    statistical_test_name: Mapped[str | None] = mapped_column(String(128), nullable=True)
    p_value: Mapped[float | None] = mapped_column(Numeric(12, 8), nullable=True)
    confidence_interval_low: Mapped[float | None] = mapped_column(Numeric(12, 8), nullable=True)
    confidence_interval_high: Mapped[float | None] = mapped_column(Numeric(12, 8), nullable=True)
    validation_artifact_uri: Mapped[str | None] = mapped_column(String(512), nullable=True)
    is_walk_forward_only: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="true")
    suppression_conditions: Mapped[str] = mapped_column(Text, nullable=False)
    validated_at: Mapped[Any] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())

    __table_args__ = (
        CheckConstraint("ic_threshold >= -1 AND ic_threshold <= 1", name="signal_meta_ic_threshold_bounds"),
        CheckConstraint("ic_window_observations > 0", name="signal_meta_window_positive"),
        CheckConstraint(
            "p_value IS NULL OR (p_value >= 0 AND p_value <= 1)",
            name="signal_meta_p_value_bounds",
        ),
    )


class Opportunity(TimestampMixin, Base):
    __tablename__ = "opportunities"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    signal_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("signals.id", ondelete="CASCADE"), nullable=False, unique=True
    )
    strategy_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("strategies.id", ondelete="CASCADE"), nullable=False
    )
    status: Mapped[OpportunityStatus] = mapped_column(
        SAEnum(OpportunityStatus, name="opportunity_status"),
        nullable=False,
        server_default=OpportunityStatus.CANDIDATE.value,
    )
    what_was_observed: Mapped[str] = mapped_column(Text, nullable=False)
    what_was_inferred: Mapped[str] = mapped_column(Text, nullable=False)
    uncertainty: Mapped[str] = mapped_column(Text, nullable=False)
    published_at: Mapped[Any | None] = mapped_column(DateTime(timezone=True), nullable=True)
    expires_at: Mapped[Any | None] = mapped_column(DateTime(timezone=True), nullable=True)
    suppression_reason: Mapped[str | None] = mapped_column(Text, nullable=True)

    __table_args__ = (
        Index("ix_opportunities_status_published", "status", "published_at"),
    )

class AssetRelationship(TimestampMixin, Base):
    __tablename__ = "asset_relationships"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    asset_a_symbol: Mapped[str] = mapped_column(String(32), nullable=False)
    asset_b_symbol: Mapped[str] = mapped_column(String(32), nullable=False)
    relationship_type: Mapped[str] = mapped_column(String(64), nullable=False)
    regime: Mapped[RegimeType] = mapped_column(SAEnum(RegimeType, name="regime_type"), nullable=False)
    window_start: Mapped[Any] = mapped_column(DateTime(timezone=True), nullable=False)
    window_end: Mapped[Any] = mapped_column(DateTime(timezone=True), nullable=False)
    rolling_window_days: Mapped[int] = mapped_column(Integer, nullable=False)
    correlation_value: Mapped[float | None] = mapped_column(Numeric(12, 6), nullable=True)
    lead_lag_minutes: Mapped[int | None] = mapped_column(Integer, nullable=True)
    cointegration_p_value: Mapped[float | None] = mapped_column(Numeric(12, 8), nullable=True)
    stability_score: Mapped[float | None] = mapped_column(Numeric(12, 6), nullable=True)
    validation_status: Mapped[ValidationStatus] = mapped_column(
        SAEnum(ValidationStatus, name="validation_status"), nullable=False
    )
    observation_count: Mapped[int] = mapped_column(Integer, nullable=False)
    validated_at: Mapped[Any] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())
    suppression_reason: Mapped[str | None] = mapped_column(Text, nullable=True)

    __table_args__ = (
        UniqueConstraint(
            "asset_a_symbol",
            "asset_b_symbol",
            "relationship_type",
            "regime",
            "window_end",
            name="uq_asset_relationship_window",
        ),
        CheckConstraint("window_start < window_end", name="asset_relationship_window_order"),
        CheckConstraint("rolling_window_days > 0", name="asset_relationship_window_positive"),
        CheckConstraint(
            "correlation_value IS NULL OR (correlation_value >= -1 AND correlation_value <= 1)",
            name="asset_relationship_corr_bounds",
        ),
        CheckConstraint(
            "cointegration_p_value IS NULL OR (cointegration_p_value >= 0 AND cointegration_p_value <= 1)",
            name="asset_relationship_p_value_bounds",
        ),
        Index("ix_asset_relationships_lookup", "asset_a_symbol", "asset_b_symbol", "regime", "window_end"),
    )


class Portfolio(TimestampMixin, Base):
    __tablename__ = "portfolios"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    base_currency: Mapped[str] = mapped_column(String(16), nullable=False, server_default="USD")
    starting_capital: Mapped[float] = mapped_column(Numeric(18, 4), nullable=False)
    current_equity: Mapped[float] = mapped_column(Numeric(18, 4), nullable=False)
    status: Mapped[str] = mapped_column(String(32), nullable=False, server_default="active")

    __table_args__ = (
        UniqueConstraint("user_id", "name", name="uq_portfolios_user_name"),
    )


class Position(TimestampMixin, Base):
    __tablename__ = "positions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    portfolio_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("portfolios.id", ondelete="CASCADE"), nullable=False
    )
    strategy_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("strategies.id", ondelete="SET NULL"), nullable=True
    )
    asset_symbol: Mapped[str] = mapped_column(String(32), nullable=False)
    side: Mapped[str] = mapped_column(String(8), nullable=False)
    quantity: Mapped[float] = mapped_column(Numeric(20, 8), nullable=False)
    average_entry_price: Mapped[float] = mapped_column(Numeric(20, 8), nullable=False)
    current_price: Mapped[float | None] = mapped_column(Numeric(20, 8), nullable=True)
    unrealized_pnl: Mapped[float | None] = mapped_column(Numeric(20, 8), nullable=True)
    realized_pnl: Mapped[float | None] = mapped_column(Numeric(20, 8), nullable=True)
    status: Mapped[PositionStatus] = mapped_column(
        SAEnum(PositionStatus, name="position_status"), nullable=False, server_default=PositionStatus.OPEN.value
    )
    opened_at: Mapped[Any] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())
    closed_at: Mapped[Any | None] = mapped_column(DateTime(timezone=True), nullable=True)
    risk_label: Mapped[str | None] = mapped_column(String(40), nullable=True)
    risk_label_audit_basis: Mapped[str | None] = mapped_column(Text, nullable=True)
    risk_suppression_conditions: Mapped[str | None] = mapped_column(Text, nullable=True)

    __table_args__ = (
        CheckConstraint("quantity > 0", name="position_quantity_positive"),
        CheckConstraint(
            "side IN ('long', 'short')",
            name="position_side_values",
        ),
        Index("ix_positions_portfolio_status", "portfolio_id", "status"),
    )


class Trade(TimestampMixin, Base):
    __tablename__ = "trades"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    portfolio_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("portfolios.id", ondelete="CASCADE"), nullable=False
    )
    position_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("positions.id", ondelete="SET NULL"), nullable=True
    )
    strategy_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("strategies.id", ondelete="SET NULL"), nullable=True
    )
    signal_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("signals.id", ondelete="SET NULL"), nullable=True
    )
    side: Mapped[TradeSide] = mapped_column(SAEnum(TradeSide, name="trade_side"), nullable=False)
    order_type: Mapped[str] = mapped_column(String(32), nullable=False)
    status: Mapped[TradeStatus] = mapped_column(
        SAEnum(TradeStatus, name="trade_status"), nullable=False, server_default=TradeStatus.PENDING.value
    )
    asset_symbol: Mapped[str] = mapped_column(String(32), nullable=False)
    quantity: Mapped[float] = mapped_column(Numeric(20, 8), nullable=False)
    price: Mapped[float] = mapped_column(Numeric(20, 8), nullable=False)
    notional_value: Mapped[float] = mapped_column(Numeric(20, 8), nullable=False)
    fee_paid: Mapped[float | None] = mapped_column(Numeric(20, 8), nullable=True)
    executed_at: Mapped[Any | None] = mapped_column(DateTime(timezone=True), nullable=True)
    external_order_id: Mapped[str | None] = mapped_column(String(128), nullable=True)
    execution_notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    __table_args__ = (
        CheckConstraint("quantity > 0", name="trade_quantity_positive"),
        CheckConstraint("price > 0", name="trade_price_positive"),
        CheckConstraint("notional_value >= 0", name="trade_notional_non_negative"),
        Index("ix_trades_portfolio_executed", "portfolio_id", "executed_at"),
        Index("ix_trades_strategy_status", "strategy_id", "status"),
    )


class BotSetting(TimestampMixin, Base):
    __tablename__ = "bot_settings"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    strategy_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("strategies.id", ondelete="CASCADE"), nullable=False, unique=True
    )
    owner_user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    activation_status: Mapped[BotActivationStatus] = mapped_column(
        SAEnum(BotActivationStatus, name="bot_activation_status"),
        nullable=False,
        server_default=BotActivationStatus.DISABLED.value,
    )
    requires_forward_test_pass: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="true")
    forward_test_gate_status: Mapped[EligibilityStatus] = mapped_column(
        SAEnum(EligibilityStatus, name="eligibility_status"),
        nullable=False,
        server_default=EligibilityStatus.PENDING_FORWARD_TEST.value,
    )
    strategy_eligibility_status_snapshot: Mapped[EligibilityStatus] = mapped_column(
        SAEnum(EligibilityStatus, name="eligibility_status"),
        nullable=False,
        server_default=EligibilityStatus.PENDING_FORWARD_TEST.value,
    )
    has_degradation_monitor: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="true")
    max_daily_trades: Mapped[int] = mapped_column(Integer, nullable=False, server_default="5")
    max_position_size_pct: Mapped[float] = mapped_column(Numeric(7, 4), nullable=False, server_default="0.10")
    hard_stop_loss_pct: Mapped[float] = mapped_column(Numeric(7, 4), nullable=False, server_default="0.03")
    max_total_drawdown_pct: Mapped[float] = mapped_column(Numeric(7, 4), nullable=False, server_default="0.15")
    last_activation_check_at: Mapped[Any | None] = mapped_column(DateTime(timezone=True), nullable=True)
    last_activated_at: Mapped[Any | None] = mapped_column(DateTime(timezone=True), nullable=True)
    deactivated_reason: Mapped[str | None] = mapped_column(Text, nullable=True)

    __table_args__ = (
        CheckConstraint("max_daily_trades >= 0", name="bot_daily_trades_non_negative"),
        CheckConstraint(
            "max_position_size_pct >= 0 AND max_position_size_pct <= 1",
            name="bot_position_pct_bounds",
        ),
        CheckConstraint(
            "hard_stop_loss_pct >= 0 AND hard_stop_loss_pct <= 1",
            name="bot_stop_loss_bounds",
        ),
        CheckConstraint(
            "max_total_drawdown_pct >= 0 AND max_total_drawdown_pct <= 1",
            name="bot_drawdown_bounds",
        ),
        CheckConstraint(
            "activation_status <> 'autonomous' OR requires_forward_test_pass = false OR forward_test_gate_status = 'eligible'",
            name="bot_autonomous_requires_forward_pass",
        ),
        CheckConstraint(
            "activation_status <> 'autonomous' OR strategy_eligibility_status_snapshot = 'eligible'",
            name="bot_autonomous_requires_strategy_eligibility",
        ),
        CheckConstraint(
            "activation_status <> 'autonomous' OR has_degradation_monitor = true",
            name="bot_autonomous_requires_monitor",
        ),
    )


class BotExecutionLog(TimestampMixin, Base):
    __tablename__ = "bot_execution_logs"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    bot_setting_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("bot_settings.id", ondelete="CASCADE"), nullable=False
    )
    strategy_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("strategies.id", ondelete="CASCADE"), nullable=False
    )
    forward_test_run_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("forward_test_runs.id", ondelete="SET NULL"), nullable=True
    )
    execution_time: Mapped[Any] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())
    execution_mode: Mapped[BotActivationStatus] = mapped_column(
        SAEnum(BotActivationStatus, name="bot_activation_status"), nullable=False
    )
    action: Mapped[str] = mapped_column(String(64), nullable=False)
    outcome_status: Mapped[RunStatus] = mapped_column(SAEnum(RunStatus, name="run_status"), nullable=False)
    risk_checks_passed: Mapped[bool] = mapped_column(Boolean, nullable=False)
    risk_check_details: Mapped[dict[str, Any] | None] = mapped_column(JSONB, nullable=True)
    order_count: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")
    details: Mapped[dict[str, Any] | None] = mapped_column(JSONB, nullable=True)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)

    __table_args__ = (
        CheckConstraint("order_count >= 0", name="bot_log_order_count_non_negative"),
        Index("ix_bot_execution_logs_strategy_time", "strategy_id", "execution_time"),
    )


class ModelDegradationTracking(TimestampMixin, Base):
    __tablename__ = "model_degradation_tracking"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    strategy_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("strategies.id", ondelete="CASCADE"), nullable=False
    )
    signal_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("signals.id", ondelete="SET NULL"), nullable=True
    )
    model_version: Mapped[str] = mapped_column(String(64), nullable=False)
    measurement_time: Mapped[Any] = mapped_column(DateTime(timezone=True), nullable=False)
    metric_name: Mapped[str] = mapped_column(String(128), nullable=False)
    metric_value: Mapped[float] = mapped_column(Numeric(14, 6), nullable=False)
    baseline_value: Mapped[float] = mapped_column(Numeric(14, 6), nullable=False)
    degradation_threshold: Mapped[float] = mapped_column(Numeric(14, 6), nullable=False)
    degradation_ratio: Mapped[float | None] = mapped_column(Numeric(14, 6), nullable=True)
    status: Mapped[DegradationStatus] = mapped_column(
        SAEnum(DegradationStatus, name="degradation_status"),
        nullable=False,
        server_default=DegradationStatus.HEALTHY.value,
    )
    suspension_recommended: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="false")
    suspension_reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_blocking: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="false")
    recommended_action: Mapped[str | None] = mapped_column(Text, nullable=True)
    resolved_at: Mapped[Any | None] = mapped_column(DateTime(timezone=True), nullable=True)

    __table_args__ = (
        UniqueConstraint(
            "strategy_id",
            "signal_id",
            "model_version",
            "measurement_time",
            "metric_name",
            name="uq_model_degradation_snapshot",
        ),
        Index("ix_model_degradation_strategy_time", "strategy_id", "measurement_time"),
        Index("ix_model_degradation_signal_time", "signal_id", "measurement_time"),
    )


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    actor_user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    entity_type: Mapped[str] = mapped_column(String(64), nullable=False)
    entity_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), nullable=True)
    action: Mapped[AuditAction] = mapped_column(SAEnum(AuditAction, name="audit_action"), nullable=False)
    change_summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    before_state: Mapped[dict[str, Any] | None] = mapped_column(JSONB, nullable=True)
    after_state: Mapped[dict[str, Any] | None] = mapped_column(JSONB, nullable=True)
    request_id: Mapped[str | None] = mapped_column(String(128), nullable=True)
    context: Mapped[dict[str, Any] | None] = mapped_column(JSONB, nullable=True)
    created_at: Mapped[Any] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())

    __table_args__ = (
        Index("ix_audit_logs_entity", "entity_type", "entity_id", "created_at"),
        Index("ix_audit_logs_actor", "actor_user_id", "created_at"),
    )
