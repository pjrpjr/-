# Phase 2 Specification — 平台集成（v0.2 · 2025-09-18）

> 目的：定义前端/平台 Phase 2 的交付范围，为 TDD 与联调提供明确依据。

## 1. 目标
1. 正式接入平台积分/授权接口：`/credits/estimate`、`/credits/charge`、`/credits/refund`、`/licenses/check`、`/tasks/*`。
2. 支持任务中心实时推送（WebSocket/SSE），包含事件重试、鉴权、断线恢复。
3. 完成交互串联：补扣弹窗、加速横幅、审核/举报面板、异常回滚，与 content-ops 文案对齐。
4. 建立完整的审计留痕（audit log）与 policy_tag 埋点字段，为合规提供数据来源。

## 2. 范围
| 模块 | 描述 | 输出文档 |
| --- | --- | --- |
| API 适配 | 平台接口 schema、错误码、重试策略 | docs/api-design-notes.md、docs/api-permission-matrix.md |
| 实时推送 | WebSocket/SSE 协议、事件 payload、限流策略 | docs/realtime-events.md（TBD 9/22）、docs/sse-realtime-plan.md |
| 静态素材 | Hero/Quickstart/Persona/状态图标资源、CDN 策略 | docs/platform-static-assets.md、shared/assets-manifest.md |
| 审核/举报 | 接口字段、权限矩阵、日志需求 | operations-compliance/compliance-interface-fields-2025-09-18.md、docs/api-permission-matrix.md |
| 埋点 | policy_tag、风险等级及事件映射 | shared/metrics/README.md、operations-compliance/compliance-tracking-inputs.md |

## 3. 成功指标
- 核心接口 TDD 覆盖率 ≥ 80%。
- 联调阶段（9/24 起）核心接口错误率 < 2%。
- 实时推送延迟 < 3 秒，断线自动重连 ≤ 5 秒。
- CHANGELOG 每日至少一条进展/阻塞记录。

## 4. 依赖
- Product Planning：Phase2 需求细节与风险复盘。
- Experience Design：高保真稿、埋点标注、联调截图。
- Frontend Build：API 调用层、事件上报、UI 实现。
- Operations Compliance：权限评审、policy_tag 枚举、违规文案。
- Content Ops：通知模板、FAQ 更新、事件文案对照。
- Shared：会议组织、CHANGELOG 维护、资产权限校验。

## 5. 验收条件
1. specs/phase2/tasks.md 与 TODO 列出的任务全部完成并通过测试。
2. docs/platform-review-2025-09-25.md 产出联调复盘，记录问题与解决方案。
3. shared/CHANGELOG.md 记录关键节点：9/19 权限评审、9/21 埋点评审、9/25 联调复盘。
4. 所有新增/修改接口在 openapi-platform 文档或 Mock 中同步。

## 6. 未决问题
- 产品规划 Phase2 需求细节仍待补充（见 tasks T2-1）。
- policy_tag 最终枚举需在 9/21 评审时确认。

