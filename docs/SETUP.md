# Setup

## Requirements

- Python 3.8+
- pip
- Internet access for Binance / Yahoo data pulls

## Core install

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Optional tuning install

```bash
pip install -r tuning/requirements.txt
```

## Verification

```bash
python -c "import pandas, numpy, scipy, statsmodels; print('core dependencies ok')"
python main_crossasset_poc.py --help
python tuning/tuner.py --help
```

## Optional legacy streaming stack

If you need Kafka-based legacy components in `legacy/`:

```bash
docker-compose up -d
```
