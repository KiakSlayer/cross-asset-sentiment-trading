"""Compatibility wrapper for notebooks/scripts that import `backtester` from repo root."""

from core.backtester import BacktestConfig, Backtester, PerformanceMetrics

__all__ = ["BacktestConfig", "Backtester", "PerformanceMetrics"]
