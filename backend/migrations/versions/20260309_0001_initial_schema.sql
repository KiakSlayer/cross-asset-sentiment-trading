BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'risk_level') THEN
        CREATE TYPE risk_level AS ENUM ('conservative', 'balanced', 'growth', 'aggressive');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'validation_status') THEN
        CREATE TYPE validation_status AS ENUM ('pending', 'passed', 'failed', 'suppressed');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'run_status') THEN
        CREATE TYPE run_status AS ENUM ('pending', 'running', 'passed', 'failed', 'canceled');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'regime_type') THEN
        CREATE TYPE regime_type AS ENUM ('bull', 'bear', 'sideways', 'volatile', 'stressed', 'unknown');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'eligibility_status') THEN
        CREATE TYPE eligibility_status AS ENUM ('ineligible', 'pending_forward_test', 'eligible', 'suspended');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'bot_activation_status') THEN
        CREATE TYPE bot_activation_status AS ENUM ('disabled', 'paper_trading', 'autonomous');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'trade_side') THEN
        CREATE TYPE trade_side AS ENUM ('buy', 'sell');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'trade_status') THEN
        CREATE TYPE trade_status AS ENUM ('pending', 'filled', 'canceled', 'rejected');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'position_status') THEN
        CREATE TYPE position_status AS ENUM ('open', 'closed');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'degradation_status') THEN
        CREATE TYPE degradation_status AS ENUM ('healthy', 'warning', 'degraded', 'halted');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(320) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(120),
    timezone VARCHAR(64) NOT NULL DEFAULT 'UTC',
    experience_level VARCHAR(32) NOT NULL DEFAULT 'beginner',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS risk_suitability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    risk_level risk_level NOT NULL,
    max_portfolio_drawdown_pct NUMERIC(7, 4) NOT NULL CHECK (max_portfolio_drawdown_pct >= 0 AND max_portfolio_drawdown_pct <= 1),
    max_single_position_pct NUMERIC(7, 4) NOT NULL CHECK (max_single_position_pct >= 0 AND max_single_position_pct <= 1),
    daily_loss_limit_pct NUMERIC(7, 4) NOT NULL CHECK (daily_loss_limit_pct >= 0 AND daily_loss_limit_pct <= 1),
    assessment_method VARCHAR(128) NOT NULL,
    assessment_version VARCHAR(64),
    assessment_notes TEXT,
    label_audit_basis TEXT NOT NULL,
    suppression_conditions TEXT NOT NULL,
    effective_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS strategies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(160) NOT NULL,
    description TEXT,
    universe JSONB NOT NULL DEFAULT '{}'::jsonb,
    regime_filter regime_type NOT NULL DEFAULT 'unknown',
    min_required_ic NUMERIC(8, 6) NOT NULL DEFAULT 0,
    autonomous_eligibility_status eligibility_status NOT NULL DEFAULT 'pending_forward_test',
    autonomous_eligibility_reason TEXT,
    eligible_after_forward_test_run_id UUID,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_strategies_owner_name UNIQUE (owner_user_id, name),
    CONSTRAINT ck_strategies_min_required_ic CHECK (min_required_ic >= -1 AND min_required_ic <= 1)
);

CREATE TABLE IF NOT EXISTS backtest_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    strategy_id UUID NOT NULL REFERENCES strategies(id) ON DELETE CASCADE,
    triggered_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    run_status run_status NOT NULL DEFAULT 'pending',
    walk_forward_config JSONB NOT NULL,
    in_sample_start TIMESTAMPTZ NOT NULL,
    in_sample_end TIMESTAMPTZ NOT NULL,
    out_of_sample_start TIMESTAMPTZ NOT NULL,
    out_of_sample_end TIMESTAMPTZ NOT NULL,
    total_return_pct NUMERIC(12, 6),
    sharpe_ratio NUMERIC(10, 6),
    max_drawdown_pct NUMERIC(10, 6),
    validation_summary JSONB,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_backtest_in_sample_order CHECK (in_sample_start < in_sample_end),
    CONSTRAINT ck_backtest_oos_order CHECK (out_of_sample_start < out_of_sample_end),
    CONSTRAINT ck_backtest_no_leakage CHECK (in_sample_end <= out_of_sample_start)
);
CREATE INDEX IF NOT EXISTS ix_backtest_runs_strategy_status ON backtest_runs(strategy_id, run_status);

CREATE TABLE IF NOT EXISTS forward_test_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    strategy_id UUID NOT NULL REFERENCES strategies(id) ON DELETE CASCADE,
    triggered_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    run_status run_status NOT NULL DEFAULT 'pending',
    environment VARCHAR(32) NOT NULL DEFAULT 'paper',
    forward_start TIMESTAMPTZ NOT NULL,
    forward_end TIMESTAMPTZ NOT NULL,
    observed_return_pct NUMERIC(12, 6),
    observed_max_drawdown_pct NUMERIC(10, 6),
    pass_criteria JSONB NOT NULL,
    pass_status validation_status NOT NULL DEFAULT 'pending',
    decision_reason TEXT,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_forward_runs_time_order CHECK (forward_start < forward_end)
);
CREATE INDEX IF NOT EXISTS ix_forward_test_runs_strategy_pass_status ON forward_test_runs(strategy_id, pass_status);

ALTER TABLE strategies
    ADD CONSTRAINT fk_strategies_forward_test_gate
    FOREIGN KEY (eligible_after_forward_test_run_id)
    REFERENCES forward_test_runs(id)
    ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    strategy_id UUID NOT NULL REFERENCES strategies(id) ON DELETE CASCADE,
    backtest_run_id UUID REFERENCES backtest_runs(id) ON DELETE SET NULL,
    forward_test_run_id UUID REFERENCES forward_test_runs(id) ON DELETE SET NULL,
    asset_symbol VARCHAR(32) NOT NULL,
    signal_direction VARCHAR(16) NOT NULL,
    signal_strength NUMERIC(12, 6) NOT NULL,
    generation_method VARCHAR(160) NOT NULL,
    in_sample_period JSONB NOT NULL,
    out_of_sample_result JSONB NOT NULL,
    information_coefficient NUMERIC(12, 6) NOT NULL,
    calibration_score NUMERIC(12, 6) NOT NULL,
    validation_status validation_status NOT NULL,
    confidence_label VARCHAR(40),
    confidence_score NUMERIC(12, 6),
    confidence_audit_basis TEXT,
    recommendation_text TEXT,
    recommendation_audit_basis TEXT,
    uncertainty_note TEXT,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    suppressed_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_signal_single_source CHECK (backtest_run_id IS NULL OR forward_test_run_id IS NULL),
    CONSTRAINT ck_signal_ic_bounds CHECK (information_coefficient >= -1 AND information_coefficient <= 1),
    CONSTRAINT ck_signal_calibration_bounds CHECK (calibration_score >= 0 AND calibration_score <= 1),
    CONSTRAINT ck_signal_confidence_bounds CHECK (confidence_score IS NULL OR (confidence_score >= 0 AND confidence_score <= 1))
);
CREATE INDEX IF NOT EXISTS ix_signals_strategy_time ON signals(strategy_id, generated_at DESC);
CREATE INDEX IF NOT EXISTS ix_signals_feed_filter ON signals(validation_status, information_coefficient, generated_at DESC);

CREATE TABLE IF NOT EXISTS signal_validation_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    signal_id UUID NOT NULL UNIQUE REFERENCES signals(id) ON DELETE CASCADE,
    validator_version VARCHAR(64) NOT NULL,
    ic_threshold NUMERIC(12, 6) NOT NULL,
    ic_window_observations INTEGER NOT NULL CHECK (ic_window_observations > 0),
    passed_ic_threshold BOOLEAN NOT NULL,
    calibration_method VARCHAR(128) NOT NULL,
    calibration_dataset_period JSONB NOT NULL,
    historical_validation_summary TEXT NOT NULL,
    statistical_test_name VARCHAR(128),
    p_value NUMERIC(12, 8),
    confidence_interval_low NUMERIC(12, 8),
    confidence_interval_high NUMERIC(12, 8),
    validation_artifact_uri VARCHAR(512),
    is_walk_forward_only BOOLEAN NOT NULL DEFAULT TRUE,
    suppression_conditions TEXT NOT NULL,
    validated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_signal_meta_ic_threshold_bounds CHECK (ic_threshold >= -1 AND ic_threshold <= 1),
    CONSTRAINT ck_signal_meta_pvalue_bounds CHECK (p_value IS NULL OR (p_value >= 0 AND p_value <= 1)),
    CONSTRAINT ck_signal_meta_ci_order CHECK (
        confidence_interval_low IS NULL OR confidence_interval_high IS NULL OR confidence_interval_low <= confidence_interval_high
    )
);

CREATE TABLE IF NOT EXISTS sentiment_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_symbol VARCHAR(32) NOT NULL,
    event_time TIMESTAMPTZ NOT NULL,
    source_type VARCHAR(64) NOT NULL,
    source_reference VARCHAR(512),
    headline TEXT,
    raw_sentiment_score NUMERIC(10, 6) NOT NULL CHECK (raw_sentiment_score >= -1 AND raw_sentiment_score <= 1),
    normalized_sentiment_score NUMERIC(10, 6) NOT NULL CHECK (normalized_sentiment_score >= -1 AND normalized_sentiment_score <= 1),
    event_confidence_score NUMERIC(10, 6),
    event_information_coefficient NUMERIC(10, 6),
    validation_status validation_status NOT NULL,
    regime_context regime_type NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_sentiment_confidence_bounds CHECK (event_confidence_score IS NULL OR (event_confidence_score >= 0 AND event_confidence_score <= 1))
);
CREATE INDEX IF NOT EXISTS ix_sentiment_events_asset_time ON sentiment_events(asset_symbol, event_time DESC);

CREATE TABLE IF NOT EXISTS asset_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_a_symbol VARCHAR(32) NOT NULL,
    asset_b_symbol VARCHAR(32) NOT NULL,
    relationship_type VARCHAR(64) NOT NULL,
    regime regime_type NOT NULL,
    window_start TIMESTAMPTZ NOT NULL,
    window_end TIMESTAMPTZ NOT NULL,
    rolling_window_days INTEGER NOT NULL CHECK (rolling_window_days > 0),
    correlation_value NUMERIC(12, 6),
    lead_lag_minutes INTEGER,
    cointegration_p_value NUMERIC(12, 8),
    stability_score NUMERIC(12, 6),
    validation_status validation_status NOT NULL,
    observation_count INTEGER NOT NULL CHECK (observation_count > 0),
    validated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    suppressed_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_asset_rel_window_order CHECK (window_start < window_end),
    CONSTRAINT ck_asset_rel_corr_bounds CHECK (correlation_value IS NULL OR (correlation_value >= -1 AND correlation_value <= 1)),
    CONSTRAINT ck_asset_rel_pvalue_bounds CHECK (cointegration_p_value IS NULL OR (cointegration_p_value >= 0 AND cointegration_p_value <= 1)),
    CONSTRAINT uq_asset_relationship_window UNIQUE (asset_a_symbol, asset_b_symbol, relationship_type, regime, window_end)
);
CREATE INDEX IF NOT EXISTS ix_asset_relationships_lookup ON asset_relationships(asset_a_symbol, asset_b_symbol, regime, window_end DESC);

CREATE TABLE IF NOT EXISTS portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(120) NOT NULL,
    base_currency VARCHAR(16) NOT NULL DEFAULT 'USD',
    starting_capital NUMERIC(18, 4) NOT NULL,
    current_equity NUMERIC(18, 4) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_portfolios_user_name UNIQUE (user_id, name)
);

CREATE TABLE IF NOT EXISTS positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    strategy_id UUID REFERENCES strategies(id) ON DELETE SET NULL,
    asset_symbol VARCHAR(32) NOT NULL,
    side VARCHAR(8) NOT NULL CHECK (side IN ('long', 'short')),
    quantity NUMERIC(20, 8) NOT NULL CHECK (quantity > 0),
    average_entry_price NUMERIC(20, 8) NOT NULL,
    current_price NUMERIC(20, 8),
    unrealized_pnl NUMERIC(20, 8),
    realized_pnl NUMERIC(20, 8),
    status position_status NOT NULL DEFAULT 'open',
    opened_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    closed_at TIMESTAMPTZ,
    risk_label VARCHAR(40),
    risk_label_audit_basis TEXT,
    risk_suppression_conditions TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_positions_portfolio_status ON positions(portfolio_id, status);

CREATE TABLE IF NOT EXISTS trades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    position_id UUID REFERENCES positions(id) ON DELETE SET NULL,
    strategy_id UUID REFERENCES strategies(id) ON DELETE SET NULL,
    signal_id UUID REFERENCES signals(id) ON DELETE SET NULL,
    side trade_side NOT NULL,
    order_type VARCHAR(32) NOT NULL,
    status trade_status NOT NULL DEFAULT 'pending',
    asset_symbol VARCHAR(32) NOT NULL,
    quantity NUMERIC(20, 8) NOT NULL CHECK (quantity > 0),
    price NUMERIC(20, 8) NOT NULL CHECK (price > 0),
    notional_value NUMERIC(20, 8) NOT NULL CHECK (notional_value >= 0),
    fee_paid NUMERIC(20, 8),
    executed_at TIMESTAMPTZ,
    external_order_id VARCHAR(128),
    execution_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_trades_portfolio_executed ON trades(portfolio_id, executed_at DESC);
CREATE INDEX IF NOT EXISTS ix_trades_strategy_status ON trades(strategy_id, status);

CREATE TABLE IF NOT EXISTS bot_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    strategy_id UUID NOT NULL UNIQUE REFERENCES strategies(id) ON DELETE CASCADE,
    owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activation_status bot_activation_status NOT NULL DEFAULT 'disabled',
    requires_forward_test_pass BOOLEAN NOT NULL DEFAULT TRUE,
    forward_test_gate_status validation_status NOT NULL DEFAULT 'pending',
    strategy_eligibility_status_snapshot eligibility_status NOT NULL DEFAULT 'pending_forward_test',
    has_degradation_monitor BOOLEAN NOT NULL DEFAULT TRUE,
    max_daily_trades INTEGER NOT NULL DEFAULT 5 CHECK (max_daily_trades >= 0),
    max_position_size_pct NUMERIC(7, 4) NOT NULL DEFAULT 0.10 CHECK (max_position_size_pct >= 0 AND max_position_size_pct <= 1),
    hard_stop_loss_pct NUMERIC(7, 4) NOT NULL DEFAULT 0.03 CHECK (hard_stop_loss_pct >= 0 AND hard_stop_loss_pct <= 1),
    max_total_drawdown_pct NUMERIC(7, 4) NOT NULL DEFAULT 0.15 CHECK (max_total_drawdown_pct >= 0 AND max_total_drawdown_pct <= 1),
    last_activation_check_at TIMESTAMPTZ,
    last_activated_at TIMESTAMPTZ,
    deactivated_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_bot_autonomous_requires_forward_pass CHECK (
        activation_status <> 'autonomous' OR requires_forward_test_pass = FALSE OR forward_test_gate_status = 'passed'
    ),
    CONSTRAINT ck_bot_autonomous_requires_strategy_eligibility CHECK (
        activation_status <> 'autonomous' OR strategy_eligibility_status_snapshot = 'eligible'
    ),
    CONSTRAINT ck_bot_autonomous_requires_monitor CHECK (
        activation_status <> 'autonomous' OR has_degradation_monitor = TRUE
    )
);

CREATE TABLE IF NOT EXISTS bot_execution_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bot_setting_id UUID NOT NULL REFERENCES bot_settings(id) ON DELETE CASCADE,
    strategy_id UUID NOT NULL REFERENCES strategies(id) ON DELETE CASCADE,
    forward_test_run_id UUID REFERENCES forward_test_runs(id) ON DELETE SET NULL,
    execution_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    execution_mode bot_activation_status NOT NULL,
    action VARCHAR(64) NOT NULL,
    outcome_status run_status NOT NULL,
    risk_checks_passed BOOLEAN NOT NULL,
    risk_check_details JSONB,
    order_count INTEGER NOT NULL DEFAULT 0 CHECK (order_count >= 0),
    details JSONB,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_bot_execution_logs_strategy_time ON bot_execution_logs(strategy_id, execution_time DESC);

CREATE TABLE IF NOT EXISTS model_degradation_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    strategy_id UUID NOT NULL REFERENCES strategies(id) ON DELETE CASCADE,
    model_version VARCHAR(64) NOT NULL,
    measurement_time TIMESTAMPTZ NOT NULL,
    metric_name VARCHAR(128) NOT NULL,
    metric_value NUMERIC(14, 6) NOT NULL,
    baseline_value NUMERIC(14, 6) NOT NULL,
    degradation_threshold NUMERIC(14, 6) NOT NULL,
    degradation_ratio NUMERIC(14, 6),
    status degradation_status NOT NULL DEFAULT 'healthy',
    is_blocking BOOLEAN NOT NULL DEFAULT FALSE,
    recommended_action TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_model_degradation_snapshot UNIQUE (strategy_id, model_version, measurement_time, metric_name)
);
CREATE INDEX IF NOT EXISTS ix_model_degradation_strategy_time ON model_degradation_tracking(strategy_id, measurement_time DESC);

CREATE OR REPLACE VIEW opportunity_feed_eligible_signals AS
SELECT
    s.id,
    s.strategy_id,
    s.asset_symbol,
    s.signal_direction,
    s.signal_strength,
    s.generation_method,
    s.information_coefficient,
    s.calibration_score,
    s.validation_status,
    s.confidence_label,
    s.confidence_score,
    s.recommendation_text,
    s.uncertainty_note,
    s.generated_at,
    svm.ic_threshold,
    svm.passed_ic_threshold,
    svm.historical_validation_summary,
    svm.suppression_conditions
FROM signals s
JOIN signal_validation_metadata svm ON svm.signal_id = s.id
WHERE s.validation_status = 'passed'
  AND svm.passed_ic_threshold = TRUE
  AND s.information_coefficient >= svm.ic_threshold;

COMMENT ON VIEW opportunity_feed_eligible_signals IS
'Only signals with passed validation status and IC above configured threshold are eligible for opportunity feed.';

COMMIT;
