# Platform API Integration Plan (credits/licenses/tasks)

日期：2025-09-19
负责人：frontend-build

## 摘要
- 9/18 platform-integration 完成 `/api/v1/credits/*`、`/api/v1/licenses/check` 的 FastAPI 实现与服务层测试，字段以 docs/api-design-notes.md v0.3 为准。
- 事件流协议（tasks + credits.updated + compliance.alert）在 docs/realtime-events.md 已定稿，需前端在接入实时推送时对齐。
- 合规团队确认 `policy_tag`、`reason_code` 枚举，所有接口响应需原样透传以支持审计。

## 接口对齐结论
### POST `/api/v1/credits/estimate`
- 请求字段：`tenant_id`, `user_id`, `template_id`, `scene`, `resolution`(`sd|hd|4k`), `priority`(`standard|accelerated`), `extras`(dict，可空)。
- 响应字段：`currency`, `template_id`, `scene`, `resolution`, `priority`, `current_balance`, `selected_cost`, `estimated_cost`, `min_cost`, `max_cost`, `calculation_basis`, `policy_tag`, `audit_id`, `suggest_topup`, `extras`, `options[] { priority, total_cost, eta_minutes }`。
- 头部约定：`X-Idempotency-Key`（可选但强烈建议，后端对齐 42201/2901 错误码时依赖）。
- 业务错误码：`42201 payload_invalid`, `40302 authorization_missing`, `50301 pricing_unavailable`, `2901 estimate_rate_limited`。
- 需要在前端枚举显示字段：`calculation_basis`, `policy_tag`, `suggest_topup`。

### POST `/api/v1/credits/pre-deduct`
- 请求字段：`task_id`, `template_id`, `tenant_id`, `user_id`, `scene`, `estimated_cost`, `currency`, `expire_in`(秒)。
- 响应字段：`pre_deduct_id`, `frozen_amount`, `balance_after`, `quota_snapshot { template_quota, user_usage }`, `expire_at`(ISO8601)。
- 错误码：`40302 insufficient_balance`，`40401 authorization_not_found`，`40901 pre_deduct_already_processed`。
- 成功后需缓存 `pre_deduct_id`，供 `/commit` 或 `/cancel` 使用。

### POST `/api/v1/credits/commit`
- 请求字段：`pre_deduct_id`, `actual_cost`, `task_id`, `tenant_id`, `template_id`, `user_id`。
- 响应字段同 `pre-deduct`，`frozen_amount` 表示最终扣费。
- 错误码：`40401 pre_deduct_not_found`, `40901 pre_deduct_already_processed`。

### POST `/api/v1/credits/cancel`
- 请求字段：`pre_deduct_id`, `tenant_id`, `user_id?`, `reason`。
- 响应字段：`pre_deduct_id`, `status`, `reason`, `balance_after`(string)。
- 错误码同 `/commit`。

### POST `/api/v1/credits/charge`
- 请求字段：`tenant_id`, `user_id`, `template_id`, `task_id?`, `amount`, `priority`, `reason`。
- 响应字段：`ledger_id`, `tenant_id`, `user_id`, `task_id`, `balance_after`, `change`, `reason`, `created_at`。
- 错误码：`40201 insufficient_balance`, `42201 amount_invalid`, `40302 authorization_missing`, `0901 idempotency_conflict`, `0302 ledger_unavailable`。

### GET `/api/v1/credits/ledger`
- 查询参数：`tenant_id`, `user_id?`。
- 响应：`entries[] { ledger_id, task_id, change, balance_after, reason, created_at }`。

### GET `/api/v1/credits/balance`
- 查询参数：`tenant_id`, `user_id?`。
- 响应：`balance`, `frozen`, `currency`。

### POST `/api/v1/licenses/check`
- 请求字段：`tenant_id`, `template_id`, `user_id`, `channel`(`viewer|creator|external`), `session_id?`。
- 响应字段：`is_authorized`, `reason_code`(`valid|expired|revoked|missing_documents|daily_quota_exceeded`), `remaining_quota`, `daily_remaining`, `valid_until`, `policy_tag`, `requirements[]`。
- 错误码：`40302 authorization_revoked`, `40303 daily_quota_exceeded`, `40401 template_not_found`, `0304 license_service_unavailable`。

### 任务事件 / 实时推送
- `/api/v1/tasks/{task_id}` 与 `/api/v1/tasks/{task_id}/events` 提供任务详情 + 历史事件；字段包含 `status`, `stage`, `progress`, `credits_delta`, `ts`, `next_eta`。
- `/api/v1/tasks/stream/mock` 返回 WebSocket/SSE 配置（`ws_url`, `sse_url`, `token`, `cadence`）；真实环境协议详见 platform-integration/docs/realtime-events.md。
- 事件类型包含 `task.accepted/running/completed/failed`, `credits.updated`, `compliance.alert`, `system.heartbeat`，需在前端进行转换并与现有 `TaskEvent` 类型对齐。

## 前端任务更新
1. 在 `src/lib/api/platformClient.ts` 实现上述接口的 fetch 封装（含请求体/响应体类型定义、错误映射、`policy_tag` 透传）。
2. 在 `api/index.ts` 暴露 `usePlatformAdapter` 方法以便运行时切换到真实服务（默认保持 mock）。
3. `useRealtimeFeed` 增加对 `/tasks/stream/mock` 的配置获取与心跳/重连占位逻辑，待 SSE 实现落地。
4. 模板与运营面板仍使用 mock 数据，等待 compliance 接口交付后落地。

## 阻塞与依赖
- 等待 platform-integration 输出 `/credits/refund` 最终实现（docs/api-design-notes.md 列为 TODO）。
- Realtime SSE 心跳/重试策略需在 9/21 埋点评审后再次确认。
- 授权缺失的提示文案由 content-ops 在 `content-ops/role-messaging-guide.md` 更新后接入。

## 参考资料
- platform-integration/docs/api-design-notes.md
- platform-integration/docs/api-credit-authorization-push.md
- platform-integration/docs/realtime-events.md
- shared/CHANGELOG.md（2025-09-18 条目）
