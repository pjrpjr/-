from datetime import datetime
from typing import Dict, List, Optional

from fastapi import APIRouter, Header, HTTPException, status
from pydantic import BaseModel, Field

from app.services import credits as credits_service

router = APIRouter(prefix="/api/v1/credits", tags=["credits"])


class EstimateOption(BaseModel):
    priority: str
    total_cost: int
    eta_minutes: int


class EstimateRequest(BaseModel):
    tenant_id: str
    user_id: str
    template_id: str
    scene: str
    resolution: str = Field("hd", description="分辨率标识：sd/hd/4k")
    priority: str = Field("standard", description="standard/accelerated")
    extras: Dict[str, int] | None = Field(default=None, description="附加消耗，如超分/高清等")



class EstimateResponse(BaseModel):
    currency: str
    template_id: str
    scene: str
    resolution: str
    priority: str
    current_balance: int
    selected_cost: int
    estimated_cost: int
    min_cost: int
    max_cost: int
    calculation_basis: str
    policy_tag: str | None = None
    audit_id: str
    suggest_topup: int
    extras: Dict[str, int]
    options: List[EstimateOption]


class ChargeRequest(BaseModel):
    tenant_id: str
    user_id: str
    template_id: str
    task_id: str | None = Field(default=None, description="关联任务 ID，可为空")
    amount: int = Field(..., gt=0, description="直接扣费积分")
    priority: str = Field("standard", description="扣费对应的优先级模式")
    reason: str = Field("charge", description="扣费原因标签")


class ChargeResponse(BaseModel):
    ledger_id: str
    tenant_id: str
    user_id: str | None
    task_id: str | None
    balance_after: int
    change: int
    reason: str
    created_at: datetime


class LedgerEntryResponse(BaseModel):
    ledger_id: str
    task_id: str | None
    change: int
    balance_after: int
    reason: str
    created_at: datetime


class PreDeductRequest(BaseModel):
    task_id: str = Field(..., description="任务唯一 ID")
    template_id: str = Field(..., description="模板 ID")
    tenant_id: str = Field(..., description="创作者/租户 ID")
    user_id: str = Field(..., description="授权用户 ID")
    scene: str = Field(..., description="任务场景标识")
    estimated_cost: int = Field(..., ge=0, description="预估积分消耗")
    currency: str = Field("point", description="积分计价单位")
    expire_in: int = Field(600, ge=60, le=3600, description="预扣单过期秒数")


class PreDeductResponse(BaseModel):
    pre_deduct_id: str
    frozen_amount: int
    balance_after: int
    quota_snapshot: Dict[str, int]
    expire_at: datetime


class CommitRequest(BaseModel):
    pre_deduct_id: str
    actual_cost: int = Field(..., ge=0)
    task_id: str
    tenant_id: str
    template_id: str
    user_id: str


class CancelRequest(BaseModel):
    pre_deduct_id: str
    tenant_id: str
    user_id: str | None = None
    reason: str = Field(..., description="取消原因")


class BalanceResponse(BaseModel):
    tenant_id: str
    user_id: str | None = None
    balance: int
    frozen: int
    currency: str = "point"


class LedgerResponse(BaseModel):
    tenant_id: str
    user_id: str | None
    entries: List[LedgerEntryResponse]


def _authorization_or_error(tenant_id: str, template_id: str, user_id: str):
    try:
        return credits_service.ensure_authorization(tenant_id=tenant_id, template_id=template_id, user_id=user_id)
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"code": "40302", "message": "authorization_not_found"},
        ) from None
    except ValueError as exc:
        message = str(exc)
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"code": "40302", "message": message},
        ) from None


@router.post("/estimate", response_model=EstimateResponse, summary="积分试算")
async def estimate(
    payload: EstimateRequest,
    x_idempotency_key: str | None = Header(default=None, alias="X-Idempotency-Key"),
) -> EstimateResponse:
    extras = payload.extras or {}
    data = credits_service.estimate(
        tenant_id=payload.tenant_id,
        user_id=payload.user_id,
        template_id=payload.template_id,
        scene=payload.scene,
        resolution=payload.resolution,
        priority=payload.priority,
        extras=extras,
    )
    return EstimateResponse(**data)


@router.post("/charge", response_model=ChargeResponse, summary="直接扣费")
async def charge(payload: ChargeRequest) -> ChargeResponse:
    try:
        _authorization_or_error(payload.tenant_id, payload.template_id, payload.user_id)
    except HTTPException as exc:
        raise exc
    try:
        ledger = credits_service.charge(
            tenant_id=payload.tenant_id,
            user_id=payload.user_id,
            template_id=payload.template_id,
            task_id=payload.task_id,
            amount=payload.amount,
            reason=payload.reason,
            priority=payload.priority,
        )
    except ValueError as exc:
        message = str(exc)
        if message == "amount_invalid":
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={"code": "42200", "message": message}) from None
        if message == "amount_limit_exceeded":
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={"code": "42201", "message": message}) from None
        if message == "insufficient_balance":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail={"code": "40302", "message": message}) from None
        raise
    return ChargeResponse(
        ledger_id=ledger.ledger_id,
        tenant_id=ledger.tenant_id,
        user_id=ledger.user_id,
        task_id=ledger.task_id,
        balance_after=ledger.balance_after,
        change=ledger.change,
        reason=ledger.reason,
        created_at=ledger.created_at,
    )


@router.get("/ledger", response_model=LedgerResponse, summary="积分流水")
async def ledger(tenant_id: str, user_id: str | None = None) -> LedgerResponse:
    entries = [
        LedgerEntryResponse(
            ledger_id=item.ledger_id,
            task_id=item.task_id,
            change=item.change,
            balance_after=item.balance_after,
            reason=item.reason,
            created_at=item.created_at,
        )
        for item in credits_service.list_ledger(tenant_id, user_id)
    ]
    return LedgerResponse(tenant_id=tenant_id, user_id=user_id, entries=entries)


@router.post("/pre-deduct", response_model=PreDeductResponse, summary="预扣积分")
async def pre_deduct(payload: PreDeductRequest) -> PreDeductResponse:
    entry = _authorization_or_error(payload.tenant_id, payload.template_id, payload.user_id)
    try:
        record = credits_service.pre_deduct(
            tenant_id=payload.tenant_id,
            user_id=payload.user_id,
            template_id=payload.template_id,
            task_id=payload.task_id,
            amount=payload.estimated_cost,
            expire_seconds=payload.expire_in,
        )
    except ValueError as exc:
        if str(exc) == "insufficient_balance":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={"code": "40302", "message": "insufficient_balance"},
            ) from None
        raise
    balance = credits_service.get_balance(payload.tenant_id, payload.user_id)
    quota_snapshot = {
        "template_quota": entry.usage_limit or -1,
        "user_usage": entry.used,
    }
    return PreDeductResponse(
        pre_deduct_id=record.pre_deduct_id,
        frozen_amount=record.frozen_amount,
        balance_after=balance["balance"],
        quota_snapshot=quota_snapshot,
        expire_at=record.expires_at,
    )


@router.post("/commit", response_model=PreDeductResponse, summary="结算扣费")
async def commit(payload: CommitRequest) -> PreDeductResponse:
    try:
        record = credits_service.commit_pre_deduct(payload.pre_deduct_id, payload.actual_cost)
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "40401", "message": "pre_deduct_not_found"},
        ) from None
    except ValueError as exc:
        message = str(exc)
        if message == "already_processed":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail={"code": "40901", "message": "pre_deduct_already_processed"},
            ) from None
        if message == "hold_insufficient":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail={"code": "40902", "message": "hold_insufficient"},
            ) from None
        if message == "amount_invalid":
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail={"code": "42200", "message": message},
            ) from None
        raise
    entry = credits_service.find_authorization(payload.tenant_id, payload.template_id, payload.user_id)
    if entry:
        credits_service.record_authorization_usage(entry, payload.task_id, -record.amount)
    balance = credits_service.get_balance(record.tenant_id, record.user_id)
    quota_snapshot = {
        "template_quota": entry.usage_limit if entry else -1,
        "user_usage": entry.used if entry else 0,
    }
    return PreDeductResponse(
        pre_deduct_id=record.pre_deduct_id,
        frozen_amount=record.amount,
        balance_after=balance["balance"],
        quota_snapshot=quota_snapshot,
        expire_at=record.expires_at,
    )


@router.post("/cancel", summary="取消预扣")
async def cancel(payload: CancelRequest) -> Dict[str, str]:
    try:
        record = credits_service.cancel_pre_deduct(payload.pre_deduct_id, payload.reason)
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "40401", "message": "pre_deduct_not_found"},
        ) from None
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"code": "40901", "message": "pre_deduct_already_processed"},
        ) from None
    balance = credits_service.get_balance(record.tenant_id, record.user_id)
    return {
        "pre_deduct_id": record.pre_deduct_id,
        "status": record.status,
        "reason": payload.reason,
        "balance_after": str(balance["balance"]),
    }


@router.get("/balance", response_model=BalanceResponse, summary="查询积分余额")
async def balance(tenant_id: str, user_id: str | None = None) -> BalanceResponse:
    result = credits_service.get_balance(tenant_id, user_id)
    return BalanceResponse(tenant_id=tenant_id, user_id=user_id, balance=result["balance"], frozen=result["frozen"])
