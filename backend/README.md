# Backend Scaffold

This folder now contains a merged backend scaffold for the **Cross-Asset Sentiment-Driven Systematic Trading Platform**.

## What exists now

- Existing PostgreSQL schema assets (preserved):
  - `app/db/base.py`
  - `app/db/enums.py`
  - `app/db/models.py`
  - `migrations/versions/20260309_0001_initial_schema.sql`
- New FastAPI application scaffold:
  - `app/main.py`
  - `app/core/`
  - `app/api/v1/`
  - `app/schemas/`
  - `app/services/`
  - `app/repositories/`
  - `app/db/session.py`
  - `tests/`

## Guardrails reflected in contracts

- Opportunity feed contract requires:
  - `validation_status == passed`
  - `information_coefficient >= IC_THRESHOLD`
- Bot activation contract requires:
  - forward test status passed for autonomous mode
  - risk controls configured for autonomous mode
- Confidence/recommendation/risk-producing service methods include explicit docstrings for:
  - how score/label is computed
  - historical validation support
  - suppression conditions

## Quick start

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Notes

- This scaffold is intentionally boilerplate-only; business logic is not implemented yet.
- Existing quant research pipeline files outside `backend/` are unchanged.
