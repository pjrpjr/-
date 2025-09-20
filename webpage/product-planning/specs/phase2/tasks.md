# Phase 2 Task Breakdown

## 1. Mapping to Product Planning TODO
| Task ID | 描述 | Owner | 依赖 | 测试/验收 | TODO 引用 |
| ------- | ---- | ----- | ---- | ---------- | ---------- |
| T1 | 收集 9/21 埋点落地输入并更新 tracker/CHANGELOG | 产品规划 | platform-integration、frontend-build、operations-compliance、content-ops | 确认 shared/metrics/README.md 字段齐全 | `TODO.md` 第 8 项 |
| T2 | 跟进 9/25 交付项（wireframe、实时方案、接口评估、SOP、案例包） | 产品规划 | experience-design、frontend-build、platform-integration、operations-compliance、content-ops | deliverables tracker 9/25 节点全部标记 | `TODO.md` 第 9 项 |
| T3 | 设计令牌/素材对齐（协同体验/内容/前端） | 产品规划 | experience-design、content-ops、frontend-build | design tokens 使用说明 + assets manifest 更新 | `TODO.md` 第 10 项 |
| T4 | 角色文案 & 流程更新（PRD/SOP） | 产品规划 + operations-compliance | operations-compliance | PRD/SOP 更新 + role matrix checklist | `TODO.md` 第 11 项 |
| T5 | 风险复盘草稿完善 | 产品规划 + operations-compliance | 9/21/9/25 数据 | 风险复盘文档定稿 | `TODO.md` 第 12 项 |

## 2. Cross-Team Tasks (Phase 2)
| Task | Owner | 协作方 | 状态 | Notes |
| ---- | ----- | ------ | ---- | ----- |
| Landing 高保真 v1.1 & 素材交付 | experience-design | content-ops、frontend-build | 待交付 | 9/18 节点，参见 phase1-deliverables-tracker |
| 案例素材 & CTA 文案包 | content-ops | experience-design | 进行中 | 9/25 节点 |
| 风险 SOP v1.1 | operations-compliance | product-planning | 计划中 | 9/25 节点 |
| 实时通道方案 & 埋点实现 | frontend-build | platform-integration | 计划中 | 9/21/9/25 节点 |
| 接口实现计划（授权/算力） | platform-integration | frontend-build、product-planning | 计划中 | 9/21 节点 |

## 3. Testing Strategy
- 接口：通过 Mock + staging 调用 `/licenses/check`、`/credits/estimate` 验证字段。
- 埋点：在 staging 验证 `cta_click`、`license_apply`、`estimator_interact`、`risk_alert` 是否回传正确字段。
- 风险流程：演练 policy_tag=high_risk，确认 SOP 通知链。
- 文案/设计：体验设计与内容运营进行双人审核，确保 tokens、素材使用一致。

## 4. Reporting
- 每次完成/阻塞更新 `TODO.md` & `shared/CHANGELOG.md`。
- 在相关小组 TODO 留言记录依赖反馈时间。
- 每日 18:00 前更新 `phase1-deliverables-tracker.md` 与 `phase1-risk-review.md`。
