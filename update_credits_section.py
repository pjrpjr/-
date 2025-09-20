from pathlib import Path
path = Path("docs/api-credit-authorization-push.md")
text = path.read_text(encoding="utf-8")
start = text.index("## 1. 积分扣费 API")
end = text.index("## 2. 授权管理 API")
new_section = """## 1. 积分扣费 API

### 1.1 业务目标
- 为出图/训练任务提供统一积分试算与扣费能力，支持标准/加速、补扣、退款等场景。
- 所有扣费操作写入 ledger，并与授权记录、任务日志联动。

### 1.2 Endpoint 列表
| 方法 | 路径 | 描述 |
| ---- | ---- | ---- |
| POST | /api/v1/credits/estimate | 试算积分成本（标准/加速、extras、提示词长度等）。|
| POST | /api/v1/credits/charge | 直接扣费（含补扣/加速），支持幂等。|
| POST | /api/v1/credits/refund | 任务失败或人工退款，恢复余额并记录原因。|
| GET  | /api/v1/credits/ledger | 查询积分流水（含补扣、退款、预扣记录）。|
| POST | /api/v1/credits/pre-deduct | 创建积分预扣记录，锁定额度，返回预扣单号。|
| POST | /api/v1/credits/commit | 按预扣单号结算扣费。|
| POST | /api/v1/credits/cancel | 取消预扣，回滚冻结额度。|
| GET  | /api/v1/credits/balance | 查询创作者/授权用户可用积分余额。|

### 1.3 `/credits/estimate` 示例
```http
POST /api/v1/credits/estimate
Content-Type: application/json
X-Idempotency-Key: req_8f0c9

{
  "tenant_id": "creator_001",
  "user_id": "user_7788",
  "template_id": "tmpl_xxx",
  "scene": "image.generate",
  "resolution": "4k",
  "priority": "accelerated",
  "inputs": [
    {"name": "prompt", "tokens": 120}
  ],
  "extras": {"hires_fix": 6}
}
```
```json
{
  "currency": "point",
  "estimated_cost": 46,
  "min_cost": 30,
  "max_cost": 52,
  "calculation_basis": "pricing-model-v1.6",
  "options": [
    {"priority": "standard", "total_cost": 30, "eta_minutes": 8},
    {"priority": "accelerated", "total_cost": 46, "eta_minutes": 3}
  ],
  "policy_tag": null,
  "audit_id": "audit_4f8f"
}
```
错误码：`42201` payload_invalid、`40302` authorization_missing、`50301` pricing_unavailable。

### 1.4 `/credits/charge` 示例
```http
POST /api/v1/credits/charge
Content-Type: application/json
X-Idempotency-Key: req_f93c

{
  "tenant_id": "creator_001",
  "user_id": "user_7788",
  "template_id": "tmpl_xxx",
  "task_id": "task_20250917001",
  "amount": 46,
  "priority": "accelerated",
  "reason": "accelerate",
  "metadata": {"source": "accelerate-banner"}
}
```
```json
{
  "ledger_id": "chg_7788",
  "tenant_id": "creator_001",
  "user_id": "user_7788",
  "task_id": "task_20250917001",
  "change": -46,
  "balance_after": 354,
  "reason": "accelerate:accelerated",
  "policy_tag": null,
  "created_at": "2025-09-18T08:30:00Z"
}
```
错误码：`40201` insufficient_balance、`40901` idempotency_conflict、`42901` charge_rate_limited、`50302` ledger_unavailable。

### 1.5 `/credits/refund` 示例
```http
POST /api/v1/credits/refund
Content-Type: application/json
X-Idempotency-Key: req_refund_12

{
  "tenant_id": "creator_001",
  "user_id": "user_7788",
  "task_id": "task_20250917001",
  "amount": 20,
  "reason": "task_failed",
  "operator": "reviewer_66"
}
```
```json
{
  "refund_id": "ref_9900",
  "ledger_id": "refund_7788",
  "change": 20,
  "balance_after": 374,
  "policy_tag": "manual_refund",
  "created_at": "2025-09-18T08:45:12Z"
}
```
错误码：`40003` invalid_refund_amount、`40903` refund_duplicate、`40305` refund_not_allowed。

### 1.6 `/credits/ledger` 示例
```http
GET /api/v1/credits/ledger?tenant_id=creator_001&user_id=user_7788
```
```json
{
  "tenant_id": "creator_001",
  "user_id": "user_7788",
  "entries": [
    {"ledger_id": "pd_123456", "task_id": "task_20250917001", "change": -35, "balance_after": 365, "reason": "pre_deduct", "created_at": "2025-09-17T09:00:00Z"},
    {"ledger_id": "chg_7788", "task_id": "task_20250917001", "change": -46, "balance_after": 319, "reason": "accelerate:accelerated", "policy_tag": null, "created_at": "2025-09-17T09:30:00Z"},
    {"ledger_id": "refund_7788", "task_id": "task_20250917001", "change": 20, "balance_after": 339, "reason": "refund_manual", "policy_tag": "manual_refund", "created_at": "2025-09-17T10:10:00Z"}
  ]
}
```
错误码：`40401` account_not_found、`50303` ledger_service_unavailable。

### 1.7 `/licenses/check`
- 请求示例：
```json
{
  "tenant_id": "creator_001",
  "template_id": "tmpl_xxx",
  "user_id": "user_7788",
  "channel": "viewer_portal",
  "session_id": "sess_123"
}
```
- 响应示例：
```json
{
  "is_authorized": true,
  "reason_code": "valid",
  "remaining_quota": 5,
  "daily_remaining": 2,
  "valid_until": "2025-10-01T00:00:00Z",
  "policy_tag": null,
  "requirements": []
}
```
错误码：`40302` authorization_revoked、`40303` daily_quota_exceeded、`40401` template_not_found、`40902` authorization_conflict。

"""
text = text[:start] + new_section + text[end:]
path.write_text(text, encoding="utf-8")
