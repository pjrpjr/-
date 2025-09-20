# 角色访问与接口映射

> 参考 `shared/role-matrix.md`，梳理各角色在平台集成侧可调用的接口与注意事项。

## 角色 × API 能力
| 角色 | 核心能力 | 可调用接口 | 鉴权要求 | 日志/审计 |
| --- | --- | --- | --- | --- |
| 游客 Visitor | 浏览案例、模板 | 无需调用本组受保护接口 | 无 JWT | 无需记录 |
| 注册用户 Viewer | 发起任务、充值、查看个人任务 | `/api/v1/credits/pre-deduct`, `/commit`, `/cancel`, `/tasks/{id}`, `/tasks/{id}/events` | `scopes`: `task.read`, `credits.write` | 记录 task_id、user_id、IP |
| 创作者 Creator | 管理授权名单、查看收益 | `/api/v1/authorizations/import`, `/revoke`, `/authorizations/{template_id}`, `/credits/balance` | `scopes`: `authorization.manage`, `credits.read` | 需写入授权操作日志 |
| 审核员 Reviewer | 审核、回滚 | `/api/v1/reviews/callbacks`, `/credits/cancel` | `scopes`: `review.write`, `credits.rollback` | detail 中附 `operator` 与备注 |
| 运营合规 Compliance Ops | 配置政策、监控 | 同审核员 + 未来指标接口 | `scopes`: `compliance.admin` | 追加合规审计表 |
| 平台管理员 Admin | 系统配置、冻结用户 | 未来管理接口（待定） | `scopes`: `admin.full`，多因素 | 写入系统审计，需审批流 |

## 联调与实现计划
- D2 前：在 Mock 中补充 JWT scope 检查与 401/403 错误码（参考 `docs/api-error-codes.md`）。
- D3 前：在 `/api/v1/credits/*` 响应中加入 `role` 字段，便于前端确定 UI 主题。
- 后续任务：对接 operations-compliance 后新增审核 API 的角色限制，更新该文档和 `shared/role-matrix.md`。

## 变更流程
1. 新增角色或调整权限，需同步更新此文档、`shared/role-matrix.md` 与 `shared/CHANGELOG.md`。
2. 平台集成在发布前确认接口 `scope` 与错误码是否与文档一致，避免联调时出现权限差异。
3. 需要按钮级别控制时，扩展子表记录接口→页面→按钮映射，供前端按需拆分。

