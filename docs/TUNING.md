# Tuning Workflow

The tuning system runs parameter sweeps for interval/window/z-threshold combinations and records strategy metrics.

## Run tuning

```bash
python tuning/tuner.py
```

## Typical custom run

```bash
python tuning/tuner.py \
  --intervals 5m 15m \
  --windows 30 60 90 \
  --z-entries 1.5 2.0 2.5 \
  --z-exits 0.3 0.5 \
  --period 7d \
  --output tuning_results.csv
```

## Outputs

- `tuning/tuning_results.csv`
- `tuning/top_configurations.csv`
- `tuning/tuning_summary.csv`
- `analysis/tuning_analysis.ipynb` for exploration/visualization

## Suggested interpretation

Prioritize configurations that balance:
- high Sharpe ratio,
- manageable drawdown,
- sufficient trade count,
- consistency across tested pairs/conditions.
