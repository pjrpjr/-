# operations-compliance 对接方案

## 1. 功能范围
| 功能 | API | 说明 |
| --- | --- | --- |
| 审核结果回写 | `POST /api/v1/reviews/callbacks` | operations-compliance 触发，写入审核状态、备注、有效时间。|
| 模板上下架 | `POST /api/v1/templates/{id}/status` | 合规上下架模板，写入审计。|
| 举报处理 | `POST /api/v1/reporting/{id}/actions` | 处理举报，支持挂起/驳回/通过。|
| 人工退款 | `POST /api/v1/credits/refund` | 合规审核后执行积分退款。|

## 2. 数据流
- 审核通过 → 更新模板状态、通知创作者/用户。
- 审核驳回 → `task_exception_logs` 记录原因，触发运营文案。
- 举报处理 → 调用异常策略中的退款/撤销流程。

## 3. 权限与日志
- scope：`compliance.review`, `compliance.ops`。
- 所有操作写入 `audit_access_log`。
- 人工退款需双人审批：合规提交 → 财务确认 → 平台执行。

## 4. 联调计划
- 2025-09-19：确认字段枚举（参考 `operations-compliance/compliance-interface-fields-2025-09-18.md`）。
- 2025-09-21：完成审核回写/举报处理联调。
- 2025-09-25：风控复盘时回顾人工退款流程。

## 5. 待办
- 更新 docs/api-credit-authorization-push.md 引用人工退款接口。
- 与 operations-compliance 确认回写 SLA（24h）。
- 记录异常情况（操作失败）到风险看板。
