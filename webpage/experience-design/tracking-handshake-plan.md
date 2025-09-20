# Tracking Handshake Plan（体验设计 · 2025-09-21 准备）

## 目标
对照 `shared/metrics/README.md` 的 Phase 1 关键事件，确保高保真稿中的文案、控件与埋点触发元素一致，便于前端落地。

## 事件映射
| 事件 ID | 场景 | 触发元素 | 设计标注 | 负责团队 |
| -------- | ---- | -------- | -------- | -------- |
| hero_primary_click | Hero CTA | `立即上传灵感素材` 按钮 | High-fidelity Hero Primary CTA，标注 `data-analytics="hero-primary"` | frontend-build |
| hero_secondary_click | Hero CTA 次按钮 | `查看盈利案例` 链接 | Hero Secondary CTA，标注 `data-analytics="hero-secondary"` | frontend-build |
| quickstart_step_view | Stepper | Step 卡片曝光/切换 | Step 卡片右上角埋点标签 `data-step="{index}"` | frontend-build |
| demo_replicate_click | 模板卡 CTA | `一键复刻` 按钮 | TemplateGrid CTA；需带 `data-template-id` | frontend-build |
| topup_banner_click | 补扣弹窗 | `立即补扣` 按钮 | Modal Primary CTA；沿用 `data-analytics="topup-confirm"` | frontend-build |
| accelerate_banner_click | 队列加速横幅 | `使用 20 积分` / `使用 50 积分` | Banner CTA；标注 `data-analytics="accelerate-20" / "accelerate-50"` | frontend-build |
| report_submit | 举报面板 | `提交举报` 按钮 | 审核面板 CTA；引用 SOP 字段 `report_reason` | frontend-build |
| review_timer_overdue | 举报复核倒计时 | SLA 逾期提示 Toast | 提示语须展示 `policy_tag` + `action_required`，强调整改步骤 | operations-compliance |
| risk_alert_banner | 风控面板提示 | 风控告警横幅 | 展示 `policy_tag`、`risk_level`、`action_required`、`escalation_level`；Badge 色值参考 compliance 输入表 | operations-compliance |
| queue_eta_update | 任务中心 | WebSocket 推送 `next_eta` | 任务卡显示倒计时；埋点记录 ETA 区间 | platform-integration |

## 数据要求
- 所有事件需附带 `role`、`policy_tag`、`risk_level`、`action_required`、`escalation_level`、`credit_balance`、`queue_position` 等上下文字段（参见 shared/metrics）。
- 设计稿中已在 Hero、Stepper、模板卡、补扣弹窗上标注 `data-analytics` 提示，前端落地时需保持一致。
- operations-compliance 提供的 `compliance-tracking-inputs.md` 已包含 policy_tag 枚举（A1~D3）与 action_required 映射；体验设计需同步颜色与文案。

## 时间线
- **9/18**：在最新 Figma 高保真稿标注埋点标签，并导出示例截图（已完成）。
- **9/21**：与 shared、前端、平台联合评审埋点方案；会上使用本文件记录结论并同步 `shared/metrics/README.md`。
- **9/25**：收集联调录屏/截图验证埋点触发正确，结果回填 `delivery-followup-plan.md`。

## 协同事项
- product-planning：确认 CTA A/B 文案是否影响埋点命名。
- frontend-build：联调时如需新增字段，请在 `shared/CHANGELOG.md` 登记并通知体验设计更新标注。
- operations-compliance：确认逾期提示语与 policy_tag / action_required 映射，避免与风控色板冲突。
