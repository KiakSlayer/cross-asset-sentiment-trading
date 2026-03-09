# Architecture

## Core modules

- `core/data_fetcher.py`: Fetches and aligns multi-source market data.
- `core/correlation_analyzer.py`: Correlation and lead-lag diagnostics.
- `core/crossasset_leadlag_model.py`: Z-score signal logic.
- `core/backtester.py`: Trade simulation and metrics.
- `core/visualizer.py`: Plots/reports for strategy output.

## Orchestration

- `main_crossasset_poc.py` coordinates the full workflow from data pull to backtest.

## Research and historical areas

- `analysis/`: notebooks for exploratory research.
- `tuning/`: sweep tooling + output artifacts.
- `legacy/`: old or one-off scripts retained for reference.
- `archive/docs_legacy/`: old documentation retained for traceability.
