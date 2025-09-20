# Phase 2 Spec — Operations Compliance

## Context
- Phase 1 已交付基础审核/举报流程与图标素材，Phase 2 聚焦在“高效审核”“风险预警”“合规对账”三大板块。
- 目标是在 2025-09-30 前支持 reviewer 日均 150 单审核、实时识别高风险模板，并与埋点/指标体系打通。

## Goals
1. **提效审核**：提供标准化驳回原因、批量操作与 SLA 预警，确保 24h 审核承诺。
2. **风险透明**：搭建风控看板 MVP，向合规/产品提供实时指标与告警响应链路。
3. **数据闭环**：补齐审核/举报/积分回滚接口字段及埋点，保障后续 BI 与结算使用。

## Non-Goals
- 不涉及举报入口的前端视觉大改，仅补充提示文案与状态标签。
- 不包含自动化模型审核/AI 识别，需另行立项。

## Personas
| 角色 | 诉求 |
| ---- | ---- |
| Reviewer | 在 SLA 内完成审核、复核任务，并有明确驳回标准 |
| Compliance Ops | 监控风险、配置政策、处理积分回滚与处罚 |
| Product Ops | 获取指标、风险复盘数据，协调跨组资源 |
| Platform Integration | 实现接口字段、日志、推送保证数据一致 |

## Requirements
### R1 审核面板增强
- 提供标准驳回原因枚举、举报动作、积分回滚字段（见 `compliance-interface-fields-2025-09-18.md`）。
- 在前端面板中同步状态色、图标、SLA 倒计时提示（reviewer/ops 视图）。
- 权限校验：仅 Reviewer/Compliance Ops 可写操作，Content Ops 只读。

### R2 风控看板 MVP
- 指标源自 `risk-monitoring-indicators.md` 与 `risk-dashboard-mvp.md`。
- 支持 KPI 区、趋势图、预警列表、异常账号卡片；数据更新频率 15min。

### R3 埋点 & 指标补充
- 统一埋点枚举（policy_tag、alert_level、failure_code）写入 `shared/metrics/README.md`。
- 同步 shared daily 更新，确保 9/21 前完成跨组确认。

### R4 权限矩阵交付
- 在 9/19 评审前由 ops+platform 完成权限自检 (`permission-matrix-selfcheck-2025-09-19.md`)。
- 会议结论更新 `platform-integration/docs/api-permission-matrix.md` 并登记 CHANGELOG。

### R5 素材与文案
- 体验设计导出的 Hero/Quickstart/Persona/任务状态素材需在 9/18 完成，高保真替换前保持占位稿。
- content-ops 维护整改模板 (`notification-remediation-template-v1.md`) 与角色文案 (`role-messaging-guide.md`)。

## Dependencies
- Experience Design：高保真稿、SVG 素材、spec §11。
- Frontend Build：审核面板、风控看板、埋点落地。
- Platform Integration：接口字段、SSE、审计日志字段。
- Product Planning：phase1-baseline 指标与角色流程更新。
- Shared：CHANGELOG、assets-manifest、metrics README。

## Success Metrics
- 审核 SLA 超时率 ≤5%。
- 风控告警响应时长 ≤30 分钟。
- 报告字段缺失工单数为 0。

## Risks & Mitigations
- 素材延迟：保留占位图，并在 TODO/CHANGELOG 记录阻塞，推动体验设计确认。
- 接口字段变更：通过权限自检清单、CHANGELOG 日志保持同步。
- 埋点冲突：使用 `compliance-tracking-inputs.md` 提前对齐枚举与落地页面。

## Open Questions
- 是否需要 Reviewer 的批量审核功能？（待 9/19 评审确认）
- 风控看板是否需要历史回放模式？（待产品规划反馈）
