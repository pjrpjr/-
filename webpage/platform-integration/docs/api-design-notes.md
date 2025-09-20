# API Design Notes – Phase2 v0.3 (2025-09-18)

## /licenses/check
- 方法：POST `/api/v1/licenses/check`
- 请求字段：`tenant_id`,`template_id`,`user_id`,`channel`(`viewer`\|`creator`\|`external`),`session_id`
- 响应字段：
  - `is_authorized` 是否通过授权校验
  - `reason_code` `valid`/`expired`/`revoked`/`missing_documents`/`daily_quota_exceeded`
  - `remaining_quota` 剩余总额度（-1 表示不限）
  - `daily_remaining` 当日剩余额度
  - `valid_until` 授权有效期（ISO8601，可能为 `null`）
  - `policy_tag` 合规标签
  - `requirements` 待补充材料列表
- HTTP 错误：
  - 404 `0401 template_not_found`
  - 503 `0304 license_service_unavailable`
  - 业务态 revocation/expired/quota/missing-docs 以 `200` 返回并由 `reason_code` 表达
- 测试计划：
  - 单测覆盖授权有效/已撤销/已过期/日配额耗尽/需补资料
  - 集成测试校验授权日志写入与 policy_tag 透传

## /credits/estimate (v0.2)
- 方法：POST `/api/v1/credits/estimate`（需携带 `X-Idempotency-Key`）
- 请求字段：`tenant_id`,`user_id`,`template_id`,`scene`,`resolution`,`priority`,`extras{}`
- 响应字段：
  - `currency`
  - `template_id`,`scene`,`resolution`,`priority`
  - `current_balance`,`suggest_topup`
  - `selected_cost` 与 `estimated_cost`
  - `min_cost`,`max_cost`
  - `calculation_basis`（如 `pricing_v20250918`）
  - `policy_tag`
  - `audit_id`
  - `extras`
  - `options[]` -> `priority`,`total_cost`,`eta_minutes`
- 错误码：`42201 payload_invalid`，`40302 authorization_missing`，`50301 pricing_unavailable`，`2901 estimate_rate_limited`
- 测试计划：
  - 单测覆盖标准/加速优先级、extras 不同组合
  - 集成测试校验 pricing 模型、估算日志与 `audit_id` 记录

## /credits/charge
- 方法：POST `/api/v1/credits/charge`
- 请求字段：`tenant_id`,`user_id`,`template_id`,`task_id`,`amount`,`priority`,`reason`,`metadata`
- Header：`X-Idempotency-Key`
- 响应字段：`ledger_id`,`change`,`balance_after`,`reason`,`policy_tag`,`created_at`
- 错误码：`40201 insufficient_balance`,`0901 idempotency_conflict`,`2901 charge_rate_limited`,`0302 ledger_unavailable`
- 测试计划：不足额、重复请求、ledger 入库、policy_tag 透传

## /credits/refund
- 方法：POST `/api/v1/credits/refund`
- 请求字段：`tenant_id`,`user_id`,`task_id`,`amount`,`reason`,`operator`
- 响应字段：`refund_id`,`ledger_id`,`change`,`balance_after`,`policy_tag`,`created_at`
- 错误码：`40003 invalid_refund_amount`,`0903 refund_duplicate`,`0305 refund_not_allowed`
- 测试计划：部分退款、重复调用、权限校验

## /credits/ledger
- 方法：GET `/api/v1/credits/ledger`
- 参数：`tenant_id`,`user_id`（支持分页、排序）
- 响应：`entries[]` (含 `ledger_id`,`task_id`,`change`,`balance_after`,`reason`,`policy_tag`,`created_at`)
- 错误码：`40401 account_not_found`,`0303 ledger_service_unavailable`
- 测试计划：分页单测，集成验证结果与数据库一致

## 审计与 Policy Tag
- 所有响应用 `policy_tag` 标记（默认 `null`）以支持合规审计
- 估算/扣费/退款时写入 `audit_log`，记录 `audit_id`

### 9/18 规格评审结论
- 产品规划：确认 personas/JTBD 与授权校验流程一致，准许沿用 v0.2 请求字段并在 shared/CHANGELOG.md#L157 留痕。
- 前端：接受响应体字段与 `policy_tag` 扩展，要求 Platform Delivery 在 9/20 前产出 SDK 方法并完成 mock 对齐。
- 合规：认可 `reason_code` 与 `audit_id` 记录策略，要求所有授权失败写入异常审计流水。
- 平台：承诺 9/20 前提交 `/licenses/check`、`/credits/estimate` 接口的数据库 schema 与服务实现草案，实时同步 shared/status-feed.md。
- 结论：规格于 2025-09-18 评审通过，允许进入实现阶段，后续字段变更须通过 shared 变更流程。
## TODO
- 9/19 权限评审后，根据合规反馈更新错误码与字段说明

