# Task Center Realtime Push Integration Plan

日期：2025-09-17
负责人：frontend-build

## 目标
- 将任务中心事件流从 mock 数据迁移至 platform-integration 提供的 WebSocket/SSE 服务。
- 支持状态更新、异常/重试提示、积分扣减通知等完整流程。

## 当前实现
- `useRealtimeFeed` 通过 `api.subscribeTaskEvents` 使用 Mock 事件（`mockBackend.ts`）。
- `TaskCenterPanel` 显示事件列表，支持本地模拟按钮。

## 待确认内容
1. 服务端推送协议：
   - URL（SSE 或 WebSocket）。
   - 鉴权方式（Cookie、Bearer Token、Query 参数）。
   - 心跳/keep-alive 机制与重连策略。
   - 事件类型及字段：`task.updated`, `task.failed`, `task.completed`, `credits.balance-changed`, `license.changed` 等。
2. 错误处理：连接失败、token 过期、新事件字段缺失时的兜底逻辑。
3. 并发/节流：是否需要前端过滤重复事件或保持事件去重。

## 前端计划
- 在 `src/lib/api/index.ts` 增加真实订阅实现，支持：
  - SSE：使用 `EventSource`，封装 reconnect；
  - WebSocket：封装心跳、重连次数、关闭策略。
- `useRealtimeFeed`：
  - 判断连接状态并更新 UI 提示（连接中/异常）。
  - 解析后端字段映射到现有 TaskEvent（如 `progress`, `eta`, `impact`）。
  - 新增错误/告警 Toast 提示。
- `TaskCenterPanel`：
  - 展示后端提供的 `failureReason`、`actionRequired`。
  - 根据 `operations-compliance` 提供的分类显示“暂停/重试/退款”入口。
- 记录调试日志，便于联调排查。

## 时间线建议
- 9/18：平台提供事件协议与连接参数。
- 9/19：前端完成 SSE/WebSocket 适配封装，与平台联调初版。
- 9/20：根据 operations-compliance 的异常流程校验 UI 提示。
- 9/21：在 shared/CHANGELOG.md 更新“任务中心实时推送联调完成”。

## 风险
- 如果事件字段与 TODO 中所列不一致，需要在第一时间回写需求。
- SSE 与 WebSocket 同时提供？需确认 Service Worker 与 SSR 场景兼容性。
- 若后端事件量大，需要考虑分页/列表剪裁策略。
## 2025-09-24 前端联调进展
- 新增 src/lib/workflows/taskLifecycle.ts 封装预扣、结算、取消/重试等流程，统一调用 credits API。
- 	askLifecycle.test.ts 使用 Vitest 覆盖暂存、重试、退款差额场景，保障重连与错误容忍逻辑。
- SSE 端暂继续沿用 platformClient 重试策略；后续可接入实时任务 ID 配置。
