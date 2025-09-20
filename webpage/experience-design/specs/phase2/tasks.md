# Phase 2 Tasks Mapping

| 序号 | 任务 | 截止日期 | 负责人 | 依赖 | 测试/验收 |
| ---- | ---- | -------- | ------ | ---- | ---------- |
| T1 | 导出高保真素材（Hero/Quickstart/任务状态/Persona）并更新 manifest | 09-18 | Experience Design | Content Ops 文案、Ops Compliance 配色 | 检查 public 目录文件 & manifest 条目 |
| T2 | 记录素材交付状态并在 CHANGELOG 留痕 | 09-18 | Experience Design | T1 | CHANGELOG 新增记录 |
| T3 | 组织 Reviewer/Compliance 评审并更新 role-matrix-checklist.md | 09-19 | Experience Design + Ops Compliance | T1 完成 | 更新 checklist & CHANGELOG |
| T4 | 整理评审纪要并在 product-planning/ops TODO 留言 | 09-19 | Experience Design | T3 | TODO 留言记录 |
| T5 | 更新 tracking-handshake-plan.md v1.1，完成 shared 埋点评审 | 09-21 | Experience Design + Frontend Build + Shared + Platform Integration | T3 | 事件字段评审记录、CHANGELOG 更新 |
| T6 | 收集补扣/加速/SLA 联调录屏并更新 delivery-followup-plan.md | 09-25 | Experience Design + Frontend Build | T5、接口联调完成 | 录屏附件/截图、CHANGELOG 记录 |
| T7 | 更新风险复盘（risk-review-2025-09-25.md）与阶段总结 | 09-25 | Experience Design | T6 | 风险文档、CHANGELOG 更新 |

## TODO 对应关系
- `experience-design/TODO.md` 任务 5-8 对应 T1-T7。
- 完成后需在 TODO 勾选并注明完成时间+产出链接。

## Test & Review
- 素材导出：由 frontend-build 校验尺寸与命名。
- 评审事项：由 operations-compliance 与 product-planning 确认。
- 埋点方案：由 shared/monitoring & frontend-build 验证。
- 联调录屏：由 experience-design 与 frontend-build 共同确认真实场景。
