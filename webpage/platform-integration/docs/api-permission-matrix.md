# 接口权限矩阵（角色→API→动作）

> 依据 `shared/role-matrix.md`、`operations-compliance/permission-matrix-selfcheck-2025-09-19.md`，用于 2025-09-19 权限评审与后续实现。

## 1. 角色与 Scope 定义
| 角色 | Scope 列表 | 说明 |
| --- | --- | --- |
| viewer | `task.read`, `credits.estimate`, `credits.charge`, `licenses.check`, `tasks.push` | 注册用户，可发起任务、预估/补扣积分、校验授权、订阅自身任务事件 |
| creator | `authorization.manage`, `credits.read`, `task.manage`, `reports.create` | 创作者可维护授权名单、查看积分、管理自有任务并提交整改申诉 |
| reviewer | `review.approve`, `credits.rollback`, `reports.action`, `tasks.audit` | 审核员处理模板审核、举报动作及任务异常回滚 |
| compliance_ops | `compliance.policy`, `reports.audit`, `templates.publish`, `metrics.read` | 运营合规可配置政策、审批举报、上下架模板并查看关键指标 |
| admin | `admin.full` | 平台管理员具备全局能力，需多因素认证 |

## 2. 接口映射与审计要求
| 角色 | API/动作 | 审计要求 | 备注 |
| --- | --- | --- | --- |
| viewer | `POST /api/v1/credits/estimate`, `POST /api/v1/credits/charge`, `POST /api/v1/licenses/check`, WebSocket `/realtime/tasks` 订阅 | 写操作写入 `audit_trail`，记录 `operator_id`, `operator_role`, `policy_tag`; 实时事件仅推送本人数据 | 额度校验失败返回 `reason_code` 并广播告警 |
| creator | `POST /api/v1/authorizations/import`, `DELETE /api/v1/authorizations/{id}`, `GET /api/v1/credits/ledger`, `POST /api/v1/reports` | 所有授权与举报动作需写入 `audit_trail` 并附 `policy_tag` | 授权导入需通过合规校验 |
| reviewer | `POST /api/v1/reviews/{id}/decision`, `POST /api/v1/credits/refund`, `POST /api/v1/reports/{id}/actions`, `POST /api/v1/tasks/{id}/actions` | 必须附带审批备注；触发回滚时记录 `reason`, `policy_tag`, `reference_id` | 退款/回滚需二人复核 |
| compliance_ops | `POST /api/v1/templates/{id}/publish`, `PATCH /api/v1/policies/{id}`, `GET /api/v1/metrics/compliance`, `POST /api/v1/reviews/{id}/escalate` | 更新政策需写入 `audit_trail` 并通知 shared/CHANGELOG；指标访问记录 `purpose` 字段 | 拥有 reviewer 全部权限 |
| admin | `POST /api/v1/admin/users/{id}/suspend`, `PATCH /api/v1/admin/allocations`, `DELETE /api/v1/admin/tenants/{id}` | 高危操作要求多因素验证、审计签名与值班审批号 | 需在 24h 内复盘 |

### Audit Trail 示例
```json
{
  "operator_id": "user_9988",
  "operator_role": "reviewer",
  "action": "review.approve",
  "reference_id": "template_123",
  "policy_tag": "B2",
  "reason": "material_validated",
  "created_at": "2025-09-19T10:20:00Z"
}
```
- audit_trail 示例 说明：所有带 write/approve/rollback 的动作必须至少记录上述字段，并在 24 小时内可供合规导出。

### `/sessions/me` Scope 返回示例
```json
{
  "user_id": "user_7788",
  "tenant_id": "creator_001",
  "role": "viewer",
  "theme": "viewer",
  "scopes": ["task.read", "credits.estimate", "credits.charge", "licenses.check", "tasks.push"],
  "balance": 400
}
```

## 3. 9/19 权限评审结论
- 产品规划：确认 scope 与 PRD 场景一致，要求在 shared/CHANGELOG.md 记录后续变更。
- 前端：确认前端角色切换逻辑可直接使用 `scopes` 数组，需在组件层根据 `review.approve`、`compliance.policy` 等 scope 控制按钮显隐。
- 合规：确认 `audit_trail` 字段满足审计要求，审批链需要落库并在 `policy_tag` 维度可检索。
- 平台：承诺 9/20 前提交权限枚举常量与接口中间件实现草案，并将结果同步 `shared/status-feed.md`。
- 结论：权限矩阵通过评审，可作为 Phase2 实现基线；任何新增接口必须写入本表并经合规审批。

## 4. 后续行动
- 2025-09-20：平台集成提交权限中间件设计与测试计划。
- 2025-09-21：合规提供 `policy_tag` 全量枚举并更新 `compliance-tracking-inputs.md`。
- 2025-09-22：前端完成按钮级权限映射并回写到 `shared/design-tokens.md`。
- 评审纪要已登记于 `shared/CHANGELOG.md`（2025-09-18 条目）。
