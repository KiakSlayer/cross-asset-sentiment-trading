# Backend Scaffold

This folder contains a production-style backend scaffold for the **Cross-Asset Sentiment-Driven Trading Platform**.

## Layered structure

- `app/api/v1/endpoints/`: route handlers grouped by domain
- `app/services/`: business-domain service stubs
- `app/schemas/`: request/response and contract models
- `app/repositories/`: persistence boundary stubs
- `app/models/`: domain model placeholders
- `app/db/`: SQLAlchemy base/session and existing schema models
- `app/core/`: config, security, logging, and exceptions
- `app/utils/`: cross-cutting utility helpers

## Supported backend modules

- authentication
- users and profiles
- strategies
- historical data ingestion
- sentiment events
- sector relevance and propagation
- signals
- signal validation
- backtesting
- forward testing
- opportunities
- portfolios
- trades and positions
- bot control
- model degradation monitoring
- system health and logging

## Architectural guardrails already scaffolded

- Signals domain includes `validation_status` and `information_coefficient` fields (`app/schemas/signal.py`).
- Forward-test gating hooks exist for autonomous eligibility (`app/schemas/bot_control.py`, `app/services/bot_control_service.py`, `app/models/strategy.py`).
- Model degradation interfaces exist before autonomous bot completion (`app/services/model_degradation_service.py`, `app/schemas/model_degradation.py`).
- Audit location for user-facing confidence/risk/recommendation behavior is easy to find in:
  - `app/services/signal_service.py`
  - `app/services/opportunity_feed_service.py`
  - `app/services/bot_control_service.py`
  - `app/utils/confidence_audit.py`

## Existing preserved assets

- `app/db/models.py`
- `app/db/enums.py`
- `migrations/versions/20260309_0001_initial_schema.sql`

## Quick start

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Notes

- This scaffold intentionally excludes business logic implementation.
- Existing non-backend quant modules remain untouched.
