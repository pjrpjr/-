# Phase 2 Specification
*Last updated: 2025-09-17*

## 1. Overview
Phase 2 focuses on把 Phase 1 MVP 升级为可复用的落地-授权闭环，强化信任与合规。

## 2. Goals & Success Metrics
| Goal | Metric | Target | Notes |
| ---- | ------ | ------ | ----- |
| 提升访客转化 | Visitor→Viewer 注册率 | ≥ 28% | Phase 1 基线约 18% |
| 提升授权效率 | Viewer 首次授权完成率 | ≥ 45% | 需埋点追踪 |
| 降低合规风险 | policy_tag=high_risk 授权占比 | ≤ 5% | 通过 SOP、提示控制 |
| 运营可视化 | 风险/告警响应时效 | ≤ 2 小时 | 输出监控面板 |

## 3. Scope
### 3.1 In Scope
- Landing 高保真升级（Hero 双 CTA、案例滑块、合规提示、热度榜）
- 授权前体验：授权检查、算力估算、余额提醒、注册引导
- Creator/Viewer 证据展示：模板故事、收益路径、素材包
- 风险可视：policy_tag 呈现、SOP 联动、风险 dashboard
- 埋点：CTA、授权、算力、告警事件上报

### 3.2 Out of Scope
- 模板训练、社区互动、后台深度能力
- 非 Web 客户端

## 4. Personas & JTBD
- Creator Studio：验证模板可变现 → 需要案例与收益路径
- Operator Contractor：批量出图 → 需要授权透明与风险提示

## 5. Experience Narrative
1. Visitor 访问 Landing，看到信任要素与双 CTA
2. 查看案例→注册成 Viewer
3. Viewer 访问模板详情，了解授权、policy_tag
4. 发起授权 → `/licenses/check` 校验
5. 算力估算 → `/credits/estimate` 反馈区间
6. 高风险 case → 风险提示 + SOP
7. 指标/风险复盘 → `phase1-risk-review.md`

## 6. Functional Requirements
| ID | 描述 | 依赖 | 验收 |
| -- | ---- | ---- | ---- |
| FR-1 | Landing 高保真落地 & 双 CTA A/B | experience-design, frontend-build | Figma v1.1 → 生产上线，埋点生效 |
| FR-2 | 授权详情显示 policy_tag、剩余次数 | platform-integration, frontend-build | `/licenses/check` 字段可用 |
| FR-3 | 算力估算器返回 min/max/estimated | platform-integration | `/credits/estimate` 与埋点一致 |
| FR-4 | policy_tag=high_risk 时显示警示+SOP | operations-compliance, frontend-build | 风险演练通过 |
| FR-5 | 埋点事件：CTA、授权、算力、告警 | platform-integration, frontend-build, operations-compliance | shared/metrics/README.md 字段齐 |
| FR-6 | Deliverables tracker & risk review 更新 | product-planning, operations-compliance | 文档更新并在 CHANGELOG 记录 |

## 7. Non-Functional Requirements
- LCP ≤ 2.5s；估算接口 ≤ 1s
- 主要流程 ≤ 3 分钟完成
- 授权失败提示清晰（401/403/409/429）

## 8. Dependencies
- experience-design：高保真、design tokens、插画素材
- content-ops：案例素材、CTA 文案
- frontend-build：Landing 实现、埋点集成
- platform-integration：接口实现、字段定义
- operations-compliance：SOP、风险指标

## 9. Risks & Mitigations
| 风险 | 缓解 |
| ---- | ---- |
| 素材延迟 | tracker 跟踪 + 占位图 |
| 接口滞后 | Mock 联调 + CHANGELOG 日更新 |
| 埋点不一致 | tracking handshake 文档 | 
| 角色流程混乱 | PRD/SOP 引用 role matrix |

## 10. Open Questions
- policy_tag 是否需要模板 + 账号多维度？
- CTA variant 如何与运营实验联动？
- 余额不足时退款/提示由谁负责？

## 11. Appendix
- Phase 1 基线：`phase1-baseline.md`
- Deliverables Tracker：`phase1-deliverables-tracker.md`
- Risk Review：`phase1-risk-review.md`
- 接口规范：`phase1-interfaces.md`
