﻿﻿# 平台集成任务清单
> 统一执行指令：逐项执行本 TODO 的任务，完成后勾选并于 shared/CHANGELOG.md 登记状态/阻塞，跨组事项需在相关文档和 TODO 留言同步。

- [x] FastAPI Mock：开放积分/授权/任务/审核回写 mock 接口，供前端调试（`app/api/*`、`docs/openapi-platform-mock.json`）。
- [x] 发布 `/credits/estimate`、`/credits/charge`、`/credits/ledger` 字段草案（`docs/api-credit-authorization-push.md`）。
- [x] 记录设计令牌与素材调用计划（`docs/ui-assets-plan.md`），与 shared 对齐。
- [x] 与合规核对接口权限草稿（`docs/role-access-mapping.md`）。
- [x] 2025-09-18：设计积分账户与授权校验真实模型（`docs/api-design-notes.md`），并输出 `/licenses/check`、`/credits/estimate` v0.2 API 规格。
- [x] 2025-09-18：更新静态素材访问策略（`docs/platform-static-assets.md`），提供 CDN/鉴权方案。
- [x] 2025-09-19：与 operations-compliance 完成接口权限矩阵（`docs/api-permission-matrix.md`），在 CHANGELOG 记录评审结论。
- [x] 2025-09-18：更新 docs/api-design-notes.md v0.3、docs/api-credit-authorization-push.md（/credits、/licenses 字段与示例）。
- [x] 2025-09-18：补充实时推送协议文档 docs/realtime-events.md（事件、payload、心跳重连）。
- [x] 2025-09-20：实现 `/credits/estimate`、`/credits/charge`、`/licenses/check` 真实例（`app/services/credits.py` 等），并编写单元测试；完成后通知前端联调。
  - [x] 准备积分冻结/结算 TDD 场景列表（余额不足、授权撤销、冻结失败、超额补扣）。
  - [x] 校对接口错误码与重试策略，回写 `docs/api-credit-authorization-push.md`。
- [ ] 2025-09-21：根据埋点评审结果补充事件 payload 字段，更新 `docs/api-credit-authorization-push.md` 与 CHANGELOG。
- [ ] 2025-09-22：完成任务实时推送（WebSocket/SSE）基础实现，文档化事件契约（`docs/realtime-events.md`）。
  - [x] SSE `/api/v1/tasks/stream/sse` 实现 + 单测 + 文档更新
  - [x] WebSocket 通道基础返回事件 + 心跳（tests/test_api_tasks.py）
  - [x] WebSocket 多任务订阅 + 增量推送（tests/test_api_tasks.py）
  - [ ] WebSocket 推送重放（待实现）
- [ ] 2025-09-23：交付任务留痕与合规日志方案（`docs/audit-log-plan.md`），包含数据表设计与保留策略。
- [ ] 2025-09-24：上线积分/授权/任务接口初版到测试环境，配合前端进行集成测试。
- [ ] 2025-09-25：在联调复盘会上汇报平台侧结果，整理 `docs/platform-review-2025-09-25.md`。
- [ ] 2025-09-26：启动 Phase2 后端规划（`phase2/backend-outline.md`），明确新增服务与 AI 深度学习能力接入。





