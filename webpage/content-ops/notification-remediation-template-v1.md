# 通知与整改模板 V1

> 依据 `platform-integration/docs/api-credit-authorization-push.md` 与 `operations-compliance/task-exception-handling.md`、`operations-compliance/reporting-sop.md` 确认，整理通知字段、触发规则与整改沟通流程，供 content-ops、platform-integration、operations-compliance 联合使用。

## 1. 系统通知字段矩阵

| 通知场景 | 事件标识 | 触发节点 | 必填字段（payload） | 说明 |
| -------- | -------- | -------- | ------------------- | ---- |
| 授权开通成功 | `authorization.approved` | `POST /api/v1/authorizations/import` 审核通过后 | `authorization_id`, `template_id`, `tenant_id`, `user_id`, `valid_from`, `valid_to`, `usage_limit` | 与授权日志表保持一致；用于通知创作者授权已生效。 |
| 授权吊销 | `authorization.revoked` | `/authorizations/revoke` 成功后 | `authorization_id`, `template_id`, `revoked_by`, `reason_code`, `effective_at` | 通知需提示剩余积分影响与申诉入口。 |
| 积分预扣 | `credits.pre_hold` | `POST /api/v1/credits/pre-deduct` 成功 | `pre_deduct_id`, `task_id`, `tenant_id`, `template_id`, `frozen_amount`, `balance_after`, `expire_in` | 站内提醒任务占用额度，短信可选。 |
| 积分结算 | `credits.settled` | `/api/v1/credits/commit` | `pre_deduct_id`, `task_id`, `final_cost`, `refund`, `balance_after`, `ledger_id` | 提供流水号供创作者对账。 |
| 任务状态更新 | `task.state.changed` | WebSocket/SSE 推送 | `task_id`, `status`, `result_url`(可选), `credits`{`pre_deduct_id`,`final_cost`,`refund`}, `authorization`{`authorization_id`,`template_id`}, `ts` | 前端用于实时刷新任务中心状态。 |
| 训练成功 | `training.succeeded` | 训练子系统回调成功 | `task_id`, `model_id`, `completed_at`, `entry_url`, `suggested_templates[]` | 通知附带后续动作 CTA。 |
| 训练失败 | `training.failed` | 训练回调失败 & `/credits/cancel` 完成 | `task_id`, `failed_stage`, `error_code`, `error_message`, `refunded_amount`, `ledger_id` | 需要结合整改流程说明重试方式。 |
| 违规预警 | `compliance.alert` | AI 预检高风险或人工判定 | `task_id`/`template_id`, `risk_level`, `violation_code`, `snapshot_url`, `action_required`, `deadline` | 触发整改流程，必须在 12h 内发送。 |
| 举报受理 | `report.received` | 举报系统生成单号 | `report_id`, `template_id`, `reporter_channel`, `received_at`, `sla_confirm` | 回执通知举报人。 |
| 举报处理结果 | `report.closed` | 举报流程结案 | `report_id`, `conclusion`, `action_taken`, `closed_at`, `appeal_link` | 站内信 + 邮件同步。 |

### 字段说明
- `violation_code` 与 `operations-compliance/template-review-standards.md` 中的红线编号一致。
- `action_required` 使用值域 {`resubmit_material`, `update_copy`, `remove_asset`, `appeal_only`}。
- `deadline` 默认填入整改截至时间（ISO8601）。
- 所有金额/积分字段统一单位为积分点数（point）。

## 2. 通知文案映射

| 场景 | 站内信标题 | 短信占位符 | 重点提示 |
| ---- | ---------- | ---------- | -------- |
| 授权开通 | `授权已生效，开始批量出图吧` | `{昵称}，授权已生效，登录即可开跑任务。退订回 N` | 强调平台不抽成、附任务中心入口。 |
| 积分冻结/结算 | `任务{task_id}积分已锁定/结算` | `任务{task_id}余额仅剩{balance_after}积分` | 需提示到期时间和对账方式。 |
| 训练失败 | `训练失败，已自动退款积分` | `训练失败，已退回{refunded_amount}积分` | 引导查看失败原因与整改指南。 |
| 违规预警 | `检测到可能违规元素，请尽快处理` | `模板{template_id}存在风险，请3小时内整改` | 包含整改截止时间与申诉入口。 |
| 举报处理 | `举报单{report_id}已处理` | `举报{report_id}结果：{conclusion}` | 根据处理结果提示下一步（复核或感谢）。 |

详细文案请参考 `notification-templates.md`，本模板侧重字段与流程对齐。

## 3. 整改流程（与 operations-compliance 对齐）

1. **预警触发**（0h）：收到 `compliance.alert` 或举报成立，平台自动下发站内信/邮件。
2. **信息同步**（≤1h）：
   - `operations-compliance` 在工单系统登记 `violation_code`、`risk_level`、`action_required`。
   - 若需下架，调用平台接口并记录 `task_id/template_id`。
3. **创作者响应**（≤12h）：
   - 创作者需在截止时间前提交整改材料或说明；若无法在 12 小时内提交，需在站内信中点击“申请延期”。
   - 系统在 `deadline` 前 2 小时再次提醒。
4. **复核处理**（提交后 ≤24h）：
   - `operations-compliance` 复核材料，在 `reporting-sop.md` 流程内更新工单状态。
   - 结果通过 `report.closed` 或二次 `compliance.alert` 通知。
5. **积分与任务处理**：
   - 若最终违规成立，调用 `/credits/cancel` 退款，并在通知中写明 `refunded_amount` 与处罚。
   - 若恢复，调用 `/tasks/restore`（待 platform-integration 提供）并发送恢复通知。
6. **复盘归档**：事件闭环后 1 个工作日内在 `shared/CHANGELOG.md` 追加记录，包含处理结果与改进项。

## 4. 交付物与责任归属

| 项目 | 责任团队 | 内容 | 状态记录 |
| ---- | -------- | ---- | -------- |
| 通知字段对齐 | platform-integration × content-ops | Output schema & placeholder | `content-ops/TODO.md` 第 1 项 |
| 整改流程确认 | operations-compliance × content-ops | SLA、通知时序、处罚动作 | `content-ops/TODO.md` 第 2 项 |
| 文案落地 | content-ops | 站内信/短信/邮件内容 | `notification-templates.md` |
| 系统实现 | platform-integration | 推送服务、API 接入 | `platform-integration/TODO.md` 对应条目 |
| 合规复核 | operations-compliance | 工单流程、处罚执行 | `operations-compliance` 工单系统 |

## 5. 下一步协同
- 由 platform-integration 在 D1 内输出最终 OpenAPI JSON，并附上以上字段。
- operations-compliance 需反馈整改流程中是否新增审批节点，如有调整请同步 `shared/CHANGELOG.md`。
- content-ops 后续按多语言计划扩展通知模版，并保持字段占位符一致。


## 6. 可视化规范补充
- Hero/任务中心等通知入口请使用 `shared/design-tokens.md` 中的角色主题色：Viewer 使用 `var(--color-accent)`，Creator 使用 `#9333ea`。
- 风险/整改提示建议在 UI 中表现为 `var(--color-warning)` 背景 10% 透明度 + `#dc2626` 文本，保持与高保真稿一致。
- Toast 与浮层按钮沿用 Button Primary/Secondary 组件样式，避免自定义色值。
