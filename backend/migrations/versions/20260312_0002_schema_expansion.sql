BEGIN;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'text_source_type') THEN
        CREATE TYPE text_source_type AS ENUM ('news', 'tweet', 'macro', 'filing', 'blog', 'other');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'opportunity_status') THEN
        CREATE TYPE opportunity_status AS ENUM ('candidate', 'published', 'expired', 'executed', 'suppressed');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'audit_action') THEN
        CREATE TYPE audit_action AS ENUM ('create', 'update', 'delete', 'status_change', 'bot_gating');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS text_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_type text_source_type NOT NULL,
    external_event_id VARCHAR(128),
    published_at TIMESTAMPTZ,
    ingested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    language VARCHAR(16),
    title TEXT,
    body TEXT,
    source_author VARCHAR(160),
    source_url VARCHAR(512),
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_text_events_source_external_id UNIQUE (source_type, external_event_id)
);
CREATE INDEX IF NOT EXISTS ix_text_events_source_published ON text_events(source_type, published_at DESC);

CREATE TABLE IF NOT EXISTS market_data_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_symbol VARCHAR(32) NOT NULL,
    timeframe VARCHAR(16) NOT NULL,
    market_timestamp TIMESTAMPTZ NOT NULL,
    open_price NUMERIC(20, 8) NOT NULL,
    high_price NUMERIC(20, 8) NOT NULL,
    low_price NUMERIC(20, 8) NOT NULL,
    close_price NUMERIC(20, 8) NOT NULL,
    volume NUMERIC(24, 8),
    data_source VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_market_data_records_symbol_timeframe_ts_source UNIQUE (asset_symbol, timeframe, market_timestamp, data_source),
    CONSTRAINT ck_market_data_hl_order CHECK (high_price >= low_price)
);
CREATE INDEX IF NOT EXISTS ix_market_data_records_symbol_ts ON market_data_records(asset_symbol, market_timestamp DESC);

CREATE TABLE IF NOT EXISTS sector_relevance_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    text_event_id UUID NOT NULL REFERENCES text_events(id) ON DELETE CASCADE,
    sector_code VARCHAR(64) NOT NULL,
    relevance_score NUMERIC(10, 6) NOT NULL,
    scoring_method VARCHAR(128) NOT NULL,
    model_version VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_sector_relevance_text_sector_model UNIQUE (text_event_id, sector_code, model_version),
    CONSTRAINT ck_sector_relevance_bounds CHECK (relevance_score >= 0 AND relevance_score <= 1)
);
CREATE INDEX IF NOT EXISTS ix_sector_relevance_sector ON sector_relevance_scores(sector_code);

CREATE TABLE IF NOT EXISTS sector_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    strategy_id UUID NOT NULL REFERENCES strategies(id) ON DELETE CASCADE,
    sector_code VARCHAR(64) NOT NULL,
    prediction_time TIMESTAMPTZ NOT NULL,
    horizon_hours INTEGER NOT NULL,
    predicted_return NUMERIC(12, 6),
    predicted_direction VARCHAR(16),
    confidence_score NUMERIC(10, 6),
    model_version VARCHAR(64) NOT NULL,
    feature_snapshot JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_sector_prediction_horizon_positive CHECK (horizon_hours > 0),
    CONSTRAINT ck_sector_prediction_confidence_bounds CHECK (confidence_score IS NULL OR (confidence_score >= 0 AND confidence_score <= 1))
);
CREATE INDEX IF NOT EXISTS ix_sector_predictions_strategy_time ON sector_predictions(strategy_id, prediction_time DESC);

ALTER TABLE sentiment_events
    ADD COLUMN IF NOT EXISTS text_event_id UUID,
    ADD COLUMN IF NOT EXISTS target_asset VARCHAR(32),
    ADD COLUMN IF NOT EXISTS target_sector VARCHAR(64);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_sentiment_events_text_event_id_text_events'
    ) THEN
        ALTER TABLE sentiment_events
            ADD CONSTRAINT fk_sentiment_events_text_event_id_text_events
            FOREIGN KEY (text_event_id)
            REFERENCES text_events(id)
            ON DELETE SET NULL;
    END IF;
END $$;

UPDATE sentiment_events
SET target_asset = COALESCE(target_asset, asset_symbol)
WHERE target_asset IS NULL;

ALTER TABLE sentiment_events
    DROP CONSTRAINT IF EXISTS ck_sentiment_event_target_required;

ALTER TABLE sentiment_events
    ADD CONSTRAINT ck_sentiment_event_target_required
    CHECK (target_asset IS NOT NULL OR target_sector IS NOT NULL);

CREATE INDEX IF NOT EXISTS ix_sentiment_events_target_time ON sentiment_events(target_asset, target_sector, event_time DESC);

ALTER TABLE forward_test_runs
    ADD COLUMN IF NOT EXISTS baseline_backtest_run_id UUID,
    ADD COLUMN IF NOT EXISTS start_date TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS end_date TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS realized_return NUMERIC(12, 6),
    ADD COLUMN IF NOT EXISTS realized_sharpe NUMERIC(10, 6),
    ADD COLUMN IF NOT EXISTS drawdown NUMERIC(10, 6),
    ADD COLUMN IF NOT EXISTS divergence_from_backtest NUMERIC(10, 6),
    ADD COLUMN IF NOT EXISTS rolling_information_coefficient NUMERIC(10, 6),
    ADD COLUMN IF NOT EXISTS eligibility_status eligibility_status NOT NULL DEFAULT 'pending_forward_test';

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_forward_test_runs_baseline_backtest_run_id_backtest_runs'
    ) THEN
        ALTER TABLE forward_test_runs
            ADD CONSTRAINT fk_forward_test_runs_baseline_backtest_run_id_backtest_runs
            FOREIGN KEY (baseline_backtest_run_id)
            REFERENCES backtest_runs(id)
            ON DELETE SET NULL;
    END IF;
END $$;

UPDATE forward_test_runs
SET
    start_date = COALESCE(start_date, forward_start),
    end_date = COALESCE(end_date, forward_end),
    realized_return = COALESCE(realized_return, observed_return_pct),
    drawdown = COALESCE(drawdown, observed_max_drawdown_pct),
    eligibility_status = CASE
        WHEN COALESCE(pass_status::text, 'pending') = 'passed' THEN 'eligible'::eligibility_status
        WHEN pass_status::text = 'failed' THEN 'ineligible'::eligibility_status
        WHEN pass_status::text = 'suppressed' THEN 'suspended'::eligibility_status
        ELSE COALESCE(eligibility_status, 'pending_forward_test'::eligibility_status)
    END;

ALTER TABLE forward_test_runs
    ALTER COLUMN start_date SET NOT NULL,
    ALTER COLUMN end_date SET NOT NULL;

ALTER TABLE forward_test_runs
    DROP CONSTRAINT IF EXISTS ck_forward_runs_time_order;

ALTER TABLE forward_test_runs
    ADD CONSTRAINT ck_forward_runs_time_order CHECK (start_date < end_date),
    ADD CONSTRAINT ck_forward_runs_rolling_ic_bounds CHECK (
        rolling_information_coefficient IS NULL
        OR (rolling_information_coefficient >= -1 AND rolling_information_coefficient <= 1)
    );

CREATE INDEX IF NOT EXISTS ix_forward_test_runs_strategy_eligibility ON forward_test_runs(strategy_id, eligibility_status);

ALTER TABLE signals
    ADD COLUMN IF NOT EXISTS source_event_id UUID,
    ADD COLUMN IF NOT EXISTS target_asset VARCHAR(32),
    ADD COLUMN IF NOT EXISTS target_sector VARCHAR(64),
    ADD COLUMN IF NOT EXISTS suppression_reason TEXT;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_signals_source_event_id_text_events'
    ) THEN
        ALTER TABLE signals
            ADD CONSTRAINT fk_signals_source_event_id_text_events
            FOREIGN KEY (source_event_id)
            REFERENCES text_events(id)
            ON DELETE SET NULL;
    END IF;
END $$;

UPDATE signals
SET
    target_asset = COALESCE(target_asset, asset_symbol),
    suppression_reason = COALESCE(suppression_reason, suppressed_reason)
WHERE target_asset IS NULL OR suppression_reason IS NULL;

ALTER TABLE signals
    DROP CONSTRAINT IF EXISTS ck_signal_target_required;

ALTER TABLE signals
    ADD CONSTRAINT ck_signal_target_required CHECK (target_asset IS NOT NULL OR target_sector IS NOT NULL);

CREATE TABLE IF NOT EXISTS opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    signal_id UUID NOT NULL UNIQUE REFERENCES signals(id) ON DELETE CASCADE,
    strategy_id UUID NOT NULL REFERENCES strategies(id) ON DELETE CASCADE,
    status opportunity_status NOT NULL DEFAULT 'candidate',
    what_was_observed TEXT NOT NULL,
    what_was_inferred TEXT NOT NULL,
    uncertainty TEXT NOT NULL,
    published_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    suppression_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_opportunities_status_published ON opportunities(status, published_at DESC);

ALTER TABLE bot_settings
    ALTER COLUMN forward_test_gate_status TYPE eligibility_status
    USING CASE
        WHEN forward_test_gate_status::text = 'passed' THEN 'eligible'::eligibility_status
        WHEN forward_test_gate_status::text = 'failed' THEN 'ineligible'::eligibility_status
        WHEN forward_test_gate_status::text = 'suppressed' THEN 'suspended'::eligibility_status
        ELSE 'pending_forward_test'::eligibility_status
    END;

ALTER TABLE bot_settings
    DROP CONSTRAINT IF EXISTS ck_bot_autonomous_requires_forward_pass,
    DROP CONSTRAINT IF EXISTS ck_bot_autonomous_requires_strategy_eligibility,
    DROP CONSTRAINT IF EXISTS ck_bot_autonomous_requires_monitor;

ALTER TABLE bot_settings
    ADD CONSTRAINT ck_bot_autonomous_requires_forward_pass CHECK (
        activation_status <> 'autonomous'
        OR requires_forward_test_pass = FALSE
        OR forward_test_gate_status = 'eligible'
    ),
    ADD CONSTRAINT ck_bot_autonomous_requires_strategy_eligibility CHECK (
        activation_status <> 'autonomous'
        OR strategy_eligibility_status_snapshot = 'eligible'
    ),
    ADD CONSTRAINT ck_bot_autonomous_requires_monitor CHECK (
        activation_status <> 'autonomous'
        OR has_degradation_monitor = TRUE
    );

ALTER TABLE model_degradation_tracking
    ADD COLUMN IF NOT EXISTS signal_id UUID,
    ADD COLUMN IF NOT EXISTS suspension_recommended BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS suspension_reason TEXT;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_model_degradation_tracking_signal_id_signals'
    ) THEN
        ALTER TABLE model_degradation_tracking
            ADD CONSTRAINT fk_model_degradation_tracking_signal_id_signals
            FOREIGN KEY (signal_id)
            REFERENCES signals(id)
            ON DELETE SET NULL;
    END IF;
END $$;

ALTER TABLE model_degradation_tracking
    DROP CONSTRAINT IF EXISTS uq_model_degradation_snapshot;

ALTER TABLE model_degradation_tracking
    ADD CONSTRAINT uq_model_degradation_snapshot UNIQUE (
        strategy_id,
        signal_id,
        model_version,
        measurement_time,
        metric_name
    );

CREATE INDEX IF NOT EXISTS ix_model_degradation_signal_time ON model_degradation_tracking(signal_id, measurement_time DESC);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    entity_type VARCHAR(64) NOT NULL,
    entity_id UUID,
    action audit_action NOT NULL,
    change_summary TEXT,
    before_state JSONB,
    after_state JSONB,
    request_id VARCHAR(128),
    context JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_audit_logs_entity ON audit_logs(entity_type, entity_id, created_at DESC);
CREATE INDEX IF NOT EXISTS ix_audit_logs_actor ON audit_logs(actor_user_id, created_at DESC);

CREATE OR REPLACE FUNCTION enforce_opportunity_signal_gate() RETURNS TRIGGER AS $$
DECLARE
    v_validation_status validation_status;
    v_information_coefficient NUMERIC;
    v_ic_threshold NUMERIC;
    v_passed_ic_threshold BOOLEAN;
    v_strategy_id UUID;
BEGIN
    SELECT s.validation_status, s.information_coefficient, s.strategy_id
    INTO v_validation_status, v_information_coefficient, v_strategy_id
    FROM signals s
    WHERE s.id = NEW.signal_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Signal % does not exist.', NEW.signal_id;
    END IF;

    IF v_validation_status <> 'passed' THEN
        RAISE EXCEPTION 'Opportunity must reference a signal with validation_status=passed.';
    END IF;

    SELECT svm.ic_threshold, svm.passed_ic_threshold
    INTO v_ic_threshold, v_passed_ic_threshold
    FROM signal_validation_metadata svm
    WHERE svm.signal_id = NEW.signal_id;

    IF NOT FOUND OR v_passed_ic_threshold IS DISTINCT FROM TRUE OR v_information_coefficient < v_ic_threshold THEN
        RAISE EXCEPTION 'Opportunity signal failed IC threshold validation.';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM model_degradation_tracking mdt
        WHERE mdt.strategy_id = v_strategy_id
          AND (mdt.signal_id IS NULL OR mdt.signal_id = NEW.signal_id)
          AND mdt.suspension_recommended = TRUE
          AND mdt.resolved_at IS NULL
    ) THEN
        RAISE EXCEPTION 'Opportunity blocked by active model degradation suspension.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_opportunity_signal_gate ON opportunities;
CREATE TRIGGER trg_opportunity_signal_gate
BEFORE INSERT OR UPDATE ON opportunities
FOR EACH ROW
EXECUTE FUNCTION enforce_opportunity_signal_gate();

CREATE OR REPLACE VIEW opportunity_feed_eligible_signals AS
SELECT
    s.id AS signal_id,
    s.strategy_id,
    s.target_asset,
    s.target_sector,
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
  AND s.information_coefficient >= svm.ic_threshold
  AND NOT EXISTS (
      SELECT 1
      FROM model_degradation_tracking mdt
      WHERE mdt.strategy_id = s.strategy_id
        AND (mdt.signal_id IS NULL OR mdt.signal_id = s.id)
        AND mdt.suspension_recommended = TRUE
        AND mdt.resolved_at IS NULL
  );

COMMENT ON VIEW opportunity_feed_eligible_signals IS
'Feed-eligible signals only: passed validation, above IC threshold, and not suspended by degradation monitor.';

COMMIT;
