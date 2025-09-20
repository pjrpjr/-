# 积分扣费、授权、任务推送 API 草案与测试环境计划

## 1. 积分扣费 API

### 1.1 业务目标
- 为出图/训练任务提供统一扣费入口，支持预扣+结算双阶段。
- 支持按模板、创作者以及授权关系校验额度；扣费明细需写入积分流水。

### 1.2 Endpoint 列表
| 方法 | 路径 | 描述 |
| ---- | ---- | ---- |
| POST | /api/v1/credits/estimate | 试算标准/加速模式所需积分，返回补扣建议。|
| POST | /api/v1/credits/charge | 直接扣费（补扣/加速费用）。|
| GET  | /api/v1/credits/ledger | 查询积分流水（含补扣、回滚记录）。|
| POST | /api/v1/credits/pre-deduct | 创建积分预扣记录，锁定额度，返回预扣单号。|
| POST | /api/v1/credits/commit | 按预扣单号结算任务扣费。|
| POST | /api/v1/credits/cancel | 取消预扣，回滚冻结额度。|
| GET  | /api/v1/credits/balance | 查询创作者/授权用户可用积分余额。|

### 1.3 请求&响应示例
~~~http
POST /api/v1/credits/pre-deduct
Content-Type: application/json
X-Request-Id: 4f1e...

{
  "task_id": "task_20250916001",
  "template_id": "tmpl_xxx",
  "tenant_id": "creator_001",
  "user_id": "user_7788",
  "scene": "image.generate",
  "estimated_cost": 35,
  "currency": "point",
  "expire_in": 600
}
~~~
~~~json
{
  "pre_deduct_id": "pd_123456",
  "frozen_amount": 35,
  "balance_after": 965,
  "quota_snapshot": {
    "template_quota": 200,
    "user_daily_limit": 100
  }
}
~~~
错误码：40001 余额不足、40002 授权不存在、40901 重复请求、500xx 系统异常。

### 1.4 补扣与加速示例
~~~http
POST /api/v1/credits/estimate
Content-Type: application/json

{
  "tenant_id": "creator_001",
  "user_id": "user_7788",
  "template_id": "tmpl_xxx",
  "scene": "image.generate",
  "resolution": "4k",
  "priority": "accelerated",
  "extras": {"hires_fix": 6}
}
~~~
~~~json
{
  "currency": "point",
  "template_id": "tmpl_xxx",
  "scene": "image.generate",
  "resolution": "4k",
  "priority": "accelerated",
  "current_balance": 400,
  "selected_cost": 46,
  "suggest_topup": 0,
  "extras": {"hires_fix": 6},
  "options": [
    {"priority": "standard", "total_cost": 30, "eta_minutes": 8},
    {"priority": "accelerated", "total_cost": 46, "eta_minutes": 3}
  ]
}
~~~

~~~http
POST /api/v1/credits/charge
Content-Type: application/json

{
  "tenant_id": "creator_001",
  "user_id": "user_7788",
  "template_id": "tmpl_xxx",
  "task_id": "task_20250916001",
  "amount": 46,
  "priority": "accelerated",
  "reason": "accelerate"
}
~~~
~~~json
{
  "ledger_id": "chg_7788",
  "tenant_id": "creator_001",
  "user_id": "user_7788",
  "task_id": "task_20250916001",
  "balance_after": 354,
  "change": -46,
  "reason": "accelerate:accelerated",
  "created_at": "2025-09-17T09:30:00Z"
}
~~~

~~~http
GET /api/v1/credits/ledger?tenant_id=creator_001&user_id=user_7788
~~~
~~~json
{
  "tenant_id": "creator_001",
  "user_id": "user_7788",
  "entries": [
    {"ledger_id": "pd_123456", "task_id": "task_20250916001", "change": -35, "balance_after": 365, "reason": "pre_deduct", "created_at": "2025-09-17T09:00:00Z"},
    {"ledger_id": "chg_7788", "task_id": "task_20250916001", "change": -46, "balance_after": 319, "reason": "accelerate:accelerated", "created_at": "2025-09-17T09:30:00Z"}
  ]
}
~~~

## 2. 授权管理 API

### 2.1 业务目标
- 管理创作者模板授权名单，控制有效期与次数限制。
- 支持批量导入、吊销、授权使用记录查询。

### 2.2 Endpoint 列表
| 方法 | 路径 | 描述 |
| ---- | ---- | ---- |
| POST | /api/v1/authorizations/import | 批量导入授权名单，支持 CSV 上传。|
| POST | /api/v1/authorizations/revoke | 吊销指定用户/模板授权。|
| GET  | /api/v1/authorizations/{template_id} | 查看模板授权明细、额度和有效期。|
| GET  | /api/v1/authorizations/{template_id}/logs | 查询授权使用日志与积分扣减记录。|

### 2.3 数据模型要点
- authorization_id：模板+用户+渠道唯一键。
- 支持配置 usage_limit（次数）、valid_from/to（时效）、quota_per_day。
- 日志表需关联任务记录与积分流水 ID。

## 3. 任务推送/订阅 API

### 3.1 业务目标
- 提供实时任务状态推送（WebSocket/SSE）和回放接口，前端与创作者后台可订阅。
- 推送字段新增 `stage`、`progress`、`next_eta`，用于驱动补扣弹窗与加速横幅。

### 3.2 Endpoint 列表
| 方法 | 路径 | 描述 |
| ---- | ---- | ---- |
| GET  | /api/v1/tasks/{task_id} | 查询任务详情（状态、扣费、授权）。|
| GET  | /api/v1/tasks/{task_id}/events | 获取任务事件历史（REST）。|
| WS   | wss://{host}/ws/v1/tasks/stream | WebSocket 推送任务状态、积分变动、授权结果。|
| SSE  | /sse/v1/tasks/stream | Server-Sent Events 版本，参数同 WebSocket。|

### 3.3 推送消息示例
- 推送节奏建议：`task.accepted` (T+0s) → `task.running` (T+180s) → `task.completed` (T+360s)；重试采用 1/2/5 秒指数回退。
~~~json
{
  "event": "task.state.changed",
  "task_id": "task_20250916001",
  "status": "completed",
  "result_url": "https://cdn.example.com/...",
  "credits": {
    "pre_deduct_id": "pd_123456",
    "final_cost": 32,
    "refund": 3
  },
  "authorization": {
    "template_id": "tmpl_xxx",
    "authorization_id": "auth_8899"
  },
  "stage": "delivery",
  "progress": 100,
  "next_eta": null,
  "ts": 1726459200
}
~~~
鉴权：采用 Bearer {jwt}，JWT 需包含 tenant_id、scopes=[credits.read, tasks.push]。

## 4. 流程串联
1. 前端发起任务 -> 请求授权校验（GET /authorizations/{template}）-> 校验通过后预扣积分。
2. 创建任务 -> 推送事件 'task.accepted'。
3. 任务执行完成 -> 调用 /credits/commit -> 推送 'task.completed'。
4. 异常则 /credits/cancel + 推送 'task.failed'，附带失败原因与退款记录。

## 5. 测试环境计划
- **环境拓扑**：
  - staging-platform：FastAPI 服务，接入 staging PostgreSQL（主从）与 Redis 哨兵集群。
  - staging-comfyui-proxy：Mock ComfyUI/训练回调，支持延迟注入与失败模拟。
  - staging-message-bus：Kafka topic 'task-events.staging'，由消息中台提供到 WebSocket 网关的桥接。
- **数据准备**：
  - 初始化 3 个创作者租户、10 个模板、200 条授权样本数据，使用 scripts/seed_authorizations.py。
  - 生成积分账户初始余额，校验预扣/结算流水正确写入 credit_ledger。
- **联调日程**：
  - D1 完成接口 Mock，输出 OpenAPI JSON 给前端 & 小程序团队。
  - D2 与消息中台联测推送通道；D3 与支付风控验证积分到账->扣费链路。
  - D4 发起全链路回归，包含超时重试、扣费回滚、授权撤销场景。
- **验证清单**：
  - 校验难点：重复请求幂等、授权有效期/次数衰减、推送多租户隔离、积分流水对账。
  - 自动化：新增 tests/staging/test_credits.py、test_authorizations.py、test_task_stream.py（pytest）。

## 6. 待确认事项
- 等待产品规划组确认积分扣费梯度与封顶策略。
- 消息中台需提供 WebSocket 鉴权签发接口与限流阈值。
- 支付风控确认微信回调触发积分到账后的 SLA。
### 1.4 /api/v1/credits/estimate 最终字段
| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| tenant_id | string | 是 | 创作者/企业租户 ID |
| user_id | string | 是 | 下单用户（viewer/creator） ID |
| template_id | string | 否 | 所属模板 ID，训练任务可为空 |
| scene | enum(`image.generate`,`training.create`) | 是 | 业务场景 |
| priority | enum(`standard`,`accelerated`) | 是 | 队列优先级 |
| resolution | object | 否 | 生成分辨率（出图时必填 width/height） |
| inputs | array | 否 | 输入资源摘要（prompt、数量等） |
| extras | object | 否 | 额外参数：`acceleration_cost`, `fast_track` |
| X-Idempotency-Key | header string | 推荐 | 幂等控制 |

**响应字段**
| 字段 | 类型 | 说明 |
| --- | --- | --- |
| estimated_cost | int | 推荐扣费积分（含加速成本） |
| min_cost / max_cost | int | 费用区间（无加速时=estimated_cost） |
| currency | string | 固定 `point` |
| options | array | 不同队列报价（条目：priority, cost, eta） |
| calculation_basis | string | 试算依据版本号 |
| policy_tag | string | 若触发敏感策略，返回合规标签（见 Compliance Tracking Inputs） |
| audit_id | string | 试算日志单号 |

**错误码**
| HTTP | Code | 说明 |
| ---- | ---- | ---- |
| 422 | 42201 payload_invalid | 参数缺失或类型错误 |
| 403 | 0302 authorization_missing | 未找到授权或授权失效 |
| 404 | 0401 template_not_found | 模板不存在 |
| 503 | 2901 estimate_rate_limited | 试算频率受限 |

**示例请求**
```json
{
  "tenant_id": "creator_001",
  "user_id": "user_7788",
  "template_id": "tmpl_citygirl",
  "scene": "image.generate",
  "priority": "accelerated",
  "resolution": {"width": 1024, "height": 1024},
  "inputs": [{"type": "prompt", "length": 180}],
  "extras": {"fast_track": true}
}
```
**示例响应**
```json
{
  "estimated_cost": 35,
  "min_cost": 30,
  "max_cost": 40,
  "currency": "point",
  "options": [
    {"priority": "standard", "cost": 30, "eta_seconds": 420},
    {"priority": "accelerated", "cost": 35, "eta_seconds": 180}
  ],
  "calculation_basis": "pricing_v20250917",
  "policy_tag": null,
  "audit_id": "calc_91a0"
}
```

### 1.5 /api/v1/credits/charge 最终字段
| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| tenant_id | string | 是 | 租户 ID |
| user_id | string | 是 | 触发扣费用户 ID |
| template_id | string | 否 | 模板 ID（无模板任务可空） |
| task_id | string | 是 | 关联任务 ID |
| pre_deduct_id | string | 否 | 预扣单号，如由预扣结算需携带 |
| amount | int | 是 | 扣费积分（>0） |
| reason | enum(`task_commit`,`acceleration`,`manual_adjust`) | 是 | 扣费原因 |
| metadata | object | 否 | 附加信息（如 `queue_type`,`policy_tag`） |
| X-Idempotency-Key | header string | 推荐 | 幂等控制 |

**响应字段**
| 字段 | 类型 | 说明 |
| --- | --- | --- |
| ledger_id | string | 积分流水号 |
| change | int | 实际扣费值（负数） |
| balance_after | int | 扣费后积分余额 |
| policy_tag | string | 若触发策略返回合规标签 |
| reason | string | 回显扣费原因 |
| created_at | string | ISO8601 |

**错误码**
| HTTP | Code | 说明 |
| ---- | ---- | ---- |
| 402 | 40201 insufficient_balance | 积分不足 |
| 409 | 0901 idempotency_conflict | 幂等键重复 |
| 503 | 2901 charge_rate_limited | 扣费频率受限 |
| 503 | 0302 ledger_unavailable | 积分服务不可用 |

**示例请求**
```json
{
  "tenant_id": "creator_001",
  "user_id": "user_7788",
  "template_id": "tmpl_citygirl",
  "task_id": "task_20250918001",
  "pre_deduct_id": "pd_123456",
  "amount": 35,
  "reason": "task_commit",
  "metadata": {
    "queue_type": "accelerated",
    "policy_tag": null
  }
}
```
**示例响应**
```json
{
  "ledger_id": "ledger_9988",
  "change": -35,
  "balance_after": 415,
  "policy_tag": null,
  "reason": "task_commit",
  "created_at": "2025-09-18T00:20:00Z"
}
```

### 1.6 错误码对照
| Code | 提示文案 | 备注 |
| ---- | -------- | ---- |
| 40201 | 积分不足，请充值后重试 | 前端用以弹出补扣提示 |
| 40302 | 授权状态已失效，请刷新授权后重试 | 对应 /licenses/check 返回 revoked/expired |
| 40901 | 预扣单不存在或已处理，请刷新任务状态 | /credits/commit /credits/cancel 幂等校验 |
| 40902 | 预扣余额不足，请重新估价或发起补扣 | 实际成本超出冻结额度时返回 |
| 42200 | 请求参数无效，请核对金额与格式 | amount<=0 或 actual_cost<0 |
| 42201 | 任务金额超出模板/队列上限，请检查参数 | 队列及模板限额守卫 |
| 0901 | 幂等请求冲突，请检查请求 ID | 幂等键重复 |
| 0302 | 积分服务不可用，请稍后再试 | 触发监控告警 |
| 2901 | 扣费过于频繁，请稍后重试 | 节流策略 |

> 默认单笔直接扣费上限：2,000 积分（触发时返回 42201 amount_limit_exceeded）。
## 7. 单元测试与验收场景（TDD Checklist）

| 场景 | 涉及接口 | 前置条件 | 预期结果 | 关联错误码/字段 | 计划测试 |
| --- | --- | --- | --- | --- | --- |
| S1 余额不足试算 | POST /api/v1/credits/estimate | wallet.balance=100，estimated_cost=180 | 200 OK；suggest_topup=80；estimated_cost 保持不变 | 建议字段 suggest_topup | tests/test_services_credits.py::test_estimate_balance_gap |
| S2 预扣余额不足 | POST /api/v1/credits/pre-deduct | balance < estimated_cost，授权有效 | 返回 402，code=40201 | 40201 | tests/test_services_credits.py::test_pre_deduct_insufficient_balance |
| S3 授权撤销补扣 | POST /api/v1/credits/charge | 授权状态=revoked | 返回 403，code=40302 | 40302 | tests/test_services_credits.py::test_charge_authorization_revoked |
| S4 结算超额补扣 | POST /api/v1/credits/commit | hold_amount=150，final_cost=220 | 返回 409，code=40902；提示重新估价 | 40902 | tests/test_services_credits.py::test_commit_exceeds_hold |
| S5 取消已结算预扣 | POST /api/v1/credits/cancel | 对应预扣单已 commit | 返回 409，code=40901；不重复回滚 | 40901 | tests/test_services_credits.py::test_cancel_after_commit |
| S6 单笔补扣超限 | POST /api/v1/credits/charge | amount 超过模板/队列限额 | 返回 422，code=42201 | 42201 | tests/test_services_credits.py::test_charge_amount_limit |
| S7 授权撤销返回 reason=revoked | POST /api/v1/licenses/check | 授权状态=revoked | 200 OK；reason_code=revoked | reason_code=revoked | tests/test_api_licenses.py::test_check_license_revoked_returns_200 |
| S8 缺少资料提示 | POST /api/v1/licenses/check | license_profiles 含 requirements | 200 OK；reason_code=missing_documents | requirements/policy_tag | tests/test_api_licenses.py::test_check_license_missing_documents_returns_200 |
| S9 日额度耗尽 | POST /api/v1/licenses/check | daily_limit=3,daily_used=3 | 200 OK；reason_code=daily_quota_exceeded | reason_code=daily_quota_exceeded | tests/test_services_licenses.py::test_check_license_daily_quota_exceeded |
## 2. 授权校验 API（/api/v1/licenses/check）

### 2.1 最终字段
| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| tenant_id | string | 是 | 模板归属租户 |
| template_id | string | 是 | 模板 ID |
| user_id | string | 是 | 请求授权的用户 |
| channel | enum(`viewer`,`creator`,`external`) | 是 | 授权渠道 |
| session_id | string | 否 | 会话 ID，用于风控链路 |

**响应字段**
| 字段 | 类型 | 说明 |
| --- | --- | --- |
| is_authorized | bool | 是否具备授权 |
| reason_code | enum(`valid`,`expired`,`revoked`,`missing_documents`,`daily_quota_exceeded`) | 拒绝原因 |
| remaining_quota | int | 剩余调用配额 |
| daily_remaining | int | 当日剩余授权次数 |
| valid_until | string | 截止时间（ISO8601） |
| policy_tag | string | 合规标签（如授权缺失 A1） |
| requirements | array | 需补充的资料列表 |

**错误码**
| HTTP | Code | 说明 |
| ---- | ---- | ---- |
| 403 | 40302 authorization_revoked | 授权被撤销 |
| 403 | 40303 daily_quota_exceeded | 当日授权次数超限 |
| 404 | 0401 template_not_found | 模板不存在 |
| 503 | 0304 license_service_unavailable | 授权服务不可用 |

**示例响应**
```json
{
  "is_authorized": false,
  "reason_code": "missing_documents",
  "remaining_quota": 0,
  "daily_remaining": 0,
  "valid_until": null,
  "policy_tag": "A1",
  "requirements": ["upload_authorization_contract"]
}
```


