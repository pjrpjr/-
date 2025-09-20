from datetime import datetime
from typing import Literal

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from app.services import licenses as licenses_service

router = APIRouter(prefix="/api/v1/licenses", tags=["licenses"])


Channel = Literal["viewer", "creator", "external"]


class LicenseCheckRequest(BaseModel):
    tenant_id: str
    template_id: str
    user_id: str
    channel: Channel = Field(..., description="授权来源渠道")
    session_id: str | None = Field(default=None, description="本次校验的会话标识")


class LicenseCheckResponse(BaseModel):
    is_authorized: bool
    reason_code: str
    remaining_quota: int
    daily_remaining: int
    valid_until: datetime | None
    policy_tag: str | None
    requirements: list[str]


@router.post("/check", response_model=LicenseCheckResponse, summary="账户授权校验")
async def check_license(payload: LicenseCheckRequest) -> LicenseCheckResponse:
    try:
        result = licenses_service.check_license(
            tenant_id=payload.tenant_id,
            template_id=payload.template_id,
            user_id=payload.user_id,
            channel=payload.channel,
            session_id=payload.session_id or "",
        )
    except KeyError as exc:
        reason = exc.args[0] if exc.args else str(exc)
        if reason == "template_not_found":
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"code": "0401", "message": "template_not_found"},
            ) from None
        raise
    except ValueError as exc:
        reason = exc.args[0] if exc.args else str(exc)
        if reason == "service_unavailable":
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail={"code": "0304", "message": "license_service_unavailable"},
            ) from None
        raise
    return LicenseCheckResponse(**result)
