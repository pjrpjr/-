# 积分账户逻辑设计（充值/扣费/冻结/结算/退款/余额校验）

## 1. 账户结构
| 字段 | 说明 |
| --- | --- |
| `tenant_id` | 创作者/租户标识 |
| `user_id` | 授权用户（可空，表示租户级） |
| `balance` | 可用积分 |
| `frozen` | 冻结积分（预扣） |
| `credit_limit` | 授信额度（预留，默认 0） |
| `status` | 正常/冻结 |
| `updated_at` | 更新时间 |

## 2. 主要流程
### 2.1 充值
1. `/payments/order` 创建付款单 → 支付风控完成微信/三方支付。
2. 支付回调调用 `/credits/charge`（reason=`topup`，amount 为积分入账值）。
3. 写入 `credit_ledger`：`change=+amount`，`reason=topup`。

### 2.2 预扣/冻结
- 调用 `/api/v1/credits/pre-deduct` → `balance -= amount`，`frozen += amount`。
- Ledger 记录 `pre_deduct`。

### 2.3 结算
- `/api/v1/credits/commit`：从 `frozen` 中扣除实际成本，差额退回 `balance`。
- Ledger 记录 `commit` 与 `refund_pre_deduct`（如有）。

### 2.4 直接扣费/补扣
- `/api/v1/credits/charge`：直接减少 `balance`，记录 reason=`accelerate`/`charge`。

### 2.5 退款
- 根据运营指令调用 `/credits/charge` with negative? or new `/credits/refund`? 设计：使用 `charge` with `reason=refund` and negative change? In ledger positive amount -> increase balance. Need to specify.

### 2.6 余额校验
- `GET /api/v1/credits/balance` 返回 `balance/frozen`。
- 定期校验：`balance + frozen` 应与 ledger 汇总一致；异常写入审计表。

## 3. ledger 结构
| 字段 | 说明 |
| --- | --- |
| `ledger_id` | UUID |
| `tenant_id` | 账户 |
| `user_id` | 子账户 |
| `task_id` | 关联任务 |
| `change` | 变动积分（正/负） |
| `balance_after` | 变动后余额 |
| `reason` | 枚举：`topup`、`pre_deduct`、`commit`、`refund_pre_deduct`、`accelerate:<mode>`、`refund_manual` 等 |
| `metadata` | JSON 记录外部单号/操作人 |
| `created_at` | 时间 |

## 4. 与产品规划同步的计费规则
- 标准套餐：基础积分包 + 加速附加。
- Cap 规则：每日扣费上限/模板授权次数控制。
- 失败回滚：任务失败 → `cancel`，余额全额退回；补扣失败 → 创建 compensation ledger。

## 5. 待办
- 与财务确认充值对账表（phase1-risk-review.md）。
- 更新 `/sessions/me` 返回用户角色及积分摘要。
- 与产品规划同步积分梯度与封顶策略。
