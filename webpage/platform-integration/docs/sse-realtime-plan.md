# WebSocket/SSE 实时推送方案

## 1. 目标
- 任务中心展示实时状态、积分变动、授权结果。
- 支持补扣弹窗、加速横幅、审核面板同步任务阶段。

## 2. 推送通道
| 通道 | 说明 |
| --- | --- |
| WebSocket | 主通道，支持多事件类型、心跳、双向消息（预留）。|
| SSE | 回退方案，前端在不支持 WS 的环境下使用。|
| Kafka Topic | `task-events.stage`（平台 -> 消息中台 -> WebSocket 网关）。|

## 3. 事件模型
```json
{
  "event": "task.state.changed",
  "task_id": "task_xxx",
  "stage": "processing",
  "progress": 55,
  "next_eta": "2025-09-17T09:35:00Z",
  "status": "running",
  "credits": {"pre_deduct_id": "pd_x", "final_cost": null},
  "authorization": {"template_id": "tmpl_x", "authorization_id": "auth_x"},
  "ts": 1726550100
}
```
- `stage`：`ingest` → `processing` → `delivery`（训练可扩展 `checkpointing`）。
- `progress`：0-100 整数。
- `next_eta`：ISO8601，允许 `null`。

## 4. 节奏与重试
- 默认节奏：`accepted`(0s) → `running`(~180s) → `completed`(~360s)。
- 重试策略：指数退避 1/2/5 秒，超过 3 次提示“请重试或刷新”。
- 心跳：`ping` 每 30 秒；前端 60 秒未收到事件需重连。

## 5. 鉴权
- 连接需携带 Bearer JWT（与 REST 相同），`scope` 包含 `tasks.push`。
- WebSocket 初始化时校验 token；SSE 使用 query `token` 参数。
- 支持角色主题：`/sessions/me` 返回 `theme=creator/viewer`，前端据此调整 UI。

## 6. 服务侧实现
1. API 层聚合任务事件（`state.list_task_events`）并写入推送。
2. 使用 Redis 发布/订阅 or Kafka -> 网关的桥接。
3. 实时更新 `next_eta`、`stage`，写入 `task_state_history`（参见 `audit-logging-plan`）。
4. 推送失败记录在 `task_push_failures`，便于监控。

## 7. 与消息中台协作
- 2025-09-18：确认推送 Topic、客户端连接 URL。
- 2025-09-19：完成鉴权方案（token 续期、限流阈值）。
- 2025-09-21：联调补扣弹窗/加速横幅、审核面板，确保事件字段匹配。

## 8. 待办
- 在 Mock 服务补充 `/sessions/me` 角色主题字段（9/19）。
- 实现 SSE/WS 网关配置文档（shared/infra 指南）。
- 建立 WebSocket 健康监控指标（连接数、失败率）。
