from __future__ import annotations

from fastapi import APIRouter, Depends

from app.api.deps import get_asset_relationship_service
from app.schemas.asset_relationship import AssetRelationshipResponse
from app.services.asset_relationship_service import AssetRelationshipService

router = APIRouter()


@router.get("/", response_model=list[AssetRelationshipResponse])
def list_asset_relationships(
    service: AssetRelationshipService = Depends(get_asset_relationship_service),
) -> list[AssetRelationshipResponse]:
    return service.list_relationships()
