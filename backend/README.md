# Backend Schema Scaffold

This backend contains PostgreSQL-first schema artifacts for the **Cross-Asset Sentiment-Driven Systematic Trading Platform**.

## Schema files

- `app/db/base.py`: SQLAlchemy base + audit timestamp mixin.
- `app/db/enums.py`: shared enum definitions.
- `app/db/models.py`: normalized ORM models for trading lifecycle, NLP/ML outputs, validation, and bot governance.
- `migrations/versions/20260309_0001_initial_schema.sql`: initial schema.
- `migrations/versions/20260312_0002_schema_expansion.sql`: incremental expansion for market/text/sector/opportunity/audit and stronger gating.

## Coverage highlights

- Identity & suitability: users, user_profiles, risk_suitability.
- Strategy lifecycle: strategies, backtest_runs, forward_test_runs, strategy eligibility fields.
- Data ingestion: market_data_records, text_events, sentiment_events.
- NLP/ML outputs: sector_relevance_scores, sector_predictions, signals.
- Validation layer: signal_validation_metadata, opportunity_feed_eligible_signals view.
- Opportunity & execution: opportunities, portfolios, positions, trades.
- Autonomous bot governance: bot_settings, bot_execution_logs.
- Safety monitoring: model_degradation_tracking with strategy/signal suspension flags.
- Auditability: audit_logs.

## Gating design

- Opportunities are insertion-gated by DB trigger (`enforce_opportunity_signal_gate`) to ensure only statistically valid signals (passed validation + IC threshold) are eligible.
- Bot autonomous mode is schema-gated by constraints requiring eligible forward-test status and active degradation monitor.
- Degradation records can flag strategy or strategy+signal scope, and the opportunity feed view excludes active suspensions.

## Assumptions

- PostgreSQL with `pgcrypto` (`gen_random_uuid()`).
- Existing deployments apply migrations in order (`0001` then `0002`).
- `updated_at` default columns are present; update triggers can be added later if strict automatic timestamp mutation is required.
