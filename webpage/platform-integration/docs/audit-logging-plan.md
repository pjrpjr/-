# 任务留痕与合规日志体系设计

## 1. 目标
- 记录出图/训练任务的提示词、参数、授权关系、积分扣费明细和操作人。
- 满足审计、追责与运营追踪要求，支持至少 180 天留存。

## 2. 数据模型
| 表 | 关键字段 | 说明 |
| --- | --- | --- |
| `task_audit_logs` | `audit_id`, `task_id`, `tenant_id`, `user_id`, `scene`, `prompt_snapshot`, `params`, `authorization_id`, `credits_ledger_id`, `status`, `created_at` | 任务级留痕 |
| `task_state_history` | `history_id`, `task_id`, `stage`, `progress`, `from_status`, `to_status`, `ts`, `operator` | 状态变化记录 |
| `audit_access_log` | `access_id`, `operator`, `tenant_id`, `task_id`, `action`, `reason`, `ts` | 查询/导出审计 |

## 3. 写入策略
- 任务创建：写入 `task_audit_logs`，保存 prompt/参数 snapshot（脱敏关键字）。
- 状态推送：每次 `stage` 变化写入 `task_state_history`。
- 扣费结果：关联 `credits_ledger_id`，记录最终消耗。
- 运营/合规手动干预（暂停/退款）：写入 `audit_access_log`。

## 4. 合规要求
- 提示词脱敏：过滤手机号、邮箱、身份证等敏感信息。
- 权限控制：仅 Reviewer/Compliance/Admin 可查询；平台管理员导出需多因子、审批流。
- 保留策略：`task_audit_logs` 180 天，`task_state_history` 90 天，`audit_access_log` 360 天。

## 5. 查询接口草案
- `GET /api/v1/tasks/{task_id}/audit`：返回任务留痕快照。
- `GET /api/v1/task-audit/search`：支持按租户/时间段/状态组合查询（分页）。
- `POST /api/v1/task-audit/export`：异步导出，需审批。

## 6. 与安全合规、数据平台协作
- 2025-09-18 前确认脱敏规则与日志保留时间。
- 2025-09-19 前对接数据平台，确认日志入湖策略（Kafka -> HDFS/ODS）。
- 2025-09-21 前完成接口权限矩阵更新，纳入 `audit.read` scope。

## 7. 下一步
- 2025-09-19：提交字段字典给数据平台（`data-dictionary/task-audit.json`）。
- 2025-09-22：实现 Mock 接口，验证查询结构。
- 阻塞：等待合规确认脱敏规则（预计 9/18）。
