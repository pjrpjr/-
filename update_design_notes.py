from pathlib import Path
path = Path("docs/api-design-notes.md")
text = path.read_text(encoding="utf-8")
start = text.index("## `/licenses/check`")
new_section = """## `/licenses/check`
- 方法：POST `/api/v1/licenses/check`
- 请求字段：`tenant_id`, `template_id`, `user_id`, `channel`, `session_id`
- 响应字段：`is_authorized` (bool), `reason_code` (`valid`/`expired`/`revoked`/`missing_documents`/`daily_quota_exceeded`), `remaining_quota`, `daily_remaining`, `valid_until`, `policy_tag`, `requirements` (string 列表)
- 错误码：`40302` authorization_revoked、`40303` daily_quota_exceeded、`40401` template_not_found、`40902` authorization_conflict、`50304` license_service_unavailable

## `/credits/estimate`
- 方法：POST `/api/v1/credits/estimate`
- 请求字段：`tenant_id`, `user_id`, `template_id`, `scene`, `resolution`, `priority`, `inputs[]`, `extras`，需携带 `X-Idempotency-Key`
- 响应字段：`estimated_cost`, `min_cost`, `max_cost`, `currency`, `options[]`, `calculation_basis`, `policy_tag`, `audit_id`
- 错误码：`42201` payload_invalid、`40302` authorization_missing、`50301` pricing_unavailable、`42901` estimate_rate_limited

## `/credits/charge`
- 方法：POST `/api/v1/credits/charge`
- 请求字段：`tenant_id`, `user_id`, `template_id`, `task_id`, `amount`, `priority`, `reason`, `metadata`，Header `X-Idempotency-Key`
- 响应字段：`ledger_id`, `change`, `balance_after`, `reason`, `policy_tag`, `created_at`
- 错误码：`40201` insufficient_balance、`40901` idempotency_conflict、`42901` charge_rate_limited、`50302` ledger_unavailable

## `/credits/refund`
- 方法：POST `/api/v1/credits/refund`
- 请求字段：`tenant_id`, `user_id`, `task_id`, `amount`, `reason`, `operator`
- 响应字段：`refund_id`, `ledger_id`, `change`, `balance_after`, `policy_tag`, `created_at`
- 错误码：`40003` invalid_refund_amount、`40903` refund_duplicate、`40305` refund_not_allowed

## `/credits/ledger`
- 方法：GET `/api/v1/credits/ledger`
- 参数：`tenant_id`, `user_id`, 可分页
- 响应字段：`entries[]`（含 ledger_id、task_id、change、balance_after、reason、policy_tag、created_at）
- 错误码：`40401` account_not_found、`50303` ledger_service_unavailable

## 审计 & Policy Tag
- 所有响应需包含 `policy_tag`（缺省为 null），用于合规审计。
- 估算/扣费/退款接口成功时写入 `audit_log`、关联 `audit_id`。
"""
end = text.index("## TODO")
text = text[:start] + new_section + "\n\n" + text[end:]
path.write_text(text, encoding="utf-8")
