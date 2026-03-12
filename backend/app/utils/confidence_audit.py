from __future__ import annotations


def build_audit_pointer(domain: str, artifact_ref: str) -> str:
    """Build a traceable audit pointer for user-facing outputs."""

    return f"{domain}:{artifact_ref}"
