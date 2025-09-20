# Permission Matrix Self-Check（运营合规 × 平台集成）

> 评审时间：2025-09-19（完成）  
> 目标：对照 `platform-integration/docs/api-permission-matrix.md`、`shared/role-matrix.md`，确认各接口角色权限及审计日志要求。

## 接口对齐清单
| 接口 | 允许角色 | 权限文档引用 | 合规确认 | 备注 |
| --- | --- | --- | --- | --- |
| POST /compliance/reviews/{templateId} | Reviewer, Compliance Ops | api-permission-matrix.md §2 | 已确认 | 记录 `operator_role`、`policy_tag`，回写审计日志 |
| GET /compliance/reviews/{templateId} | Reviewer, Compliance Ops, Admin | api-permission-matrix.md §2 | 已确认 | Creator/Viewer 禁止访问，缓存 5 分钟 |
| POST /compliance/reports | Viewer, Creator, Content Ops | api-permission-matrix.md §2 | 已确认 | 举报动作写入 `audit_trail`，并推送合规提醒 |
| POST /compliance/reports/{reportId}/actions | Reviewer, Compliance Ops, Admin | api-permission-matrix.md §2 | 已确认 | 处罚动作需填写 `reason`、`policy_tag` |
| POST /credits/release | Reviewer, Compliance Ops, Admin | api-permission-matrix.md §2 | 已确认 | 触发积分回滚需双人复核并记录审批号 |
| POST /tasks/{taskId}/actions | Reviewer, Compliance Ops, Admin (+Creator 自己任务) | api-permission-matrix.md §2 | 已确认 | Creator 仅限自有任务；其他角色需审批备注 |

## 审计要求核对
| 项目 | 需求 | 状态 | 备注 |
| ---- | ---- | ---- | ---- |
| audit_trail 表字段 | operator_id, operator_role, policy_tag, reason, reference_id | 已确认 | 平台已提供 audit_trail 示例 |
| policy_tag 枚举 | 合规提供枚举列表 | 进行中（计划 9/21） | 见 compliance-tracking-inputs.md |
| 违规申诉流程 | SOP v1.1 更新 | 进行中（9/25 风控复盘） | 需与 Phase2 风控计划同步 |

## 评审结论
- 评审纪要已登记于 `shared/CHANGELOG.md`（2025-09-18 条目）。
- 合规确认现有接口权限满足政策要求，待 9/21 补全 `policy_tag` 枚举。
- Reviewer 工作流与双人复核流程满足审计要求，无额外调整。

## 待办
- [ ] 2025-09-21 前更新 `policy_tag` 枚举并同步给前端/平台。
- [ ] 2025-09-25 风控复盘后更新 SOP v1.1 文档。


