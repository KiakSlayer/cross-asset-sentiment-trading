from __future__ import annotations

from collections.abc import Iterable

from app.core.config import get_settings
from app.schemas.common import ValidationStatus
from app.schemas.opportunity import OpportunityFeedItem


class OpportunityFeedService:
    """Opportunity feed service scaffold with gating policy enforcement."""

    def list_eligible_opportunities(
        self,
        candidates: Iterable[OpportunityFeedItem],
    ) -> list[OpportunityFeedItem]:
        """Filter opportunities to those eligible for user-facing display.

        how the score is computed: Confidence and opportunity inclusion are
        based on the precomputed signal confidence label and IC measurements.
        what historical validation supports it: Candidates are expected to carry
        walk-forward and forward-testing audit references in `audit_basis`.
        what conditions would cause it to be suppressed: Exclude opportunities
        when `validation_status` is not `passed` or IC is below configured threshold.
        """

        settings = get_settings()
        min_ic = settings.ic_threshold
        return [
            item
            for item in candidates
            if item.validation_status == ValidationStatus.PASSED
            and item.information_coefficient >= min_ic
        ]
