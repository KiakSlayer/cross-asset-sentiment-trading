# cross-asset-sentiment-trading

A senior-project repository for **cross-asset lead-lag trading research** across crypto and equity indices.  
The codebase focuses on: data collection, pair analysis, signal generation, and backtesting.

## Project Purpose

This project evaluates whether lead-lag relationships can support statistical arbitrage-style strategies. The core workflow:

1. Fetches crypto and equity price data.
2. Aligns timestamps and computes correlations / lead-lag structure.
3. Generates Z-score mean-reversion signals.
4. Backtests performance with transaction costs.
5. Supports parameter tuning for robustness.

## Repository Structure

```text
.
├── core/                    # Core trading pipeline modules
├── tuning/                  # Parameter sweep utilities and outputs
├── analysis/                # Research notebooks
├── legacy/                  # Historical scripts and prototypes
├── archive/docs_legacy/     # Archived historical writeups / deliverable notes
├── docs/
│   ├── SETUP.md             # Environment and install details
│   ├── TUNING.md            # Tuning workflow guide
│   └── ARCHITECTURE.md      # Module-level architecture overview
├── main_crossasset_poc.py   # Main end-to-end runner
├── backtester.py            # Compatibility import shim -> core.backtester
├── requirements.txt         # Main dependencies
└── docker-compose.yml       # Optional Kafka stack for legacy streaming components
```

## Installation

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

For setup notes and troubleshooting, see `docs/SETUP.md`.

## How to Run

### Main PoC pipeline

```bash
python main_crossasset_poc.py
```

### Example with custom parameters

```bash
python main_crossasset_poc.py --period 7d --interval 5m --window 60 --z-entry 2.0 --z-exit 0.5
```

### Parameter tuning

```bash
pip install -r tuning/requirements.txt
python tuning/tuner.py
```

See `docs/TUNING.md` for tuning options and interpretation.

## Notes on Cleanup

- Historical quickstarts, bugfix logs, and contributor-specific deliverable summaries were moved to `archive/docs_legacy/`.
- One-off comparison script moved to `legacy/`.
- Notebook/editor artifact directories (`.ipynb_checkpoints`, `.vscode`) were removed from tracking and added to `.gitignore`.

This keeps the root directory concise while preserving reproducibility and project history.
