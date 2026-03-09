from __future__ import annotations

from enum import Enum


class RiskLevel(str, Enum):
    CONSERVATIVE = "conservative"
    BALANCED = "balanced"
    GROWTH = "growth"
    AGGRESSIVE = "aggressive"


class ValidationStatus(str, Enum):
    PENDING = "pending"
    PASSED = "passed"
    FAILED = "failed"
    SUPPRESSED = "suppressed"


class RunStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    PASSED = "passed"
    FAILED = "failed"
    CANCELED = "canceled"


class RegimeType(str, Enum):
    BULL = "bull"
    BEAR = "bear"
    SIDEWAYS = "sideways"
    VOLATILE = "volatile"
    STRESSED = "stressed"
    UNKNOWN = "unknown"


class EligibilityStatus(str, Enum):
    INELIGIBLE = "ineligible"
    PENDING_FORWARD_TEST = "pending_forward_test"
    ELIGIBLE = "eligible"
    SUSPENDED = "suspended"


class BotActivationStatus(str, Enum):
    DISABLED = "disabled"
    PAPER_TRADING = "paper_trading"
    AUTONOMOUS = "autonomous"


class TradeSide(str, Enum):
    BUY = "buy"
    SELL = "sell"


class TradeStatus(str, Enum):
    PENDING = "pending"
    FILLED = "filled"
    CANCELED = "canceled"
    REJECTED = "rejected"


class PositionStatus(str, Enum):
    OPEN = "open"
    CLOSED = "closed"


class DegradationStatus(str, Enum):
    HEALTHY = "healthy"
    WARNING = "warning"
    DEGRADED = "degraded"
    HALTED = "halted"
