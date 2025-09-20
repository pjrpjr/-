from datetime import datetime
from typing import List

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from app.core import state
from app.core.state import utc_now

router = APIRouter(prefix="/api/v1/authorizations", tags=["authorizations"])


class AuthorizationRecord(BaseModel):
    authorization_id: str
    template_id: str
    user_id: str
    tenant_id: str
    status: str = Field("active", description="授权状态")
    usage_limit: int | None = Field(None, description="可用次数上限")
    used: int = Field(0, description="已使用次数")
    valid_from: datetime
    valid_to: datetime


class ImportRequest(BaseModel):
    tenant_id: str
    template_id: str
    entries: List[str] = Field(..., description="授权用户 ID 列表")
    usage_limit: int | None = Field(None, description="次数限制")
    valid_days: int = Field(30, ge=1, le=365)


class ImportResponse(BaseModel):
    template_id: str
    total: int
    created: int
    skipped: int
    batch_id: str


class RevokeRequest(BaseModel):
    tenant_id: str
    template_id: str
    user_ids: List[str]
    reason: str


class RevokeResponse(BaseModel):
    template_id: str
    revoked: List[str]
    reason: str
    processed_at: datetime


@router.post("/import", response_model=ImportResponse, summary="批量导入授权")
async def import_authorizations(payload: ImportRequest) -> ImportResponse:
    created, skipped = state.import_authorizations(
        tenant_id=payload.tenant_id,
        template_id=payload.template_id,
        user_ids=payload.entries,
        usage_limit=payload.usage_limit,
        valid_days=payload.valid_days,
    )
    return ImportResponse(
        template_id=payload.template_id,
        total=len(payload.entries),
        created=created,
        skipped=skipped,
        batch_id="batch_%s" % payload.template_id,
    )


@router.post("/revoke", response_model=RevokeResponse, summary="吊销授权")
async def revoke(payload: RevokeRequest) -> RevokeResponse:
    if not payload.user_ids:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"code": "42201", "message": "user_ids_required"},
        )
    revoked = state.revoke_authorizations(
        tenant_id=payload.tenant_id,
        template_id=payload.template_id,
        user_ids=payload.user_ids,
        reason=payload.reason,
    )
    if not revoked:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "40401", "message": "authorization_not_found"},
        )
    return RevokeResponse(
        template_id=payload.template_id,
        revoked=revoked,
        reason=payload.reason,
        processed_at=utc_now(),
    )


@router.get("/{template_id}", response_model=List[AuthorizationRecord], summary="查看模板授权名单")
async def list_authorizations(template_id: str, tenant_id: str) -> List[AuthorizationRecord]:
    records = state.list_authorizations(tenant_id, template_id)
    if not records:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "40401", "message": "authorization_not_found"},
        )
    return records


@router.get("/{template_id}/logs", summary="查询授权使用日志")
async def authorization_logs(template_id: str, tenant_id: str) -> dict:
    logs = state.list_authorization_logs(template_id, tenant_id)
    return {
        "template_id": template_id,
        "tenant_id": tenant_id,
        "logs": [
            {
                "task_id": log.get("task_id"),
                "user_id": log.get("user_id"),
                "credits": log.get("credits"),
                "reason": log.get("reason"),
                "ts": log["ts"].isoformat() + "Z",
            }
            for log in logs
        ],
    }
