# 授权校验机制设计

## 1. 场景
- 创作者线下签署授权名单，需要控制有效期、次数、日配额。
- 平台调用 `/licenses/check`（设计中）或现有 `/api/v1/authorizations/*` 以确认用户权限。

## 2. 数据结构
| 字段 | 说明 |
| --- | --- |
| `authorization_id` | 模板 + 用户 + 渠道 唯一键 |
| `tenant_id` | 创作者/租户 |
| `template_id` | 模板标识 |
| `user_id` | 授权用户 |
| `status` | active/revoked/expired |
| `usage_limit` | 总次数上限，null 表示不限 |
| `daily_quota` | 每日使用上限 |
| `used_total` / `used_today` | 已用次数 |
| `valid_from` / `valid_to` | 有效期 |
| `last_used_at` | 最近使用时间 |

## 3. 校验流程
1. 前端或服务端调用 `/licenses/check`（待实现）传入 `tenant_id`、`template_id`、`user_id`。
2. 平台执行：
   - 查询授权记录；若不存在 → `40302 authorization_not_found`。
   - 检查 `status` 是否为 active、有效期内。
   - 若配置 `usage_limit` 则 `used_total < usage_limit`；若 `daily_quota` 则比较 `used_today`。
   - 返回 `allow=true/false`，并带上剩余次数、今日剩余额度。
3. 通过则记录使用：
   - 更新 `used_total`、`used_today`。
   - 在 `authorization_usage_log` 写入：`task_id`、积分扣费单号、时间、操作人。

## 4. 与积分扣费联动
- `/credits/pre-deduct` 前置调用 `/licenses/check`，预扣成功后在校验返回中写入 `pre_deduct_id`。
- `/credits/commit` 完成后，通过 `record_authorization_usage` 增加使用次数，触发日志。
- 若 `/credits/cancel` 则不计入使用，但保留尝试记录。

## 5. 异常处理
| 场景 | 反馈 | 处理 |
| --- | --- | --- |
| 授权已过期 | `40302 authorization_expired` | 引导联系创作者续约，记录风险告警 |
| 次数用尽 | `40302 authorization_quota_exceeded` | 前端引导申请扩容 |
| 日配额超限 | `40302 authorization_daily_limit` | 提示第二天恢复或申请提额 |
| 授权撤销 | `40302 authorization_revoked` | 通知运营核查 |

## 6. 日志与审计
- 表：`authorization_usage_log`
- 字段：`log_id`、`authorization_id`、`tenant_id`、`user_id`、`template_id`、`task_id`、`change`（+1）、`credits_ledger_id`、`operator`、`created_at`。
- 支持按模板、用户、时间维度检索。

## 7. 待办
- 实现 `/api/v1/licenses/check` Mock，并在 docs/api-credit-authorization-push.md 更新引用。
- 与创作者运营同步授权导入格式（CSV 模板）。
- 与法务确认日志保留时间与合规要求。
