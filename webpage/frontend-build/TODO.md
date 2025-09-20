# 前端开发任务清单

> 统一执行指令：逐项执行本 TODO 的任务，完成后勾选并于 shared/CHANGELOG.md 登记状态/阻塞，跨组事项需在相关文档和 TODO 留言同步。

- [x] 搭建落地页入口（`/app/page.tsx`），版块结构与产品规划保持一致。
- [x] 实现可复用组件：Hero、MonetizationPath、CaseStudies、TemplateGrid、ComplianceNotice、QuickStartCTA。
- [x] 引入模拟数据层，覆盖模板信息、复盘指标、用户评价，并接入各组件。
- [x] 预留授权申请、积分充值、一键复刻等交互占位，处理加载与空状态。
- [x] 内建可访问性与数据采集基础：语义化标记、键盘流、ARIA、埋点钩子。
- [x] 校验设计令牌与素材占位（`docs/design-tokens-usage.md`、`docs/asset-loading-strategy.md`）。
- [x] 根据 `shared/role-matrix.md` 校准角色体验与权限（`docs/role-integration.md`）。
- [x] 2025-09-19：确认平台 `/credits/estimate`、`/licenses/check`、任务事件字段与错误码；更新 `docs/platform-api-integration-plan.md` 并记录 CHANGELOG。（docs/platform-api-integration-plan.md 已更新）
- [x] 2025-09-20：实现积分授权 API 适配层（`src/lib/api/platformClient.ts`），联调前先接入 mock 并编写单元测试。
- [x] 2025-09-21：按 `tracking-handshake-plan.md` 完成埋点扩展，覆盖 AnalyticsProvider、导航、模板、任务事件等；详情见 `docs/tracking-handshake-status.md` 与 shared/CHANGELOG.md。
- [x] 2025-09-22：落地实时推送，SSE 替换 `subscribeTaskEvents` mock，支持重试策略与首批事件加载；详见 `src/lib/api/platformClient.ts` 与 `docs/tracking-handshake-status.md`。
- [x] 2025-09-23：实现审核后台与举报面板 UI，接入 `operations-compliance/compliance-interface-fields-2025-09-18.md` 枚举，展示驳回原因、动作说明、积分回滚并更新 CHANGELOG。
- [x] 2025-09-24: Completed task lifecycle API integration, including hold/retry/refund flows, and refreshed `docs/realtime-push-plan.md` (taskLifecycle workflow shipped)
- [ ] 2025-09-25：联调复盘，整理前端侧验证报告（`docs/frontend-review-2025-09-25.md`），并在 CHANGELOG 记录结果。
- [ ] 2025-09-26：与产品规划启动 Phase2 前端规划（`phase2/frontend-outline.md`），定义新模块与技术投入。

> 留言（experience-design，2025-09-18 13:45）：Hero/Quickstart/任务状态/Persona 素材已交付至 `public/gradients|illustrations|icons`，请替换占位并按 high-fidelity-hand-off.md 落地样式。
