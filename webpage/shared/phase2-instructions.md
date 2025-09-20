# Phase2 指令总览（Spec-Kit + TDD）

## 共通执行流程
- 阅读本目录 `specs/phase2/spec.md`、`plan.md`、`tasks.md`（如缺失需先补齐），确认规格与计划已定稿。
- 按 `tasks.md` / `TODO.md` 逐项推进：先补/写测试，再实现功能代码，人工自审后提交。
- 完成或遇阻塞时，在 `TODO.md` 勾选并备注，并在 `shared/CHANGELOG.md` 记录状态；跨组事项需在相关文档及对方 TODO 留言确认。
- 每日 18:00 前同步进展，确保 Spec→Plan→Tasks→Implement 与 TDD 闭环。

---

## Product Planning
- 9/21 前：汇总埋点落地计划（`phase1-baseline.md` “埋点落地计划” & `phase1-deliverables-tracker.md`），将四组承诺与阻塞记录到 shared/CHANGELOG.md。
- 9/21-9/22：与 shared/体验/前端评审埋点定稿后，生成《Phase1 埋点执行清单》并分发。
- 9/23：产出 Phase2 规格大纲（`phase2-outline.md`），补充产品视角，保持 Spec-Kit 格式。
- 9/25：更新 `phase1-baseline.md` “9/25 交付跟进”，同步五项交付状态至 CHANGELOG。
- 9/26：完成《Phase1 风险与应对复盘》（`phase1-risk-review.md`）。
- 9/27：与 shared 确认 Phase2 规格评审排期并记录。

## Experience Design
- 9/19：记录角色/权限评审结论（`role-matrix-checklist.md`），若提示语调整，更新 `experience-design-spec.md` §11 并登记 CHANGELOG。
- 9/20：按前端反馈补充补扣/加速动效说明，更新 `high-fidelity-hand-off.md`、原型链接。
- 9/21：与 shared/产品/前端确认埋点标签，更新 `tracking-handshake-plan.md` 与相关引用。
- 9/23：交《Phase1 视觉 QA 清单》初稿（docs/visual-qa-checklist.md）。
- 9/25：整理联调截图/录屏，更新 `delivery-followup-plan.md` 与风险复盘记录。
- 9/26：起草 Phase2 体验 Spec（`phase2/spec.md`）。

## Content Ops
- 9/19：根据角色评审更新 `role-messaging-guide.md`，在 CHANGELOG 留痕。
- 9/20：与体验/前端对齐高保真文案，如有改动 24h 内更新 `landing-hero.md` 等文档。
- 9/21：产出事件→文案对照表（`event-copy-matrix.md`），同步埋点计划。\n  - 状态：2025-09-18 已创建草稿文件，等待 9/21 埋点评审定稿。
- 9/23：更新 `faq.md`，新增补扣/加速相关问答。
- 9/25：依据联调结果调整 `notification-remediation-template-v1.md`、`role-messaging-guide.md`。
- 9/26：整理 Phase2 内容规格提纲（`phase2-content-outline.md`）。

## Operations Compliance
- 9/19：评审后更新 `role-permission-review.md`、`reporting-sop.md`，并在 CHANGELOG 记录结论；补齐 `docs/api-permission-matrix.md`。
- 9/20：替换 `frontend-build/public/admin/*` 占位素材，更新 `shared/assets-manifest.md`。
- 9/21：提供 `compliance-tracking-inputs.md` 最终版（policy_tag、risk_level 枚举），写入 shared/metrics/README.md。
- 9/22：交付风控监控面板 MVP（`risk-dashboard-plan.md`）。
- 9/23：确认任务异常回滚接口，必要时更新 `task-exception-handling.md`。
- 9/25：整理 `risk-review-2025-09-25.md`，总结联调事件。
- 9/27：撰写 Phase2 合规规划（`phase2-compliance-outline.md`）。

## Frontend Build
- 9/19：确认 `/credits/estimate`、`/licenses/check`、任务事件字段/错误码，更新 `docs/platform-api-integration-plan.md` 并记 CHANGELOG。
- 9/20：实现积分授权 API 适配层（`src/lib/api/platformClient.ts`），先写测试再实现。
- 9/21：根据埋点结论落地事件上报。
- 9/22：接入实时推送（WebSocket/SSE），替换 mock 并完善回连/兜底逻辑。
- 9/23：实现审核/举报面板 UI，字段参考 `operations-compliance/compliance-interface-fields-2025-09-18.md`，完成后提 PR。
- 9/24：完成任务中心联调，更新 `docs/realtime-push-plan.md`。
- 9/25：编写前端联调复盘（`docs/frontend-review-2025-09-25.md`），登记 CHANGELOG。
- 9/26：准备 Phase2 前端规划文档（`phase2/frontend-outline.md`）。

## Platform Integration
- 9/18：补 `docs/api-design-notes.md`，输出 `/licenses/check`、`/credits/estimate` v0.2；更新 `docs/platform-static-assets.md`。
- 9/19：与合规补齐 `docs/api-permission-matrix.md` 并记录结论。
- 9/20：实现 `/credits/estimate`、`/credits/charge`、`/licenses/check` 并附单元测试。
- 9/21：根据埋点评审更新事件 payload 字段与文档。
- 9/22：完成实时推送事件契约（`docs/realtime-events.md`）。
- 9/23：交任务留痕/合规日志方案（`docs/audit-log-plan.md`）。
- 9/24：上线测试环境，配合前端联调。
- 9/25：提交平台联调复盘（`docs/platform-review-2025-09-25.md`）。
- 9/26：撰写 Phase2 后端规划（`phase2/backend-outline.md`），纳入深度学习服务。

## Shared
- 持续记录 CHANGELOG，协调跨组改动。
- 推进训练系统/社区/后台路线图和平台文档归档。
- 9/21：组织埋点评审，更新 `shared/metrics/README.md`。
- 9/25：汇总自检结果，登记跨组交付完成情况。
- 每日 18:00 前完成状态广播，阻塞即时记录。
