# Phase 2 Plan – Experience Design

## Implementation Strategy
1. **Asset Delivery Sprint (至 09-18)**
   - 与 content-ops/operations-compliance 确认最终文案与配色。
   - 导出 Hero/Quickstart/任务状态/Persona 素材，提交至 `frontend-build/public`。
   - 更新 `shared/assets-manifest.md` 并在 CHANGELOG 留痕。
2. **Role Review Sprint (09-18 ~ 09-19)**
   - 组织 Reviewer/Compliance 评审会，校准角色体验与警示策略。
   - 更新 `role-matrix-checklist.md`，记录差异与后续动作。
3. **Metrics Alignment Sprint (09-19 ~ 09-21)**
   - 与 shared/monitoring、frontend-build、platform-integration 开会确认事件字段。
   - 发布 `tracking-handshake-plan.md` v1.1，并同步相关 TODO。
4. **Implementation Validation Sprint (09-21 ~ 09-25)**
   - 协调前端联调，收集补扣/加速/SLA 录屏或截图。
   - 更新 `delivery-followup-plan.md`、`risk-review-*.md`，在 CHANGELOG 记录阶段总结。

## Resource & Time Allocation
| Sprint | 负责人 | 主要输出 |
| ------ | ------ | -------- |
| Asset Delivery | Experience Design (owner)、Content Ops、Ops Compliance | 素材导出、manifest 更新 |
| Role Review | Experience Design、Ops Compliance、Product Planning | 评审纪要、checklist 更新 |
| Metrics Alignment | Experience Design、Frontend Build、Shared、Platform Integration | 埋点计划 v1.1 |
| Implementation Validation | Experience Design、Frontend Build、Ops Compliance | 录屏/截图、风险复盘 |

## Communication Plan
- 每日 18:00 前在 `shared/CHANGELOG.md` 更新阶段状态。
- 关键节点（素材导出、评审、埋点确认、联调完成）立即通知相关小组并在其 TODO 留言。
- 使用共享日历同步 09-19、09-21 评审会议时间。

## Exit Criteria
- 所有 Phase 2 里程碑完成且 CHANGELOG 中状态为“已完成”。
- 前端确认可根据高保真稿实现，无阻塞。
- 下一阶段（Phase 3）所需的输入资料准备齐全。
