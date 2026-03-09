from __future__ import annotations


class DomainValidationError(Exception):
    """Raised when a domain guardrail or validation contract fails."""


class AuthorizationError(Exception):
    """Raised when authentication or authorization requirements are unmet."""
