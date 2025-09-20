# 合规接口字段补充（2025-09-18）

## 1. 审核驳回原因枚举（review_reasons）
| code | 文案示例 | 描述 | 是否需要创作者补充材料 |
| --- | --- | --- | --- |
| missing_materials | 资料不完整 | 缺少收益证明或主页截图 | 是 |
| metadata_invalid | 元数据异常 | 工作流 JSON 无法解析 / 缺节点 | 是 |
| compliance_violation | 违反平台规则 | 涉及敏感人物、侵权等 | 是 |
| inconsistent_style | 风格与主页不一致 | 示例图与历史风格差异过大 | 视情况 |
| monetization_unverified | 收益证明无法核实 | 截图模糊或数据异常 | 是 |
| duplicate_template | 模板重复 | 与已上线模板重复或搬运 | 否，需下架 |

## 2. 举报处理动作（report_actions）
| action | 描述 | 说明 |
| --- | --- | --- |
| takedown | 先下架模板 | 即刻下线模板并冻结收益 |
| notify_creator | 通知创作者整改 | 通知中需包含违规点与截止时间 |
| refund_credit | 退还积分 | 关联 `/credits/release` 接口，默认全额退还 |
| escalate | 升级复核 | 指派合规负责人跟进 |
| penalize | 处罚账号 | 包括封禁、限制提现等 |

举报状态流转：`pending` → `investigating` → `pending_fix`（整改中）→ `closed`；若违规严重，可直接 `closed` + `penalize`。

## 3. 积分回滚流水字段
| 字段 | 类型 | 说明 |
| --- | --- | --- |
| transaction_id | string | 原扣费流水号 |
| refund_id | string | 回滚唯一 ID |
| reason_code | enum{`task_failed`,`manual_adjust`,`report_penalty`} | 回滚原因 |
| operator_id | string | 操作人 ID（Reviewer/Compliance/Admin） |
| operator_role | enum | 对应角色 |
| amount | int | 退还积分（>0） |
| occurred_at | ISO8601 | 回滚时间 |
| memo | string | 备注，选填 |

## 4. 数据落地
- 前端：更新审核/举报面板下拉选项与状态提示文本。
- 平台：在 `/compliance/review-reasons` 与 `/compliance/reports/{id}/actions` 返回上述枚举；`/credits/release` 接受 `reason_code`。
- 运维：确保 `audit_trail` 记录 `operator_role`、`reason_code`。

## 5. 后续
- [ ] 2025-09-18：同步 frontend-build 更新枚举文件。
- [ ] 2025-09-18：通知 platform-integration 更新 OpenAPI 草案。
