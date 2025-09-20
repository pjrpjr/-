# Phase 2 Planning

## 1. Timeline & Milestones
| 时间窗口 | 关键输出 | Owner | 依赖 |
| -------- | -------- | ----- | ---- |
| 9/18 | 素材交付（Hero 渐变、Quickstart 插画、案例示意图、Persona Badge） | experience-design, content-ops | shared/assets-manifest.md 路径、design tokens |
| 9/19 | 权限矩阵 & 角色流程自检复盘 | product-planning, operations-compliance | shared/role-matrix.md, reporting-sop.md |
| 9/21 | 埋点落地计划确认（字段、SDK、事件回传） | platform-integration, frontend-build, operations-compliance, content-ops, product-planning | shared/metrics/README.md, tracking-handshake-plan.md |
| 9/25 | 第一轮交付评审：wireframe v1.1、实时通道方案、接口评估、SOP v1.1、案例素材包 | experience-design, frontend-build, platform-integration, operations-compliance, content-ops | phase1-deliverables-tracker.md |
| 10/02 | 内测准备：埋点验证、风险仪表板草稿 | product-planning, operations-compliance | risk-dashboard-plan.md |

## 2. Workstreams & Tasks
### 2.1 体验设计
- 更新 `high-fidelity-hand-off.md` 至 v1.1（Hero 双 CTA、案例滑块、合规提示）。
- `tracking-handshake-plan.md` 标注 CTA variant、埋点位置。
- 上传素材至 `frontend-build/public` 并更新 `shared/assets-manifest.md`。

### 2.2 内容运营
- 更新 `hero-flow-design-handoff.md`、`role-messaging-guide.md`，提供故事/文案。
- 配合体验组完成素材命名与 CTA 文案包。

### 2.3 运营合规
- 补充 `assets-delivery-plan.md`、`risk-dashboard-plan.md`，提供 policy_tag 枚举与 SOP。
- 在 `risk-review-2025-09-25.md` 中准备复盘框架。

### 2.4 前端开发
- 对齐接口字段（`phase1-interfaces.md`），更新 docs/ 说明。
- 完成实时通道方案 `docs/sse-realtime-plan.md`，并与平台联调。

### 2.5 平台集成
- 评估 `/licenses/check`、`/credits/estimate` 实现计划，更新 `docs/api-credit-authorization-push.md` 等。
- 输出权限矩阵更新 `docs/api-permission-matrix.md`。

### 2.6 产品规划
- 维护 `phase1-deliverables-tracker.md`、`phase1-risk-review.md`，收集阻塞。
- 准备 PRD 更新与复盘议程。

## 3. Dependencies & Risks
| 类型 | 描述 | 缓解 |
| ---- | ---- | ---- |
| 素材 | 体验/内容延期 | 追踪 + 占位图，shared/CHANGELOG 跟进 |
| 接口 | 平台评估滞后 | Mock + 每日同步 |
| 埋点 | 字段不一致 | tracking-handshake-plan 复核 |
| 角色流程 | 合规/SOP 未更新 | 定期同步 role-matrix checklist |

## 4. Communication Plan
- 每日：在 `phase1-deliverables-tracker.md` 更新状态，同时 shared/CHANGELOG 撰写。
- 周一/周四：跨组 standup，review 阻塞。
- 关键节点前 24h 在相关 TODO 留言确认交付。

## 5. Exit Criteria
- Phase 2 规格通过评审（体验、前端、平台、合规、内容均确认）。
- 所有交付项在 tracker 中标记完成并存档。
- shared/CHANGELOG 无未解决阻塞，风险复盘草稿 ready。
