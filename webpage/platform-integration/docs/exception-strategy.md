# 异常处理策略（超时/重试/积分回滚/授权撤销）

## 1. 异常类型
| 类别 | 场景 | 处理策略 |
| --- | --- | --- |
| 任务超时 | ComfyUI 出图/训练超过 SLA | 触发 `task.failed`，自动调用 `/credits/cancel`，推送通知，记录 `task_exception` |
| 任务失败可重试 | GPU 抢占、网络失败 | 重试次数 3 次，间隔 30s/60s/120s；失败后回滚积分并提示用户重试 |
| 积分补扣失败 | `/credits/charge` 返回余额不足 | 提示充值或降档；创建 `pending_charge` 记录，24h 内提醒 |
| 授权撤销 | 运营/创作者撤销授权 | 后续任务拒绝执行；已预扣积分回滚；推送通知 |
| 支付回调异常 | 充值回调重复/失败 | 幂等校验 `payment_id`，失败报警，人工介入 |

## 2. 流程示例
1. 任务超时：
   - 定时器监控 `next_eta` 超时 → 触发 `handle_timeout`。
   - 调用 `/credits/cancel`，更新任务为 `failed_timeout`。
   - 记录 `task_exception_logs`，通知 content-ops 提供文案。

2. 手动退款：
   - Reviewer/Compliance 在后台触发人工退款 → `/credits/charge` with negative amount + reason=`refund_manual`。
   - 更新 `credits_ledger`、`audit_access_log`。

## 3. 文案与提示
- 超时：参考 content-ops `notification-remediation-template-v1.md`（“任务超时，已为你返还积分，可稍后重试。”）。
- 补扣失败：提示补扣金额与充值入口。
- 授权撤销：提示联系创作者或运营。

## 4. 接口与状态码
| 接口 | 异常 | 响应 |
| --- | --- | --- |
| `/api/v1/credits/pre-deduct` | 余额不足 | 40302 insufficient_balance |
| `/api/v1/credits/commit` | 重复提交 | 40901 pre_deduct_already_processed |
| `/api/v1/credits/charge` | amount_invalid | 42201 payload_invalid |
| `/api/v1/tasks/{id}` | task_not_found | 40401 |

## 5. 日志
- `task_exception_logs(task_id, type, reason, operator, created_at)`。
- `refund_requests(refund_id, tenant_id, user_id, amount, status, operator)`。

## 6. 依赖
- content-ops：提供各类异常提示语、FAQ。
- operations-compliance：审核手动退款流程与 SLA。
- 前端：实现超时/重试提示、退款申请入口。

## 7. 时间线
- 2025-09-18：确认文案与 SOP。
- 2025-09-19：实现异常枚举与推送事件。
- 2025-09-21：联调前端异常处理流程。
