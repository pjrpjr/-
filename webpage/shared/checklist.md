# 跨目录交付自检清单（Draft v0.1 · 2025-09-18）

> 目的：统一产品、设计、内容、前端、平台、合规在交付阶段需要核对的要点，减少跨目录遗漏。建议在 9/19 权限评审前完成首轮确认。

## 产品规划
- [ ] `phase1-baseline.md` 已记录最新里程碑、埋点计划与风险跟踪。
- [ ] PRD 中引用的文案、角色流程与体验稿一致（Hero 文案、Visitor→Viewer 提示等）。
- [ ] 接口需求 (`phase1-interfaces.md`) 与 platform-integration 文档字段同步。

## 体验设计
- [ ] 高保真稿与 `high-fidelity-hand-off.md`、`tracking-handshake-plan.md` 信息一致。
- [ ] 最新导出素材已写入 `shared/assets-manifest.md`，并告知前端/平台版本号。
- [ ] 角色自检清单（`role-matrix-checklist.md`）无缺项。

## 内容运营
- [ ] `hero-flow-design-handoff.md`、`landing-hero.md`、`notification-remediation-template-v1.md` 与高保真稿同步。
- [ ] `role-messaging-guide.md` 事件 ID/字段与平台接口一致。
- [ ] 案例素材路径及脱敏说明完整（`creator-success-stories.md`）。

## 前端开发
- [ ] 组件样式已对齐最新设计令牌/素材。
- [ ] 埋点标签与 `tracking-handshake-plan.md`、`shared/metrics/README.md` 对齐。
- [ ] WebSocket/SSE 事件字段与平台文档一致，错误兜底逻辑就绪。

## 平台集成
- [ ] `/credits/estimate`、`/licenses/check` 等接口最新草案（docs/api-*.md）与 PRD 描述一致。
- [ ] 权限矩阵（`docs/role-access-mapping.md`、`docs/api-permission-matrix.md`）已完成自检。
- [ ] `docs/delivery-schedule.md` 更新素材/接口节点状态。

## 运营合规
- [ ] `reporting-sop.md`、`task-exception-handling.md`、`compliance-interface-fields-2025-09-18.md` 已同步角色提示语与枚举。
- [ ] 风控素材、图标已在 `shared/assets-manifest.md` 标记状态。
- [ ] `risk-dashboard-mvp.md`、`risk-review-2025-09-25.md` 跟踪风险处理计划。

## Shared
- [ ] `shared/CHANGELOG.md` 当日新增条目记录交付/阻塞。
- [ ] `shared/assets-manifest.md` 状态、Owner、交付时间准确。
- [ ] 日终（18:00 前）向各组同步 checklist 更新情况。
- [x] 2025-09-21：埋点评审完成，shared/metrics/README.md 已更新合规字段。

