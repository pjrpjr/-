# 角色权限复核记录（2025-09-17）

## 对照结果
| 角色 | role-matrix 描述 | SOP/接口要求 | 差异说明 |
| --- | --- | --- | --- |
| 审核员（Reviewer） | 审核模板、处理举报、触发人工回滚；访问审核后台/举报面板 | `template-review-standards.md`、`reporting-sop.md` 中要求审核员可通过/驳回、下架、触发退款；`audit_review_risk_summary_v1.md` 字段权限一致 | 无差异 |
| 运营合规（Compliance Ops） | 拥有审核员权限 + 配置政策、监控指标 | 文档要求能维护驳回原因库、配置指标阈值、访问风控看板（`risk-monitoring-indicators.md`） | 无差异；确认需接口写权限 `/compliance/review-reasons`、`/risk/config`（待平台实现） |
| 平台管理员（Admin） | 配额管理、系统配置、用户冻结；管理后台/系统日志 | 当前运营合规文档未新增管理员职责，仍沿用 platform 接口权限 | 无差异 |

## 备注
- 平台集成需在审核回写接口中校验角色（Reviewer/Compliance Ops），防止 Viewer 调用。
- `/compliance/review-reasons`、`/compliance/reports/actions` 需保留操作日志（operatorId）。
- 若后续增加“内容运营”在举报面板的只读权限，需要更新 `role-matrix.md`。

> 待 9/19 Ops × Platform 权限评审确认后更新结论与行动项。
