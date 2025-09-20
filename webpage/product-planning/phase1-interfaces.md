# Phase1 接口草案 v0.2

面向授权校验与算力估算的 API 约定，供 platform-integration 评估与实现。本文档默认所有接口均在 `api/v1` 前缀下，通过 Bearer Token 鉴权。

## 1. POST /licenses/check
用于首屏来源任务在入队前校验授权状态。

### 请求
```json
{
  "account_id": "viewer_12345",
  "template_id": "tpl_boyband01",
  "requested_runs": 3,
  "requested_at": "2025-09-20T09:30:00+08:00",
  "task_context": {
    "queue_type": "fast",
    "persona_tag": "creator_studio",
    "cta_variant": "hero_dual"
  }
}
```

| 字段 | 类型 | 必填 | 说明 |
| ---- | ---- | ---- | ---- |
| `account_id` | string | 是 | Viewer/Creator 账号脱敏 ID，来源于授权系统 |
| `template_id` | string | 是 | 模板唯一 ID |
| `requested_runs` | integer | 否 | 预估需要执行的次数，默认 `1` |
| `requested_at` | string (ISO8601) | 否 | 触发时间，默认使用服务端时间 |
| `task_context.queue_type` | string | 否 | `{standard, fast}`，用于校验额度 |
| `task_context.persona_tag` | string | 否 | `{creator_studio, operator_contractor}` |
| `task_context.cta_variant` | string | 否 | 用于 A/B 追踪的 CTA 版本 |

### 响应
```json
{
  "license_id": "lic_abc123",
  "status": "approved",
  "effective_at": "2025-09-18T00:00:00+08:00",
  "expire_at": "2025-10-18T00:00:00+08:00",
  "remaining_runs": 7,
  "max_runs": 10,
  "policy_tag": "default",
  "restrictions": [
    {
      "code": "content_scope",
      "message": "仅允许用于真人账号复刻案例展示"
    }
  ]
}
```

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `license_id` | string | 授权记录 ID |
| `status` | string | `{approved, pending, revoked, expired}` |
| `effective_at`/`expire_at` | string | 授权起止时间 |
| `remaining_runs`/`max_runs` | integer | 剩余/总共可调用次数，`null` 表示不限次 |
| `policy_tag` | string | `shared/metrics/README.md` 中定义的策略标签 `{default, sensitive, high_risk}` |
| `restrictions` | array | 限制列表，包含 code/message |

#### 错误场景
- `401 Unauthorized`：鉴权失败。
- `403 Forbidden`：授权被拒绝或被撤销（同时返回 `policy_tag`）。
- `404 Not Found`：模板或账号不存在。
- `409 Conflict`：同一账号仍有进行中的授权审批。
- `429 Too Many Requests`：频控触发。

## 2. POST /credits/estimate
计算任务需要的算力区间，并返回余额校验结果。

### 请求
```json
{
  "account_id": "viewer_12345",
  "template_id": "tpl_boyband01",
  "task_spec": {
    "output_size": "1024x1536",
    "output_count": 4,
    "steps": 30,
    "queue_type": "fast"
  }
}
```

| 字段 | 类型 | 必填 | 说明 |
| ---- | ---- | ---- | ---- |
| `account_id` | string | 是 | Viewer/Creator 账号脱敏 ID |
| `template_id` | string | 是 | 模板唯一 ID |
| `task_spec.output_size` | string | 是 | 生成尺寸，如 `1024x1536` |
| `task_spec.output_count` | integer | 是 | 生成张数 |
| `task_spec.steps` | integer | 否 | 推理步数，默认模板推荐值 |
| `task_spec.queue_type` | string | 否 | `{standard, fast}` |

### 响应
```json
{
  "credits_min": 320,
  "credits_max": 420,
  "credits_estimated": 360,
  "balance": {
    "total": 1200,
    "reserved": 200,
    "available": 1000,
    "sufficient": true
  },
  "expected_duration_sec": 180,
  "policy_tag": "default"
}
```

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `credits_min`/`credits_max` | integer | 算力区间 |
| `credits_estimated` | integer | 推荐冻结额度 |
| `balance.total` | integer | 当前总余额 |
| `balance.reserved` | integer | 已冻结额度 |
| `balance.available` | integer | 可用额度 |
| `balance.sufficient` | boolean | 是否满足提交所需 |
| `expected_duration_sec` | integer | 预计处理时长（秒） |
| `policy_tag` | string | 与算力策略关联的标签 |

#### 错误场景
- `400 Bad Request`：任务规格不合规。
- `401 Unauthorized`：鉴权失败。
- `402 Payment Required`：余额不足（返回附加字段 `required_topup`）。
- `404 Not Found`：模板不存在。
- `429 Too Many Requests`：请求频率过高。

## 3. 事件上报约定
- 授权相关事件：`license_apply`、`license_approved`、`license_rejected` 按 `shared/metrics/README.md` 字段回传 `policy_tag`、`persona_tag`。
- 算力估算事件：`estimator_interact` 回传 `expected_credits_range`（即本接口的 min/max）及 `queue_type`。

## 4. 后续动作
| 项目 | 责任小组 | 截止时间 |
| ---- | -------- | -------- |
| 校验字段枚举（policy_tag、queue_type） | operations-compliance、platform-integration | 2025-09-21 |
| 前端联调 CTA variant/Persona 埋点 | frontend-build、product-planning | 2025-09-21 |
| 计费规则确认（credits_estimated 计算） | product-planning、platform-integration | 2025-09-22 |
