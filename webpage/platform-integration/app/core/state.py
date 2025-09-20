from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timedelta, UTC



def utc_now():
    return datetime.now(UTC)
from typing import Dict, List, Optional, Tuple
from uuid import uuid4

_MAX_CHARGE_PER_REQUEST = 2000


@dataclass
class CreditLedgerItem:
    ledger_id: str
    tenant_id: str
    user_id: Optional[str]
    task_id: Optional[str]
    change: int
    balance_after: int
    created_at: datetime
    reason: str


@dataclass
class PreDeductRecord:
    pre_deduct_id: str
    tenant_id: str
    user_id: Optional[str]
    template_id: str
    task_id: str
    amount: int
    expires_at: datetime
    status: str = "pending"
    frozen_amount: int = 0
    created_at: datetime = field(default_factory=utc_now)


@dataclass
class AuthorizationEntry:
    authorization_id: str
    tenant_id: str
    template_id: str
    user_id: str
    status: str
    usage_limit: Optional[int]
    used: int
    valid_from: datetime
    valid_to: datetime


@dataclass
class Task:
    task_id: str
    tenant_id: str
    template_id: str
    user_id: str
    status: str
    result_url: Optional[str]
    created_at: datetime
    updated_at: datetime
    metadata: Dict[str, str]


@dataclass
class TaskEvent:
    event: str
    task_id: str
    status: str
    message: Optional[str]
    credits_delta: Optional[int]
    ts: datetime
    stage: str
    progress: int
    next_eta: Optional[datetime]


_balance: Dict[Tuple[str, Optional[str]], Dict[str, int]] = {
    ("creator_001", None): {"balance": 1200, "frozen": 0},
    ("creator_001", "user_001"): {"balance": 400, "frozen": 0},
}

_ledger: List[CreditLedgerItem] = []
_pre_deducts: Dict[str, PreDeductRecord] = {}

_authorizations: Dict[Tuple[str, str], List[AuthorizationEntry]] = {
    ("creator_001", "tmpl_mock_001"): [
        AuthorizationEntry(
            authorization_id="auth_mock_001",
            tenant_id="creator_001",
            template_id="tmpl_mock_001",
            user_id="user_001",
            status="active",
            usage_limit=10,
            used=2,
            valid_from=utc_now() - timedelta(days=5),
            valid_to=utc_now() + timedelta(days=25),
        )
    ]
}

_authorization_logs: List[Dict[str, object]] = [
    {
        "template_id": "tmpl_mock_001",
        "tenant_id": "creator_001",
        "task_id": "task_mock_001",
        "user_id": "user_001",
        "credits": -10,
        "ts": utc_now() - timedelta(hours=2),
    }
]

_tasks: Dict[str, Task] = {
    "task_mock_001": Task(
        task_id="task_mock_001",
        tenant_id="creator_001",
        template_id="tmpl_mock_001",
        user_id="user_001",
        status="completed",
        result_url="https://cdn.example.com/mock.png",
        created_at=utc_now() - timedelta(hours=3),
        updated_at=utc_now() - timedelta(hours=2, minutes=30),
        metadata={"scene": "image.generate"},
    )
}

_task_events: Dict[str, List[TaskEvent]] = {
    "task_mock_001": [
        TaskEvent(
            event="task.accepted",
            task_id="task_mock_001",
            status="queued",
            message="任务已排队",
            credits_delta=None,
            ts=utc_now() - timedelta(hours=3),
            stage="ingest",
            progress=10,
            next_eta=utc_now() - timedelta(hours=2, minutes=50),
        ),
        TaskEvent(
            event="task.running",
            task_id="task_mock_001",
            status="running",
            message="任务执行中",
            credits_delta=None,
            ts=utc_now() - timedelta(hours=2, minutes=45),
            stage="processing",
            progress=55,
            next_eta=utc_now() - timedelta(hours=2, minutes=5),
        ),
        TaskEvent(
            event="task.completed",
            task_id="task_mock_001",
            status="completed",
            message="任务完成",
            credits_delta=-10,
            ts=utc_now() - timedelta(hours=2),
            stage="delivery",
            progress=100,
            next_eta=None,
        ),
    ]
}



_license_profiles: Dict[Tuple[str, str, str], Dict[str, object]] = {
    ("creator_001", "tmpl_mock_001", "user_001"): {
        "daily_limit": 10,
        "daily_used": 2,
        "policy_tag": None,
        "requirements": [],
    },
}

_pricing_rules = {
    "image.generate": {
        "base": 18,
        "resolution": {
            "sd": 0,
            "hd": 6,
            "4k": 14
        },
        "priority": {
            "standard": 0,
            "accelerated": 12
        },
        "eta_minutes": {
            "standard": 8,
            "accelerated": 3
        }
    },
    "model.train": {
        "base": 120,
        "resolution": {
            "base": 0
        },
        "priority": {
            "standard": 0,
            "accelerated": 40
        },
        "eta_minutes": {
            "standard": 45,
            "accelerated": 20
        }
    }
}


def _account_key(tenant_id: str, user_id: Optional[str]) -> Tuple[str, Optional[str]]:
    return tenant_id, user_id or None


def get_balance(tenant_id: str, user_id: Optional[str]) -> Dict[str, int]:
    if (tenant_id, user_id or None) not in _balance:
        _balance[(tenant_id, user_id or None)] = {"balance": 0, "frozen": 0}
    data = _balance[(tenant_id, user_id or None)]
    return {"balance": data["balance"], "frozen": data["frozen"]}


def _record_ledger(tenant_id: str, user_id: Optional[str], task_id: Optional[str], change: int, reason: str, *, apply_change: bool = True) -> int:
    account = _balance.get(_account_key(tenant_id, user_id))
    if account is None:
        account = {"balance": 0, "frozen": 0}
        _balance[_account_key(tenant_id, user_id)] = account
    if apply_change:
        account["balance"] += change
    balance_value = account["balance"]
    ledger = CreditLedgerItem(
        ledger_id=str(uuid4()),
        tenant_id=tenant_id,
        user_id=user_id,
        task_id=task_id,
        change=change,
        balance_after=balance_value,
        created_at=utc_now(),
        reason=reason,
    )
    _ledger.append(ledger)
    return balance_value


def pre_deduct(tenant_id: str, user_id: Optional[str], template_id: str, task_id: str, amount: int, expire_seconds: int) -> PreDeductRecord:
    account = _balance.get(_account_key(tenant_id, user_id))
    if account is None:
        account = {"balance": 0, "frozen": 0}
        _balance[_account_key(tenant_id, user_id)] = account
    if account["balance"] < amount:
        raise ValueError("insufficient_balance")
    pre_id = f"pd_{uuid4().hex[:8]}"
    expires_at = utc_now() + timedelta(seconds=expire_seconds)
    record = PreDeductRecord(
        pre_deduct_id=pre_id,
        tenant_id=tenant_id,
        user_id=user_id,
        template_id=template_id,
        task_id=task_id,
        amount=amount,
        expires_at=expires_at,
        frozen_amount=amount,
    )
    account["balance"] -= amount
    account["frozen"] += amount
    _pre_deducts[pre_id] = record
    _record_ledger(tenant_id, user_id, task_id, -amount, "pre_deduct", apply_change=False)
    return record


def commit_pre_deduct(pre_deduct_id: str, actual_cost: int) -> PreDeductRecord:
    if pre_deduct_id not in _pre_deducts:
        raise KeyError("pre_deduct_not_found")
    if actual_cost < 0:
        raise ValueError("amount_invalid")
    record = _pre_deducts[pre_deduct_id]
    if record.status != "pending":
        raise ValueError("already_processed")
    if actual_cost > record.frozen_amount:
        raise ValueError("hold_insufficient")
    account = _balance[_account_key(record.tenant_id, record.user_id)]
    refund = record.frozen_amount - actual_cost
    account["frozen"] -= record.frozen_amount
    if refund:
        account["balance"] += refund
        _record_ledger(record.tenant_id, record.user_id, record.task_id, refund, "refund_pre_deduct", apply_change=False)
    if actual_cost:
        _record_ledger(record.tenant_id, record.user_id, record.task_id, -actual_cost, "commit", apply_change=False)
    record.status = "committed"
    record.frozen_amount = actual_cost
    record.amount = actual_cost
    record.expires_at = utc_now()
    _tasks.setdefault(record.task_id, Task(
        task_id=record.task_id,
        tenant_id=record.tenant_id,
        template_id=record.template_id,
        user_id=record.user_id or "",
        status="completed",
        result_url="https://cdn.example.com/mock.png",
        created_at=utc_now(),
        updated_at=utc_now(),
        metadata={},
    ))
    _task_events.setdefault(record.task_id, []).append(
        TaskEvent(
            event="task.completed",
            task_id=record.task_id,
            status="completed",
            message="任务完成",
            credits_delta=-actual_cost if actual_cost else 0,
            ts=utc_now(),
            stage="completed",
            progress=100,
            next_eta=None,
        )
    )
    return record




def cancel_pre_deduct(pre_deduct_id: str, reason: str) -> PreDeductRecord:
    if pre_deduct_id not in _pre_deducts:
        raise KeyError("pre_deduct_not_found")
    record = _pre_deducts[pre_deduct_id]
    if record.status != "pending":
        raise ValueError("already_processed")
    account = _balance[_account_key(record.tenant_id, record.user_id)]
    account["frozen"] -= record.frozen_amount
    account["balance"] += record.frozen_amount
    _record_ledger(record.tenant_id, record.user_id, record.task_id, record.frozen_amount, "cancel", apply_change=False)
    record.status = "cancelled"
    record.expires_at = utc_now()
    return record








def check_license(
    tenant_id: str,
    template_id: str,
    user_id: str,
    *,
    channel: str,
    session_id: str,
) -> Dict[str, object]:
    entries = _authorizations.get((tenant_id, template_id))
    if not entries:
        raise KeyError("template_not_found")
    entry = next((item for item in entries if item.user_id == user_id), None)
    profile = _license_profiles.get(
        (tenant_id, template_id, user_id),
        {
            "daily_limit": 20,
            "daily_used": 0,
            "policy_tag": None,
            "requirements": [],
        },
    )
    try:
        daily_limit = int(profile.get("daily_limit", 20))
    except (TypeError, ValueError):
        daily_limit = 20
    try:
        daily_used = int(profile.get("daily_used", 0))
    except (TypeError, ValueError):
        daily_used = 0
    daily_limit = max(0, daily_limit)
    daily_used = max(0, daily_used)
    daily_remaining = max(0, daily_limit - daily_used)
    requirements = [str(item) for item in profile.get("requirements", [])]
    policy_tag = profile.get("policy_tag")
    remaining_quota = 0
    valid_until = None
    now = utc_now()

    if entry is None:
        reason_code = "revoked"
        is_authorized = False
    else:
        if entry.usage_limit is not None:
            remaining_quota = max(0, entry.usage_limit - entry.used)
        else:
            remaining_quota = -1
        valid_until = entry.valid_to
        if entry.status != "active":
            reason_code = "revoked"
            is_authorized = False
        elif entry.valid_to < now:
            reason_code = "expired"
            is_authorized = False
        elif entry.usage_limit is not None and entry.used >= entry.usage_limit:
            reason_code = "daily_quota_exceeded"
            remaining_quota = 0
            is_authorized = False
        elif requirements:
            reason_code = "missing_documents"
            is_authorized = False
        elif daily_remaining <= 0:
            reason_code = "daily_quota_exceeded"
            is_authorized = False
        else:
            reason_code = "valid"
            is_authorized = True

    if entry is None:
        remaining_quota = 0
        daily_remaining = 0
        valid_until = None

    return {
        "is_authorized": is_authorized,
        "reason_code": reason_code,
        "remaining_quota": remaining_quota,
        "daily_remaining": daily_remaining,
        "valid_until": valid_until,
        "policy_tag": policy_tag,
        "requirements": requirements,
    }


def ensure_authorization(tenant_id: str, template_id: str, user_id: str) -> AuthorizationEntry:
    entries = _authorizations.get((tenant_id, template_id))
    if not entries:
        raise KeyError("authorization_not_found")
    for entry in entries:
        if entry.user_id == user_id:
            if entry.status != "active":
                raise ValueError("authorization_revoked")
            if entry.valid_to < utc_now():
                raise ValueError("authorization_expired")
            if entry.usage_limit is not None and entry.used >= entry.usage_limit:
                raise ValueError("authorization_quota_exceeded")
            return entry
    raise KeyError("authorization_not_found")


def record_authorization_usage(entry: AuthorizationEntry, task_id: str, credits: int) -> None:
    entry.used += 1
    _authorization_logs.append(
        {
            "template_id": entry.template_id,
            "tenant_id": entry.tenant_id,
            "task_id": task_id,
            "user_id": entry.user_id,
            "credits": credits,
            "ts": utc_now(),
        }
    )


def import_authorizations(tenant_id: str, template_id: str, user_ids: List[str], usage_limit: Optional[int], valid_days: int) -> Tuple[int, int]:
    entries = _authorizations.setdefault((tenant_id, template_id), [])
    created = 0
    skipped = 0
    valid_from = utc_now()
    valid_to = valid_from + timedelta(days=valid_days)
    existing_users = {entry.user_id for entry in entries}
    for user_id in user_ids:
        if user_id in existing_users:
            skipped += 1
            continue
        authorization = AuthorizationEntry(
            authorization_id=f"auth_{uuid4().hex[:8]}",
            tenant_id=tenant_id,
            template_id=template_id,
            user_id=user_id,
            status="active",
            usage_limit=usage_limit,
            used=0,
            valid_from=valid_from,
            valid_to=valid_to,
        )
        entries.append(authorization)
        existing_users.add(user_id)
        created += 1
    return created, skipped


def revoke_authorizations(tenant_id: str, template_id: str, user_ids: List[str], reason: str) -> List[str]:
    entries = _authorizations.get((tenant_id, template_id), [])
    revoked: List[str] = []
    for entry in entries:
        if entry.user_id in user_ids and entry.status == "active":
            entry.status = "revoked"
            revoked.append(entry.user_id)
    if revoked:
        _authorization_logs.append(
            {
                "template_id": template_id,
                "tenant_id": tenant_id,
                "task_id": None,
                "user_id": ",".join(revoked),
                "credits": 0,
                "reason": reason,
                "ts": utc_now(),
            }
        )
    return revoked


def find_authorization(tenant_id: str, template_id: str, user_id: str) -> Optional[AuthorizationEntry]:
    entries = _authorizations.get((tenant_id, template_id), [])
    for entry in entries:
        if entry.user_id == user_id:
            return entry
    return None


def list_authorizations(tenant_id: str, template_id: str) -> List[AuthorizationEntry]:
    return list(_authorizations.get((tenant_id, template_id), []))


def list_authorization_logs(template_id: str, tenant_id: str) -> List[Dict[str, object]]:
    return [
        log for log in _authorization_logs if log["template_id"] == template_id and log["tenant_id"] == tenant_id
    ]


def get_task(task_id: str) -> Task:
    if task_id not in _tasks:
        raise KeyError("task_not_found")
    return _tasks[task_id]


def list_task_events(task_id: str) -> List[TaskEvent]:
    if task_id not in _task_events:
        raise KeyError("task_not_found")
    return _task_events[task_id]



def estimate_credits(
    tenant_id: str,
    user_id: Optional[str],
    template_id: str,
    scene: str,
    *,
    resolution: str = "hd",
    priority: str = "standard",
    extras: Optional[Dict[str, int]] = None,
) -> Dict[str, object]:
    rules = _pricing_rules.get(
        scene,
        _pricing_rules.get(
            "image.generate",
            {
                "base": 20,
                "resolution": {},
                "priority": {"standard": 0},
                "eta_minutes": {"standard": 10},
            },
        ),
    )
    base = rules.get("base", 0) + rules.get("resolution", {}).get(resolution, 0)
    standard_cost = base + rules.get("priority", {}).get("standard", 0)
    accelerated_cost = base + rules.get("priority", {}).get("accelerated", standard_cost - base)
    chosen_priority = priority if priority in rules.get("priority", {}) else "standard"
    chosen_cost = base + rules.get("priority", {}).get(chosen_priority, 0)
    extras = extras or {}
    extras_total = sum(extras.values())
    chosen_cost += extras_total
    account = get_balance(tenant_id, user_id)
    suggest_topup = max(0, chosen_cost - account["balance"])
    standard_total = standard_cost + extras_total
    accelerated_total = accelerated_cost + extras_total
    options = [
        {
            "priority": "standard",
            "total_cost": standard_total,
            "eta_minutes": rules.get("eta_minutes", {}).get("standard", 10),
        },
        {
            "priority": "accelerated",
            "total_cost": accelerated_total,
            "eta_minutes": rules.get("eta_minutes", {}).get("accelerated", 4),
        },
    ]
    costs = [item["total_cost"] for item in options]
    min_cost = min(costs) if costs else chosen_cost
    max_cost = max(costs) if costs else chosen_cost
    audit_id = f"calc_{uuid4().hex[:8]}"
    calculation_basis = f"pricing_v{utc_now():%Y%m%d}"
    return {
        "currency": "point",
        "template_id": template_id,
        "scene": scene,
        "resolution": resolution,
        "priority": chosen_priority,
        "current_balance": account["balance"],
        "selected_cost": chosen_cost,
        "estimated_cost": chosen_cost,
        "min_cost": min_cost,
        "max_cost": max_cost,
        "calculation_basis": calculation_basis,
        "policy_tag": None,
        "audit_id": audit_id,
        "suggest_topup": suggest_topup,
        "extras": extras,
        "options": options,
    }



def charge_credits(
    tenant_id: str,
    user_id: Optional[str],
    template_id: str,
    task_id: Optional[str],
    amount: int,
    *,
    reason: str = "charge",
    priority: str = "standard",
) -> CreditLedgerItem:
    if amount <= 0:
        raise ValueError("amount_invalid")
    if amount > _MAX_CHARGE_PER_REQUEST:
        raise ValueError("amount_limit_exceeded")
    account = _balance.get(_account_key(tenant_id, user_id))
    if account is None or account["balance"] < amount:
        raise ValueError("insufficient_balance")
    account["balance"] -= amount
    ledger = CreditLedgerItem(
        ledger_id=str(uuid4()),
        tenant_id=tenant_id,
        user_id=user_id,
        task_id=task_id,
        change=-amount,
        balance_after=account["balance"],
        created_at=utc_now(),
        reason=f"{reason}:{priority}",
    )
    _ledger.append(ledger)
    return ledger


def list_ledger(tenant_id: str, user_id: Optional[str] = None) -> List[CreditLedgerItem]:
    return [entry for entry in _ledger if entry.tenant_id == tenant_id and entry.user_id == user_id]


__all__ = [
    "find_authorization",
    "get_balance",
    "pre_deduct",
    "commit_pre_deduct",
    "cancel_pre_deduct",
    "estimate_credits",
    "charge_credits",
    "list_ledger",
    "check_license",
    "ensure_authorization",
    "record_authorization_usage",
    "import_authorizations",
    "revoke_authorizations",
    "list_authorizations",
    "list_authorization_logs",
    "get_task",
    "list_task_events",
]

