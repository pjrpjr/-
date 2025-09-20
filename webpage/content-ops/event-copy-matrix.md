# Event → Copy Matrix（Draft · 2025-09-19）

> 目的：在埋点计划与通知模板之间建立映射，结合 9/19 权限评审字段；待 9/21 埋点评审定稿。

| 事件 ID | 场景 | 前端埋点字段 | 通知/文案位置 | 当前状态 |
| --- | --- | --- | --- | --- |
| `cta_click` (`cta_id=hero_primary`) | 首屏主 CTA | cta_id=`hero_primary`、user_id（hash）、template_id（可选）、ab_bucket | landing-hero.md 主按钮文案 | 与 shared/metrics/README.md 对齐（2025-09-19），待多语言审校 |
| `cta_click` (`cta_id=hero_secondary`) | 首屏次 CTA | cta_id=`hero_secondary`、user_id（hash）、template_id（可选）、ab_bucket | hero-flow-design-handoff.md 次按钮文案 | 同上；待体验侧确认 hover 文案 |
| `license_apply` | 授权申请提交 | template_id、account_id（hash）、is_fast_track、persona_tag、policy_tag | role-messaging-guide.md §1「授权申请提交」 | 字段对齐 9/19 权限评审；9/21 评审确认触发条件 |
| `license_approved` | 授权审核通过 | license_id、template_id、account_id（hash）、approver_id、effective_at、expiry_type、max_runs | role-messaging-guide.md §1「授权通过」；notification-remediation-template-v1.md §1.1 | 文案已按 9/19 审核决议更新；待多语言补充 |
| `license_rejected` | 授权拒绝/撤销 | license_id、template_id、account_id（hash）、reason_code、policy_tag、action_required、appeal_deadline | role-messaging-guide.md §1「授权驳回」；notification-remediation-template-v1.md §1.2 | policy_tag 枚举已定稿；9/21 需确认 reason_code → 文案映射 |
| `credits_pre_hold` | 积分预扣通知 | pre_deduct_id、task_id、frozen_amount、balance_after、expire_in | notification-remediation-template-v1.md §1.2 | 文案完成；等待 `credits.balance_alert` 事件命名（见 TODO） |
| `credits_settled` | 积分结算通知 | pre_deduct_id、task_id、final_cost、refund、ledger_id、balance_after | 同上 §1.2 | 文案完成；9/21 联调校准金额格式 |
| `task_start` | 任务入队/排队提示 | task_id、template_id、queue_type、estimated_credits、is_fast_track | role-messaging-guide.md §1「任务排队」；quickstart-guide.md Step 2 | 字段确认完毕；待前端回传队列 CTA 展示策略 |
| `task_completed` | 任务完成 | task_id、template_id、credits_spent、output_count、result_url | role-messaging-guide.md §1「任务完成」；notification-remediation-template-v1.md §1.3 | 文案草稿就绪；多语言版本待 9/22 前提交 |
| `task_failed` | 任务失败（含违规失败） | task_id、template_id、failure_code、refunded_amount、violation_flag、policy_tag | notification-remediation-template-v1.md §2；role-messaging-guide.md §1「任务失败」 | policy_tag/violation_flag 已对齐；退款话术待 operations-compliance 最终确认 |
| `risk_alert` | 风控预警/拦截 | alert_id、task_id/template_id、policy_tag、risk_level、action_required、deadline | notification-remediation-template-v1.md §2；role-messaging-guide.md §1「风险预警」 | 枚举来自 compliance-tracking-inputs.md；9/21 评审需确认 action_required → CTA |
| `report.received` | 举报受理回执 | report_id、template_id、received_at、sla_confirm、reporter_channel | role-messaging-guide.md §1「举报受理」 | 文案更新 2025-09-19；需验证 sla_confirm 字段格式 |
| `report_closed` | 举报处理结果 | report_id、conclusion、action_taken、closed_at、appeal_link | notification-remediation-template-v1.md §2；role-messaging-guide.md §1「举报结果」 | action_taken 枚举同步完成；待 9/21 确认多语言 & 复盘流程链接 |


## TODO
- [ ] 9/21 埋点评审：确认字段取值、CTA 触发与落地时间，并在本表回写最终稿。
- [ ] 与 frontend-build 核对 `cta_id`、队列 CTA 展示策略及触发条件记录。
- [ ] 若 platform-integration 提供 `credits.balance_alert` 事件，补充至本表并同步 `role-messaging-guide.md`。
- [ ] 评审后 24h 内在 `shared/CHANGELOG.md` 登记结果与通知模板链接。

