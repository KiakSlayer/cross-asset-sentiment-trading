from __future__ import annotations

from pydantic import BaseModel


class AssetRelationshipResponse(BaseModel):
    relationship_id: str
    leader_asset: str
    lagger_asset: str
    regime: str
    validation_status: str
