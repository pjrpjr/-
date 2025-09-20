# Realtime Events Specification (Phase2)

## 通道与鉴权
- WebSocket：wss://api.platform.local/ws/v1/tasks/stream，Header Authorization: Bearer <jwt>。
- SSE：https://api.platform.local/sse/v1/tasks/stream，Query 	oken=<jwt>。
- JWT 需包含 scope：	asks.push，其中 	heme 字段用于前端主题切换。

## 事件类型
| event | 描述 | 备注 |
| --- | --- | --- |
| 	ask.accepted | 任务进入队列 | stage=ingest，progress=0 |
| 	ask.running | 任务执行中 | stage=processing，progress 1-99 |
| 	ask.checkpoint | 训练/检查点事件（可选） | stage=checkpointing |
| 	ask.completed | 任务完成 | stage=delivery，progress=100 |
| 	ask.failed | 任务失败 | 包含 ailure_reason、policy_tag |
| credits.updated | 积分余额变动 | 携带 ledger 摘要 |

## 事件 Payload
`json
{
  "event": "task.running",
  "task_id": "task_20250918001",
  "status": "running",
  "stage": "processing",
  "progress": 55,
  "next_eta": "2025-09-18T09:05:00Z",
  "credits": {
    "pre_deduct_id": "pd_123456",
    "final_cost": null,
    "refund": 0
  },
  "authorization": {
    "template_id": "tmpl_xxx",
    "authorization_id": "auth_8899"
  },
  "policy_tag": null,
  "failure_reason": null,
  "ts": 1726640700
}
`

## 心跳与重连
- 心跳事件：{"event":"ping","ts":...} 每 30 秒。
- 客户端 60 秒未收到事件需重连；服务端提供重放 query：?since=<ts>。

## 错误事件
`json
{
  "event": "error",
  "code": "ws_unauthorized",
  "message": "token expired",
  "ts": 1726640400
}
`
- 常见 code：ws_unauthorized、ws_rate_limited、ws_server_error。

## 监控指标
- 连接数、平均延迟、失败率、重连次数。
- 每分钟推送数需写入 metrics（待 shared/metrics/README.md 更新）。

## TODO
- 9/21 埋点评审后，根据最终事件字段更新 shared/metrics/README.md。
---

## 事件字段定义（最终版）
| 字段 | 类型 | 事件 | 说明 |
| --- | --- | --- | --- |
| event | string | 全部 | 事件标识，例如 `task.running` |
| task_id | string | task.* | 任务唯一 ID |
| status | enum | task.* | running/completed/failed |
| stage | enum | task.* | ingest/processing/checkpointing/delivery |
| progress | int | task.* | 0-100，SSE 保留最后一次 |
| next_eta | string | task.* | 预计下一节点时间（可为空） |
| credits.pre_deduct_id | string | task.* | 关联预扣单号 |
| credits.final_cost | int? | task.completed | 最终扣费，失败时为 null |
| credits.refund | int | task.failed | 需退款金额（>0 表示待退） |
| authorization.template_id | string | task.* | 模板 ID |
| authorization.authorization_id | string | task.* | 授权单号 |
| policy_tag | string | task.failed/compliance.alert | 合规标签（A1~D2） |
| failure_reason | enum | task.failed | authorization_denied/credit_insufficient/safety_block/infra_error |
| violation_flag | bool | task.failed | 是否违规导致 |
| alert_level | enum | compliance.alert | high/medium/low |
| action_required | enum | compliance.alert | resubmit_material/update_copy/remove_asset/appeal_only |
| credits_delta | int | credits.updated | 积分变动值 |
| balance_after | int | credits.updated | 变动后的余额 |
| ts | int | 全部 | Unix 时间戳 (UTC+0) |

### 事件示例
```json
{
  "event": "compliance.alert",
  "task_id": "task_20250918001",
  "stage": "processing",
  "policy_tag": "B1",
  "alert_level": "high",
  "action_required": "update_copy",
  "violation_flag": true,
  "credits_delta": 0,
  "ts": 1726640820
}
```

- 心跳事件 `system.heartbeat` 每 25 秒推送 `{ "event": "system.heartbeat", "server_time": "2025-09-18T00:30:00Z" }`。
- 前端需在 60 秒内自动重连；重复事件以 `task_id + event + ts` 去重。
