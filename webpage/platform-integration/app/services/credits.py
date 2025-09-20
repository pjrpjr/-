from __future__ import annotations

from typing import Dict, Optional

from app.core import state


def estimate(
    *,
    tenant_id: str,
    user_id: Optional[str],
    template_id: str,
    scene: str,
    resolution: str = "hd",
    priority: str = "standard",
    extras: Optional[Dict[str, int]] = None,
) -> Dict[str, object]:
    """Estimate credit cost using core state pricing rules."""
    return state.estimate_credits(
        tenant_id=tenant_id,
        user_id=user_id,
        template_id=template_id,
        scene=scene,
        resolution=resolution,
        priority=priority,
        extras=extras or {},
    )


def charge(
    *,
    tenant_id: str,
    user_id: Optional[str],
    template_id: str,
    task_id: Optional[str],
    amount: int,
    priority: str = "standard",
    reason: str = "charge",
):
    """Charge credits for a completed task.

    Raises:
        KeyError/ValueError: Propagated from the core state module when
        authorization is missing or balance is insufficient.
    """
    return state.charge_credits(
        tenant_id=tenant_id,
        user_id=user_id,
        template_id=template_id,
        task_id=task_id,
        amount=amount,
        priority=priority,
        reason=reason,
    )


def list_ledger(tenant_id: str, user_id: Optional[str] = None):
    """Return ledger entries for the given tenant/user."""
    return state.list_ledger(tenant_id, user_id)


def get_balance(tenant_id: str, user_id: Optional[str] = None) -> Dict[str, int]:
    return state.get_balance(tenant_id, user_id)


def pre_deduct(
    *,
    tenant_id: str,
    user_id: str,
    template_id: str,
    task_id: str,
    amount: int,
    expire_seconds: int,
):
    return state.pre_deduct(
        tenant_id=tenant_id,
        user_id=user_id,
        template_id=template_id,
        task_id=task_id,
        amount=amount,
        expire_seconds=expire_seconds,
    )


def commit_pre_deduct(pre_deduct_id: str, actual_cost: int):
    record = state.commit_pre_deduct(pre_deduct_id, actual_cost)
    return record


def cancel_pre_deduct(pre_deduct_id: str, reason: str):
    return state.cancel_pre_deduct(pre_deduct_id, reason)


def record_authorization_usage(entry: state.AuthorizationEntry, task_id: str, credits: int) -> None:
    state.record_authorization_usage(entry, task_id, credits)


def ensure_authorization(tenant_id: str, template_id: str, user_id: str) -> state.AuthorizationEntry:
    return state.ensure_authorization(tenant_id=tenant_id, template_id=template_id, user_id=user_id)



def find_authorization(tenant_id: str, template_id: str, user_id: str):
    return state.find_authorization(tenant_id, template_id, user_id)

