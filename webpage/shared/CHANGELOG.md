﻿﻿﻿﻿﻿﻿﻿# 变更记录

若有修改请记录在此以便计划完成后总结，帮助 Codex 识别影响范围。

| 日期 | 模块/小组 | 影响范围 | 状态 | 备注 |
| ---- | ------ | -------- | ---- | ---- |
| 2025-09-24 | frontend-build | 任务中台 credits workflow 联调 | 已完成 | src/lib/workflows/taskLifecycle.ts、docs/realtime-push-plan.md |
| 2025-09-23 | frontend-build | 审核/举报面板对接合规枚举 | 已完成 | src/components/operations/ReviewDashboard.tsx；src/components/operations/ReportPanel.tsx；src/data/complianceMeta.ts |
| 2025-09-22 | frontend-build | 实时推送客户端：SSE 接入 & 首批事件初始化 | 已完成 | src/lib/api/platformClient.ts；src/hooks/useRealtimeFeed.ts；shared/status-feed.md；docs/tracking-handshake-status.md |
| 2025-09-20 | frontend-build | 首屏 Hero/Quickstart/任务中心资产替换 | 已完成 | src/components/HeroSection.tsx；src/components/QuickStartSection.tsx；src/components/TaskCenterPanel.tsx；src/components/PersonaPanel.tsx；app/globals.css；src/data/siteContent.ts |
| 2025-09-20 | frontend-build | 积分/授权 API 适配层单测覆盖 | 已完成 | src/lib/api/platformClient.ts；src/lib/api/platformClient.test.ts；src/lib/api/index.ts |
| 2025-09-19 | product-planning × platform-integration | Phase2 Outline & spec 状态更新 | 已完成 | docs: webpage/product-planning/phase2-outline.md; specs/phase2/notes.md; specs/phase2/tasks.md; specs/phase2/plan.md; webpage/platform-integration/TODO.md |
| 2025-09-19 | platform-integration | Credits TDD 场景 & 错误码更新 | 已完成 | docs: webpage/platform-integration/docs/api-credit-authorization-push.md; webpage/platform-integration/TODO.md |
| 2025-09-19 | platform-integration | Credits API hold/limit 规则实现 & API 映射 | 已完成 | docs: webpage/platform-integration/docs/api-credit-authorization-push.md; app/core/state.py; app/api/credits.py; tests/test_services_credits.py; tests/test_api_credits.py |
| 2025-09-19 | platform-integration | Licenses API 契约校验测试 & 可选 session 处理 | 已完成 | docs: webpage/platform-integration/docs/api-credit-authorization-push.md; app/api/licenses.py; app/services/licenses.py; tests/test_api_licenses.py |
| 2025-09-19 | platform-integration | Credits 预扣/结算真实链路 + ledger 修复 | 已完成 | code: app/core/state.py; tests/test_api_credits.py; tests/test_services_credits.py |
| 2025-09-19 | platform-integration | Tasks SSE 接口初版 (/api/v1/tasks/stream/sse) | 已完成 | code: app/api/tasks.py; tests/test_api_tasks.py; docs/realtime-events.md |
| 2025-09-19 | platform-integration | Tasks WebSocket 流初版 (/ws/v1/tasks/stream) | 已完成 | code: app/api/task_stream_ws.py; app/main.py; tests/test_api_tasks.py; docs/realtime-events.md |
| 2025-09-19 | platform-integration | Tasks WebSocket 多任务订阅+增量推送 | 已完成 | code: app/api/task_stream_ws.py; tests/test_api_tasks.py; docs/realtime-events.md |
| 2025-09-19 | frontend-build | PlatformApiError detail/状态透传（TDD） | 已完成 | src/lib/api/platformClient.ts; src/lib/api/index.ts; tests |
| 2025-09-19 | frontend-build | RequestOptions timeout/retry 回调支持（TDD） | 已完成 | src/lib/api/platformClient.ts; src/lib/types.ts; src/lib/api/index.ts; tests |
| 2025-09-19 | frontend-build | RequestOptions timeout 与 retry 回调支持 | 已完成 | src/lib/api/platformClient.ts; src/lib/types.ts; src/lib/api/index.ts; tests |
| 2025-09-19 | frontend-build | 平台 RequestOptions timeout/retry/fetchOptions 合并（TDD） | 已完成 | src/lib/api/platformClient.ts; src/lib/types.ts; src/lib/api/index.ts; tests |
| 2025-09-19 | frontend-build | 平台 RequestOptions 重试+fetchOptions 支持（TDD） | 已完成 | src/lib/api/platformClient.ts; src/lib/types.ts; src/lib/api/index.ts; tests |
| 2025-09-19 | frontend-build | Platform RequestOptions 扩展：query/fetchOptions/Signal | 已完成 | src/lib/api/platformClient.ts; src/lib/types.ts; src/lib/api/index.ts; tests |
| 2025-09-19 | frontend-build | 平台 API RequestOptions 查询合并（TDD） | 已完成 | src/lib/api/platformClient.ts; src/lib/types.ts; src/lib/api/index.ts; tests |
| 2025-09-19 | frontend-build | 平台 API RequestOptions 信号支持（TDD） | 已完成 | src/lib/api/platformClient.ts; src/lib/types.ts; src/lib/api/index.ts; tests |
| 2025-09-19 | frontend-build | 平台 API 默认请求头支持（TDD） | 已完成 | src/lib/api/platformClient.ts; src/lib/api/platformClient.test.ts |
| 2025-09-19 | frontend-build | 平台 API 客户端鉴权支持（TDD） | 已完成 | src/lib/api/platformClient.ts; src/lib/api/platformClient.test.ts; package.json; vitest.config.ts |
| 2025-09-19 | frontend-build | 平台 API 集成计划更新 + 适配层脚手架 | 已完成 | docs/platform-api-integration-plan.md; src/lib/api/platformClient.ts; src/lib/api/mockBackend.ts; src/lib/api/index.ts |
| 2025-09-18 | platform-integration | /licenses/check Mock 接口 + /credits/estimate v0.2 字段 | 已完成 | app/api/licenses.py、app/core/state.py、docs/api-design-notes.md |
| 2025-09-16 | 平台集成 | 核心选型确认：FastAPI + Postgres + Redis | 已完成 | 已通知团队 |
| 2025-09-16 | 产品&平台 | 业务流程梳理（模板授权、计费、算力、风控流程） | 规划中 | 待产品规划补 TODO 原则 |
| 2025-09-16 | 协同规划 | 模块结构优化 + 运营合规对齐 | 规划中 | 对应目录同步完成 |
| 2025-09-16 | 协同规划 | 更新 Codex 协作指引 | 规划中 | 请阅读最新执行 |
| 2025-09-16 | 体验设计 | 补扣/复核/加速交互规范 | 已完成 | experience-design-spec.md 最新决策摘要、§6-7-9 |
| 2025-09-16 | 体验设计 & Platform | 积分补扣与排队加速 | 已完成 | 补扣弹窗/加速套餐交互已敲定，spec §6-7；同步 FE/内容 |
| 2025-09-16 | 体验设计 & Operations | 举报复核 SLA 提示 | 已完成 | 24h 复核 + 逾期告警已入 spec §9，待运营落地 |
| 2025-09-16 | frontend-build | 首屏关键组件技术预研 | 进行中 | 等待 platform API 及风控侧 |
| 2025-09-16 | 体验设计 & Product | 任务排队加速套餐展示 | 已完成 | 20/50 积分加速横幅方案，spec §6-7；已同步 FE/内容 |
| 2025-09-16 | 运营合规 | 审核标准/任务异常/举报 SOP 草稿 | 已完成 | 文档：operations-compliance/template-review-standards.md、task-exception-handling.md、reporting-sop.md；评审通过，交付体验/前端实现 |
| 2025-09-17 | 平台集成 | 积分扣费/授权/任务推送 API 草案 + 测试环境计划 | 进行中 | 文档：webpage/platform-integration/docs/api-credit-authorization-push.md |
| 2025-09-17 | 产品规划 | 模板授权策略 PRD + Phase1 路线图 + 同步机制 | 评审中 | 文档：webpage/product-planning/phase1-baseline.md；待 operations-compliance 提 SOP，platform-integration 输出接口草图 |
| 2025-09-17 | 运营合规 | 审核面板字段 & 风控指标 v1.0 | 已完成 | 负责人：运营合规；结论：沿用 5 模块字段结构 + 10 项风控指标，接口字段详见 operations-compliance/audit_review_risk_summary_v1.md；T+2 与平台/前端/体验评审落地计划 |
| 2025-09-17 | 产品规划 | Phase1 Persona & JTBD 基线 | 评审中 | 文档：webpage/product-planning/phase1-baseline.md；已通知 content-ops、operations-compliance |
| 2025-09-17 | 产品规划 | Phase1 首屏 MVP 功能范围 | 评审中 | 文档：webpage/product-planning/phase1-baseline.md；已通知 experience-design、frontend-build |
| 2025-09-17 | 产品规划 | Phase1 指标口径 v0.1 | 评审中 | 文档：webpage/product-planning/phase1-baseline.md；已通知 platform-integration、operations-compliance |
| 2025-09-17 | 内容运营 | 通知字段/整改流程对齐并产出 V1 模板 | 已完成 | 文档：content-ops/notification-remediation-template-v1.md；同步 TODO 状态 |
| 2025-09-17 | 内容运营 | 案例脱敏规范与多语言翻译计划 | 已完成 | 文档：content-ops/creator-success-stories.md、content-ops/localization-plan.md |
| 2025-09-17 | 平台集成 & frontend-build | Mock API 契约（积分/授权/任务/审核回写）发布 | 已完成 | 契约：webpage/platform-integration/docs/openapi-platform-mock.json；Mock 服务：http://mock.platform-integration.local:8080；联调：D1 18:00 地址，D2 上午任务/推送，D2 下午积分视图 |
| 2025-09-17 | 内容运营 | 首屏/流程文案交付并确认设计接收 | 已完成 | TODO 第 4 项标记为收到，等待排版 |
| 2025-09-17 | 产品规划 | Phase1 基线跨组评审（9/19 17:00） | 进行中 | 文档：webpage/product-planning/phase1-baseline.md；会后 9/20 汇总反馈 |
| 2025-09-17 | 产品规划 & Platform | Phase1 Landing 埋点 Schema Draft | 进行中 | 文档：webpage/shared/metrics/README.md；已交 platform-integration 评估可实现性，9/19 评审复盘字段 |
| 2025-09-17 | 平台集成 | 鉴权错误码规范（401/403）确认 | 已完成 | 文档：webpage/platform-integration/docs/api-error-codes.md；同步 frontend-build 映射 |
| 2025-09-17 | frontend-build | Mock API 适配层 + 审核/举报骨架 | 进行中 | 验证事件流；补充角色/素材 TODO，待平台字段与合规枚举；设计/素材文档已交（docs/design-tokens-usage.md 等） |
| 2025-09-17 | 平台集成 | FastAPI Mock 实现积分/授权/任务 API（内存态） | 已完成 | 代码：webpage/platform-integration/app/api/*；需与 frontend-build 联调 |
| 2025-09-17 | shared | 设计令牌、素材清单、角色矩阵发布 | 已完成 | 文档：shared/design-tokens.md、shared/assets-manifest.md、shared/role-matrix.md |
| 2025-09-16 | 体验设计 | 高保真视觉稿同步 | 计划中 | 等内容/合规文案，交付后 24h 内完成并通知 FE |
| 2025-09-17 | 平台集成 | TODO 状态核对并确认 content-ops/frontend-build 字段推进 | 已完成 | 记录：TODO.md 更新核心实现及联调事项，持续跟进 |
| 2025-09-17 | 内容运营 | 更新公共素材清单 owner/交付信息 | 已完成 | 文档：shared/assets-manifest.md；待 9/18 上传脱敏素材 |
| 2025-09-17 | 内容运营 | Role Messaging Guide v0.1 初稿 | 已完成 | 文档：content-ops/role-messaging-guide.md；待合规补充内部模板 |
| 2025-09-17 | 运营合规 | 审核/风控素材提交计划 | 已完成 | 文档：operations-compliance/assets-delivery-plan.md；素材已上传至 frontend-build/public/admin 并更新 assets-manifest |
| 2025-09-17 | 运营合规 | 审核/合规角色权限复核 | 已完成 | 记录：operations-compliance/role-permission-review.md；未发现差异，提醒平台校验接口角色 |
| 2025-09-17 | 平台集成 | 设计令牌与素材调用计划对齐 | 进行中 | 文档：webpage/platform-integration/docs/ui-assets-plan.md；待 9/18 更新资源状态 |
| 2025-09-17 | 平台集成 | 角色权限与 API 映射同步 | 进行中 | 文档：webpage/platform-integration/docs/role-access-mapping.md；对齐 shared/role-matrix.md |
| 2025-09-17 | 体验设计 | 设计令牌/素材策略 + 角色体验 | 已完成 | spec §10-11；同步 FE/内容/合规；无阻塞 |
| 2025-09-17 | 运营合规 | 合规设计令牌/素材调用策略 | 已完成 | 文档：operations-compliance/design-token-strategy.md；对照 design-tokens/assets-manifest 落地 |
| 2025-09-17 | 运营合规 | 审核/举报流程角色对齐 | 已完成 | 更新：template-review-standards.md、reporting-sop.md；引用 shared/role-matrix.md |
| 2025-09-17 | 内容运营 | 设计令牌应用策略补充（Content-Ops） | 已完成 | 文档：content-ops/design-tokens-mapping.md；引用 shared/design-tokens.md 协同 |
| 2025-09-17 | 内容运营 | 角色通知矩阵对齐 shared role matrix | 已完成 | 文档：content-ops/role-based-notification-matrix.md；待合规补充内部角色通知 |
| 2025-09-20 | product-planning | Phase1 review outcomes (19 Sep) | completed | doc: webpage/product-planning/phase1-baseline.md sections “反馈汇总（9/19）”“评审结论（9/19）” |
| 2025-09-20 | product-planning | Phase1 follow-up (tracking) | in_progress | doc: webpage/product-planning/phase1-baseline.md — sections “埋点落地计划（9/21 前）”“9/25 交付跟进”；等待 platform-integration/front-end/compliance 回传落地时间 |
| 2025-09-20 | product-planning | Design tokens & assets alignment plan | planned | doc: webpage/product-planning/phase1-baseline.md — section Design Tokens & Assets Dependencies; sync experience-design/frontend-build/content-ops |
| 2025-09-20 | product-planning | Role matrix integration | planned | doc: webpage/product-planning/phase1-baseline.md — section Role Mapping & Workflow Update; update PRD/SOP |
| 2025-09-17 | frontend-build | 设计令牌/角色矩阵对齐 | 已完成 | 校验 globals.css 令牌；创建素材占位目录；输出 docs/role-integration.md |
| 2025-09-20 | product-planning | Phase1 API spec v0.2（licenses/check & credits/estimate） | completed | 文档：webpage/product-planning/phase1-interfaces.md；等待 platform-integration 评估 |
| 2025-09-20 | product-planning | Phase1 cross-team follow-up notes | in_progress | 文档：webpage/product-planning/phase1-sync-notes.md；待各组按表反馈 |
| 2025-09-20 | product-planning | Phase1 deliverables tracker 初始化 | in_progress | 文档：webpage/product-planning/phase1-deliverables-tracker.md；滚动更新 9/18/9/21/9/25 节点 |
| 2025-09-17 | 体验设计 | 高保真稿 + 组件标注交付 | 已完成 | 文档：experience-design/high-fidelity-hand-off.md；待 9/18 导出资源 |
| 2025-09-17 | 体验设计 | 角色矩阵自检清单 | 已完成 | 文档：experience-design/role-matrix-checklist.md；9/19 评审同步 |
| 2025-09-17 | 体验设计 | 风险复盘（补扣/加速/SLA） | 已完成 | 文档：experience-design/risk-review-2025-09-17.md |
| 2025-09-21 | 体验设计 & shared | 埋点计划评审 | 计划中 | 文档：experience-design/tracking-handshake-plan.md；9/21 与 shared 评审 |
| 2025-09-25 | 体验设计 | 交付验证 & 录屏采集 | 计划中 | 文档：experience-design/delivery-followup-plan.md；待前端联调 |
| 2025-09-17 | 平台集成 & 运营合规 | API 权限矩阵 v0.1 | 已完成 | 文档：platform-integration/docs/api-permission-matrix.md；对齐 shared/role-matrix.md / role-permission-review.md |

| 2025-09-20 | product-planning | Phase1 risk review draft | in_progress | 文档：webpage/product-planning/phase1-risk-review.md；待 9/21/9/25 数据补充 |
| 2025-09-17 | 体验设计 & 运营合规 | 审核/举报高保真对齐 | 已完成 | 更新：experience-design/experience-design-spec.md §11；匹配 operations-compliance/reporting-sop.md |

| 2025-09-17 | 内容运营 | 上传首屏/案例/Quickstart 占位素材 | 已完成 | 资源：frontend-build/public/gradients/hero-default.png、images/cases/*、illustrations/quickstart-step*.svg；等待正式替换 |
| 2025-09-17 | 运营合规 | 风控监控面板 MVP 草案 | 已完成 | 文档：operations-compliance/risk-dashboard-mvp.md；供 frontend-build / platform-integration 评审 |

| 2025-09-17 | 内容运营 | 文案对齐高保真设计（Hero/Stepper/通知） | 已完成 | 文档：content-ops/landing-hero.md、hero-flow-design-handoff.md、notification-remediation-template-v1.md |
| 2025-09-17 | 平台集成 | 节点追踪表创建（素材/权限/埋点/复盘） | 进行中 | 文档：webpage/platform-integration/docs/delivery-schedule.md；按节点更新状态 |
| 2025-09-19 | 运营合规 | 权限矩阵自检清单 | 计划中 | 文档：operations-compliance/permission-matrix-selfcheck-2025-09-19.md；9/19 评审前核对 API 权限 |
| 2025-09-21 | 运营合规 | 埋点计划合规字段补充 | 计划中 | 文档：operations-compliance/compliance-tracking-inputs.md；更新 shared/metrics/README.md |
| 2025-09-25 | 运营合规 | 风控交付跟进复盘 | 计划中 | 文档：operations-compliance/risk-review-2025-09-25.md；收敛跨组风险 |

| 2025-09-17 | 内容运营 × 产品规划 | PRD 补充 Visitor→Viewer 提示与违规警示语 | 已完成 | 文档：product-planning/phase1-baseline.md 对应章节引用 role-messaging-guide |
| 2025-09-17 | 内容运营 × 运营合规 | 举报 SOP 补充 Viewer/Creator 通知语准则 | 已完成 | 文档：operations-compliance/reporting-sop.md 引用 role-messaging-guide |
| 2025-09-18 | 运营合规 | 审核/举报接口字段补充 | 已完成 | 负责人：运营合规；文档：operations-compliance/compliance-interface-fields-2025-09-18.md；已同步枚举给 FE/平台 |
| 2025-09-17 | 平台集成 & frontend-build | `/credits/estimate` `/credits/charge` 接口确认 | 已完成 | 文档：webpage/platform-integration/docs/api-credit-authorization-push.md；OpenAPI 已更新 |
| 2025-09-17 | 平台集成 & experience-design | 任务推送字段 stage/progress/next_eta 及节奏同步 | 已完成 | 与体验确认加速横幅所需字段；task stream cadence：0/180/360s，retry 1/2/5s |
| 2025-09-17 | frontend-build | API / 实时推送 / 审核联调计划整理 | 进行中 | 文档：frontend-build/docs/platform-api-integration-plan.md、realtime-push-plan.md、ops-integration-plan.md；待平台/合规反馈字段 |
| 2025-09-17 | 平台集成 | 跨组执行看板建立（素材/权限/埋点/复盘） | 进行中 | 文档：webpage/platform-integration/docs/cross-team-checklist.md；每节点完成即时更新 |
| 2025-09-18 | 体验设计 × 内容运营 | 交付 Hero/Quickstart/状态/Persona 素材占位 | 已完成 | 资源：frontend-build/public/gradients/hero-default.png、illustrations/quickstart-step*.svg、icons/task-status/*.svg、icons/persona/*.svg；等待品牌终稿 |
| 2025-09-18 | Shared PMO | 发布跨目录交付自检清单 | 已完成 | 文档：shared/checklist.md Draft v0.1；邀请各组在 9/19 评审前确认 |
| 2025-09-18 | 产品规划 | Phase1 埋点 & 交付节点跟踪更新 | 已完成 | 文档：product-planning/phase1-baseline.md 新增“埋点落地计划”“9/25 交付节点跟踪”章节 |
| 2025-09-18 | 运营合规 | 确认体验设计素材交付并更新资产计划 | 已完成 | 文档：operations-compliance/assets-delivery-plan.md 更新状态；shared/assets-manifest.md 标记合规素材 |
| 2025-09-18 | 体验设计 & 运营合规 | 合规素材最终导出 | 阻塞 | 等待体验设计导出 Hero/Quickstart/状态图高保真素材；ops 已上传占位稿，2025-09-17 于体验 TODO 留言提醒 |

| 2025-09-18 | 体验设计 | 更新 Tracking Handshake Plan（埋点对齐草案） | 已完成 | 文档：experience-design/tracking-handshake-plan.md；9/21 评审使用 |
| 2025-09-18 | 运营合规 | 提前准备权限自检与合规埋点草案 | 已完成 | 文档：operations-compliance/permission-matrix-selfcheck-2025-09-19.md、operations-compliance/compliance-tracking-inputs.md（草稿） |
| 2025-09-17 | 产品规划 & 平台集成 | 补扣/加速流程对齐至 phase1-baseline.md | 已完成 | 段落：product-planning/phase1-baseline.md#补扣与加速体验对齐；引用最新接口字段/节奏 |
| 2025-09-17 | 平台集成 & AI-Workflow | ComfyUI 出图/训练流程梳理完成 | 已完成 | 文档：webpage/platform-integration/docs/comfyui-integration.md；供算力与扣费对齐 |
| 2025-09-17 | 平台集成 & 产品规划 | 积分账户逻辑设计（充值/扣费/回滚）对齐 | 已完成 | 文档：webpage/platform-integration/docs/credits-account-design.md；待财务确认对账流程 |
| 2025-09-17 | 平台集成 & 创作者运营 | 授权校验机制方案确认 | 已完成 | 文档：webpage/platform-integration/docs/authorization-check-design.md；下一步实现 /licenses/check Mock |
| 2025-09-17 | 平台集成 & 基础设施 | 数据存储方案评估（PostgreSQL + Redis） | 已完成 | 文档：webpage/platform-integration/docs/data-storage-evaluation.md；待 9/19 提交 schema 草案 |
| 2025-09-17 | 平台集成 & 安全合规 | 任务留痕与审计日志方案 | 已完成 | 文档：webpage/platform-integration/docs/audit-logging-plan.md；待 9/18 合规确认脱敏规则 |
| 2025-09-20 | product-planning | Phase1 埋点落地计划跟进 | blocked | 等待 platform-integration、frontend-build、operations-compliance、content-ops 确认实施时间（2025-09-17 19:47），文档：webpage/product-planning/phase1-deliverables-tracker.md |
| 2025-09-20 | product-planning | Phase1 9/25 交付项跟进 | blocked | 设计/前端/平台/合规/内容尚未提供最新排期，参考 webpage/product-planning/phase1-deliverables-tracker.md |
| 2025-09-20 | product-planning | Design tokens & assets alignment | blocked | 等待 experience-design、content-ops 确认素材交付时间，见 webpage/product-planning/phase1-deliverables-tracker.md |
| 2025-09-20 | product-planning | Role matrix 文案更新 | blocked | 需 operations-compliance 返回流程输入，参考 webpage/product-planning/phase1-baseline.md#角色映射与流程更新 |
| 2025-09-17 | 平台集成 & 消息中台 | WebSocket/SSE 推送方案（stage/progress/next_eta）确认 | 已完成 | 文档：webpage/platform-integration/docs/sse-realtime-plan.md；待 9/18 鉴权与限流确认 |
| 2025-09-17 | 平台集成 & 创作者后台 | 创作者后台 API 规划输出 | 已完成 | 文档：webpage/platform-integration/docs/creator-backend-apis.md；9/18 提供 Swagger 草案 |
| 2025-09-17 | 平台集成 & content-ops & operations-compliance | 异常处理策略（超时/补扣/退款） | 已完成 | 文档：webpage/platform-integration/docs/exception-strategy.md；待 9/18 文案/SOP 对齐 |
| 2025-09-17 | shared | 设计/素材/角色进展登记 | 已更新 | TODO 已添加阻塞说明，等待平台字段 & 合规枚举；每日 18:00 更新进度 |
| 2025-09-17 | 平台集成 & 支付风控 & 小程序 | 微信扫码登录与支付流程设计 | 已完成 | 文档：webpage/platform-integration/docs/wechat-login-payment-flow.md；9/18 对齐凭证与回调域名 |
| 2025-09-17 | 平台集成 & operations-compliance | 审核回写/举报/退款对接方案 | 已完成 | 文档：webpage/platform-integration/docs/operations-compliance-integration.md；9/19 字段枚举联调 |
| 2025-09-17 | 平台集成 & frontend-build | /sessions/me 角色主题字段草案 | 已完成 | 文档：webpage/platform-integration/docs/session-theme-field.md；Mock 已返回 theme，9/19 联调 |
| 2025-09-17 | 平台集成 & shared | 静态素材访问策略计划 | 阻塞中 | 文档：webpage/platform-integration/docs/platform-static-assets.md；测试计划已补充，等待 experience-design/content-ops 9/18 导出资源执行验证 |
| 2025-09-17 | 平台集成 & operations-compliance & frontend-build | 接口权限矩阵草案 | 阻塞中 | 文档：webpage/platform-integration/docs/api-permission-matrix.md；等待 operations-compliance 自检反馈，9/19 评审 |
| 2025-09-17 | 平台集成 & frontend-build | 确认平台 API 集成计划反馈 | 已完成 | TODO：frontend-build/TODO.md 行 12-13 已回复，参考 docs/api-credit-authorization-push.md 等 |

| 2025-09-18 | 平台集成 | 阻塞：未找到 specs/phase2/{spec,plan} 与 tasks.md | 阻塞 | 当前仓库缺少 phase2 相关目录文件，请产品规划确认路径或提交文档 |
| 2025-09-18 | 运营合规 | Phase2 Spec 定稿 | 已完成 | 文档：operations-compliance/specs/phase2/spec.md；明确 R1-R5 目标及依赖 |

| 2025-09-18 | 平台集成 | Phase2 Spec/Plan/Tasks 初稿创建，等待需求输入 | 阻塞 | 文档：specs/phase2/spec.md、plan.md、tasks.md；需产品规划提供 Phase2 需求 |
| 2025-09-17 | 体验设计 | Phase2 Spec 发布 | 已完成 | 文档：experience-design/specs/phase2/spec.md |
| 2025-09-17 | 体验设计 | Phase2 Plan 更新 | 已完成 | 文档：experience-design/specs/phase2/plan.md |
| 2025-09-17 | 体验设计 | Phase2 Tasks 映射 | 已完成 | 文档：experience-design/specs/phase2/tasks.md；与 TODO 对齐 || 2025-09-20 | product-planning | Phase2 specification drafted | in_progress | 文档：webpage/product-planning/specs/phase2/spec.md；等待跨组评审 |
| 2025-09-20 | product-planning | Phase2 planning doc ready | in_progress | 文档：webpage/product-planning/specs/phase2/plan.md；含时间线与依赖 |
| 2025-09-20 | product-planning | Phase2 task mapping | in_progress | 文档：webpage/product-planning/specs/phase2/tasks.md；与 TODO 对齐 |
| 2025-09-18 | 运营合规 | Phase2 Plan 落地 | 已完成 | 文档：operations-compliance/specs/phase2/plan.md；明确 Milestones 与 Workstreams |
| 2025-09-18 | 运营合规 | Phase2 Task 列表发布 | 已完成 | 文档：operations-compliance/specs/phase2/tasks.md；映射 TODO/T1~T6 |

| 2025-09-17 | 平台集成 | Phase2 spec/plan/tasks 初始化 | 已完成 | 创建 specs/phase2/spec.md、plan.md、tasks.md；等待相关组评审 |
| 2025-09-17 | 平台集成 & 全体 | Phase2 规格文档输出 | 已完成 | 文档：webpage/platform-integration/specs/phase2/spec.md |
| 2025-09-17 | 平台集成 | Phase2 实施计划制定 | 已完成 | 文档：webpage/platform-integration/specs/phase2/plan.md |
| 2025-09-17 | 平台集成 | Phase2 任务映射整理 | 已完成 | 文档：webpage/platform-integration/specs/phase2/tasks.md；关联 TODO 与执行项 |
| 2025-09-18 | 运营合规 | Phase2 任务表更新 | 已完成 | 文档：operations-compliance/specs/phase2/tasks.md；新增 T1-T7 状态映射 |

| 2025-09-18 | 平台集成 | Phase2 规格评审纪要产出 | 已完成（阻塞） | 文档：specs/phase2/notes.md；需产品规划补充 Phase2 需求后进入实现 |
| 2025-09-18 | 平台集成 | 更新 API 设计说明 + 静态素材策略 v0.2 | 已完成 | 文档：docs/api-design-notes.md、docs/platform-static-assets.md；等待正式素材/接口字段确认 |
| 2025-09-18 | 平台集成 | docs/api-design-notes.md 更新 v0.2（licenses/credits） | 已完成 | 文档：webpage/platform-integration/docs/api-design-notes.md |
| 2025-09-18 | 产品规划 | Phase2 Outline 占位稿创建 | 已完成 | 文档：product-planning/phase2-outline.md；等待需求细化 |
| 2025-09-18 | Content Ops | 预占位：等待 9/19 角色评审更新 role-messaging-guide | 已完成 | 2025-09-19 已补字段/语气差异，见下条 |
| 2025-09-19 | Content Ops | role-messaging-guide.md 字段/语气更新 | 已完成 | 与 shared/metrics/README.md、event-copy-matrix.md 对齐；待 9/21 CTA 复核 |
| 2025-09-19 | Content Ops | event-copy-matrix.md 字段补全（9/21 预备） | 进行中 | 字段已对齐 metrics；等待 9/21 埋点评审锁定 CTA/触发 |
| 2025-09-18 | Content Ops | 创建事件→文案映射草稿，等待 9/21 埋点评审 | 已完成（占位） | 文档：content-ops/event-copy-matrix.md；待评审结论后更新字段/文案 |
| 2025-09-18 | Content Ops | 对齐 metrics 事件 ID 并补全文案映射表 | 进行中 | 文档：content-ops/event-copy-matrix.md、content-ops/role-messaging-guide.md；新增 tests/content-ops/test_event_docs.py（TDD 校验） |
| 2025-09-18 | Content Ops | FAQ 占位记录补扣/加速问答 | 阻塞 | FAQ 待联调后补充具体 Q&A |

| 2025-09-20 | product-planning | Role permission review pending | blocked | 等待 experience-design（role-matrix-checklist）、operations-compliance（role-permission-review/reporting-sop）与 platform-integration（api-permission-matrix）更新；已在对方 TODO 留言（2025-09-18 01:13） |
| 2025-09-20 | product-planning | Tracking handshake prep pending | blocked | 等待 frontend-build（tracking-handshake-plan）、content-ops（event-copy-matrix）、operations-compliance（compliance-tracking-inputs）等补齐 9/21 评审资料；phase1-deliverables-tracker 已记录（2025-09-18 01:14） |
| 2025-09-21 | frontend-build | Complete | 已完成 | AnalyticsProvider instrumentation plus nav/template/monetization CTA, heatmap view, queue_eta_update and stream status; see frontend-build/docs/tracking-handshake-status.md |
| 2025-09-18 | 平台集成 & 全体 | Phase2 规格评审 | 已完成 | 纪要：webpage/platform-integration/specs/phase2/notes.md；行动 A1/A2 跟进中 |
| 2025-09-18 | 体验设计 | Phase2 高保真素材交付 | 已完成 | Hero/Quickstart/任务状态/Persona 导出至 frontend-build/public；manifest 已更新 |
| 2025-09-18 | 运营合规 | 审核/举报状态图标正式版 | 已完成 | 资源：frontend-build/public/admin/icons/review-status/*.svg、report-status/*.svg；更新 shared/assets-manifest.md |
| 2025-09-18 | 运营合规 & 平台集成 | policy_tag 枚举定稿 | 已完成 | 文档：operations-compliance/compliance-tracking-inputs.md、platform-integration/docs/api-permission-matrix.md；等待 9/21 埋点评审写入 metrics |
| 2025-09-18 | 平台集成 | /credits//licenses 字段与示例更新 | 已完成 | 文档：webpage/platform-integration/docs/api-credit-authorization-push.md、docs/api-design-notes.md |
| 2025-09-18 | 平台集成 & 消息中台 | Realtime events 协议文档 | 已完成 | 文档：webpage/platform-integration/docs/realtime-events.md；待 9/21 更新 metrics |
| 2025-09-18 | 平台集成 & 运营合规 | /credits/estimate & /credits/charge 字段定稿 | 已完成 | 文档：platform-integration/docs/api-credit-authorization-push.md、api-design-notes.md；包含最终样例/错误码 |
| 2025-09-18 | 平台集成 | 实时推送协议更新 | 已完成 | 文档：platform-integration/docs/realtime-events.md；定义事件字段与 heart-beat 要求 |

|  | Ops Compliance | 审核/举报图标正式版 + policy_tag 枚举 | 已完成 | 图标：frontend-build/public/admin/icons/review-status/*.svg、report-status/*.svg；文档：operations-compliance/compliance-tracking-inputs.md、platform-integration/docs/api-permission-matrix.md |
| 2025-09-18 02:51:03 +08:00 | Ops Compliance | 审核/举报图标正式版 + policy_tag 枚举 | 已完成 | 图标：frontend-build/public/admin/icons/review-status/*.svg、report-status/*.svg；文档：operations-compliance/compliance-tracking-inputs.md、platform-integration/docs/api-permission-matrix.md |

| 2025-09-20 | product-planning & platform | Phase2 平台规格待批 | blocked | 平台集成团队规格尚未批准，影响 9/25 交付（wireframe/实时方案/接口/SOP/素材）；详见 webpage/product-planning/phase1-deliverables-tracker.md |
| 2025-09-18 | frontend-build | Phase2 准备进度更新 | 阻塞 | Phase2 spec/plan/tasks 已建，待平台字段/合规枚举、设计素材；status-feed 已登记 |
| 2025-09-19 | Content Ops | status-feed.md 日志登记 | 已完成 | shared/status-feed.md#L30 填写当日完成/阻塞/下一步；对应文档：content-ops/role-messaging-guide.md#L8、content-ops/event-copy-matrix.md#L7 |

| 2025-09-18 | shared | 目录整合 | 已完成 | 新增 business-experience/ 与 platform-delivery/ 组级目录，统一在 shared/status-feed.md 登记组级状态；原模块 TODO 保留在各子目录 |
| 2025-09-18 | platform-delivery | `/licenses/check` `/credits/estimate` 规格评审结论 | 已完成 | docs/api-design-notes.md 增加 9/18 评审结论；shared/status-feed.md 记录 PD 更新 |
| 2025-09-18 | platform-delivery & shared | 静态资源访问策略定稿 | 已完成 | docs/platform-static-assets.md 更新生产 CDN 与鉴权缓存方案，shared/CHANGELOG.md#L157 已链接目录整合 |
| 2025-09-19 | platform-delivery & operations-compliance | API 权限矩阵评审完成 | 已完成 | docs/api-permission-matrix.md 与 operations-compliance/permission-matrix-selfcheck-2025-09-19.md 更新；shared/status-feed.md 记录 PD/BX 状态 |
| 2025-09-19 | business-experience | 角色/权限文档统一交付 | 已完成 | experience-design/role-matrix-checklist.md、experience-design/experience-design-spec.md、content-ops/role-messaging-guide.md 更新；business-experience/TODO.md 勾选 |
| 2025-09-19 | operations-compliance & shared | policy_tag 枚举与埋点字段对齐 | 已完成 | 更新 operations-compliance/compliance-tracking-inputs.md、shared/metrics/README.md、experience-design/tracking-handshake-plan.md；business-experience/tests/test_tracking_docs.py 覆盖 |
| 2025-09-19 | platform-delivery | /credits & /licenses 服务实现 | 已完成 | app/services/{credits,licenses}.py 新增，API 调整并新增服务层测试 |
| 2025-09-19 | shared | 9/21 指标联调资料准备 | 已完成 | 新增 shared/metrics/artifacts/2025-09-21/verify_phase1_events.sql 与会议模板，更新 README/实施计划 |
| 2025-09-19 | product-planning | 埋点落地计划汇总 | 已完成 | phase1-baseline.md 指标埋点章节更新；phase1-deliverables-tracker 标记已准备 |
| 2025-09-21 | shared & 全体 | Phase1 指标联调会议（模拟） | 已完成 | 会议模板 `shared/metrics/meetings/2025-09-21-metrics-sync.md` 填写；SQL 校验脚本待数据团队执行后回填 |








