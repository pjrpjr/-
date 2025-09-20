from datetime import datetime
from app.core.state import utc_now

from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter(prefix="/api/v1/reviews", tags=["review-callback"])


class ReviewCallbackRequest(BaseModel):
    review_id: str = Field(..., description="审核单 ID")
    template_id: str = Field(..., description="模板 ID")
    tenant_id: str = Field(..., description="创作者/租户 ID")
    operator: str = Field(..., description="审核人账号")
    decision: str = Field(..., description="pass/reject 等结论")
    reason: str | None = Field(None, description="审核原因备注")
    effective_at: datetime = Field(default_factory=utc_now)


class ReviewCallbackResponse(BaseModel):
    review_id: str
    status: str
    processed_at: datetime


@router.post("/callbacks", response_model=ReviewCallbackResponse, summary="审核结果回写")
async def review_callback(payload: ReviewCallbackRequest) -> ReviewCallbackResponse:
    return ReviewCallbackResponse(
        review_id=payload.review_id,
        status="received",
        processed_at=utc_now(),
    )
