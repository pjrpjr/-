# 微信扫码登录与支付流程设计

## 1. 登录流程
1. 前端调用 `/sessions/wechat/qrcode` 获取二维码 URL、`qr_id`。
2. 用户微信扫码 → 微信 Open Platform 回调平台 `/sessions/wechat/callback`。
3. 平台验证 code，获取 open_id / union_id，绑定用户账户。
4. 返回 `auth_token`、角色信息、积分摘要（含 theme）。
5. 更新 `/sessions/me` 返回结构：
```json
{
  "user_id": "user_7788",
  "tenant_id": "creator_001",
  "role": "viewer",
  "theme": "viewer",
  "balance": 400,
  "unread_notifications": 2
}
```

## 2. 支付/充值流程
1. 前端调用 `/payments/wechat/unified-order`：
   - 参数：`amount_yuan`, `product_id`, `channel=wechat_scan`。
2. 平台生成订单，记录 `payment_orders`，返回 `code_url`。
3. 用户扫码支付 → 微信支付回调 `/payments/wechat/notify`。
4. 平台校验签名、幂等 → 调用 `/credits/charge`（reason=`topup`）。
5. 返回支付结果给前端，更新积分余额。

## 3. 对账
- `payment_orders(payment_id, tenant_id, user_id, amount, status, transaction_id, created_at)`。
- 每日 T+1 对账任务：拉取微信账单，与平台订单比对，异常写入 `payment_reconciliation_issues`。

## 4. 风控
- 第三方支付渠道待支持：支付宝、银联。
- 风控策略：
  - 高频支付 → 限制二维码有效期 5 分钟。
  - 大额支付 → 人工审批流程。
  - 失败次数 >3 → 锁定支付渠道 30 分钟。

## 5. 联调计划
- 2025-09-18：确认微信开放平台凭证、回调域名。
- 2025-09-19：完成 Mock 回调，验证 `/credits/charge` 补扣逻辑。
- 2025-09-21：与支付风控、财务完成对账脚本演练。

## 6. 待办
- 同步小程序团队确定跳转流程与回调 URL。
- 与财务确认退款流程（结合 `docs/exception-strategy.md`）。
- 完善 `/sessions/me` 接口返回主题信息（9/19）。
