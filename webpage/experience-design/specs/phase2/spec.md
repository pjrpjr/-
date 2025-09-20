# Phase 2 Spec – Experience Design Delivery Readiness

## 1. Context
- Phase 1 完成了首屏/任务中心低保真、交互规格与风险盘点，当前进入 Phase 2，目标是在 9/18-9/25 期间交付全部高保真与实现支撑材料。
- 本阶段侧重资产导出、角色体验校准、埋点协同以及联调验证，需与 frontend-build、content-ops、platform-integration、operations-compliance、shared 高度协同。

## 2. Goals
1. 于 2025-09-18 前交付全部高保真素材（Hero 渐变、Quickstart 插画、任务状态图标、Persona Badge），并更新 shared/assets-manifest.md。
2. 于 2025-09-19 完成 Reviewer/Compliance 视图评审并确认角色矩阵差异，输出评审纪要。
3. 于 2025-09-21 锁定埋点交付（tracking-handshake-plan.md v1.1），明确事件、字段、落地节点。
4. 于 2025-09-25 完成前端联调验证，收集补扣/加速/SLA 录屏并更新交付跟进与风险复盘。

## 3. Non-goals
- 不涉及新增产品需求或业务规则改动。
- 不在本阶段设计/交付管理后台的高保真界面（由后续 Phase 3 处理）。
- 不处理后端接口实现细节，只提供交互与埋点需求。

## 4. Deliverables
| 交付物 | 描述 | 存放路径 |
| ------ | ---- | -------- |
| 高保真素材包 | Hero/Quickstart/任务状态/Persona 素材导出与说明 | `frontend-build/public/...` + `shared/assets-manifest.md` |
| 角色评审纪要 | Reviewer/Compliance 评审笔记、更新后的 checklist | `experience-design/role-matrix-checklist.md` + `shared/CHANGELOG.md` |
| 埋点计划 v1.1 | 事件列表、字段映射、实现节点 | `experience-design/tracking-handshake-plan.md` |
| 联调验证包 | 补扣/加速/SLA 录屏或截图、交付跟进计划、风险复盘更新 | `experience-design/delivery-followup-plan.md`、`risk-review-*.md` |

## 5. Stakeholders
- Experience Design（owner）
- Frontend Build（组件实现、埋点落地）
- Content Ops（文案与素材命名）
- Platform Integration（接口字段、推送节奏）
- Operations Compliance（角色流程、警示策略）
- Shared Team（资产管理、指标管理）

## 6. Dependencies & Risks
- 素材导出依赖 content-ops/operations-compliance 对文案与配色的最终确认。
- 接口字段依赖 platform-integration 在 9/18 前锁定 `/credits/estimate`,`/credits/charge`,`/tasks` 推送结构。
- 埋点计划需 shared/monitoring 组 9/21 评审通过，否则联调可能延迟。
- 前端联调取决于 frontend-build 接口串联与 mock 替换进度。

## 7. Milestones
| 日期 | 里程碑 | 验收标准 |
| ---- | ------ | -------- |
| 09-18 | 高保真素材导出 | `shared/assets-manifest.md` 更新，public 目录资源齐备 |
| 09-19 | 角色评审 | `role-matrix-checklist.md` 更新 + 评审纪要登记 | 
| 09-21 | 埋点确认 | `tracking-handshake-plan.md` v1.1 提交，shared 记录完成 |
| 09-25 | 联调复盘 | `delivery-followup-plan.md` 更新，录屏/截图存档，风险复盘补充 |

## 8. Acceptance Criteria
- 所有交付物在对应路径可查阅，并在 shared/CHANGELOG.md 留痕。
- 跨组依赖均已通过留言或会议纪要确认，无阻塞项超过 24h 未响应。
- 高保真稿与实现细节获得前端、合规确认，埋点字段经 shared 审核。

## 9. Open Questions
- 平台积分补扣自动化策略是否改版？（若有调整需在 9/18 前反馈）
- Compliance Ops 风控面板是否在 Phase 2 追加视觉交付？（等待 9/19 评审决定）
