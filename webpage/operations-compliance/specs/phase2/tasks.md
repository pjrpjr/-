# Phase 2 Task List — Operations Compliance

| Task ID | 描述 | 负责人 | 依赖 | 测试要求 | 状态 |
| ------- | ---- | ------ | ---- | -------- | ---- |
| T1 | 权限矩阵自检清单准备与 9/19 评审结论回写 | Ops Compliance + Platform Integration | specs/phase2/spec.md §R4, plan.md W3 | 权限中间件集成测试、审计日志字段校验 | 准备完成，待 9/19 评审 |
| T2 | 埋点合规字段落地（更新 shared/metrics/README.md） | Ops Compliance + Shared + Product Planning | specs/phase2/spec.md §R3, plan.md W3 | 埋点 SDK 日志验证、policy_tag/alert_level/failure_code 枚举测试 | 草案完成，9/21 跨组确认 |
| T3 | 风控看板 MVP 实施（KPI/趋势/预警/异常） | Frontend Build + Platform Integration + Ops Compliance | risk-dashboard-mvp.md, plan.md W2 | Mock 数据单元测试、SSE 断线重连、指标阈值触发脚本 | 规划中 |
| T4 | 审核面板增强（驳回原因、举报动作、回滚字段） | Frontend Build + Ops Compliance | compliance-interface-fields-2025-09-18.md, audit-panel-fields.md | 前端单测、手动核对下拉选项、接口枚举校验 | 规划中 |
| T5 | 合规素材高保真交付与替换 | Experience Design + Ops Compliance | assets-delivery-plan.md, design-token-strategy.md | 静态资源加载验证、命名规范检查 | 阻塞：待 XD 导出 |
| T6 | 风控复盘与风险行动项（9/25） | Ops Compliance + Shared + Product Planning | risk-review-2025-09-25.md, plan.md Milestones | 指标对账、复盘文档审阅 | 规划中 |
