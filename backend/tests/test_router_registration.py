from app.main import app


def test_required_v1_routes_registered() -> None:
    paths = {route.path for route in app.routes}

    expected_prefixes = [
        "/api/v1/auth",
        "/api/v1/strategies",
        "/api/v1/backtesting",
        "/api/v1/forward-testing",
        "/api/v1/signals",
        "/api/v1/signal-validation",
        "/api/v1/sentiment-events",
        "/api/v1/asset-relationships",
        "/api/v1/opportunities",
        "/api/v1/bot-control",
        "/api/v1/model-degradation",
    ]

    for prefix in expected_prefixes:
        assert any(path.startswith(prefix) for path in paths), f"Missing route prefix: {prefix}"
