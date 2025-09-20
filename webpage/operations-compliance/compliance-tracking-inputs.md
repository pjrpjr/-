# Compliance Tracking Inputs（v1.2 · 2025-09-19）

> 适用：9/21 埋点评审后的字段枚举，已与 shared/metrics/README.md、platform-integration 事件 payload 对齐。

## 事件字段对照
| 事件 ID | 字段 | 描述 | 备注 |
| --- | --- | --- | --- |
| compliance.alert | policy_tag | 风控策略标签，见下表 | 平台推送时必填 |
| compliance.alert | risk_level | `high` / `medium` / `low` | 对应前端警示色（红/橙/蓝） |
| compliance.alert | action_required | `resubmit_material` / `update_copy` / `remove_asset` / `appeal_only` / `escalate_review` | 合规整改动作 |
| compliance.alert | escalation_level | `none` / `ops_review` / `compliance_committee` | D3 触发多方复审 |
| report.closed | conclusion | `sustained` / `rejected` / `partial` | 举报结果 |
| report.closed | action_taken | `takedown` / `warning` / `refund` / `none` | 与举报 SOP 对应 |
| task.failed | failure_code | `authorization_denied` / `credit_insufficient` / `safety_block` / `infra_error` | 任务失败原因 |
| task.failed | violation_flag | `true` / `false` | 是否因违规触发 |
| credits.updated | policy_tag | 若因策略调整积分需补记 | 可为空 |

## policy_tag 枚举
| 标签 | 描述 | 分类 | 行动示例 |
| ---- | ---- | ---- | -------- |
| A1 | 肖像/版权授权缺失 | 授权 | 请求补齐授权合约，action_required = resubmit_material |
| A2 | 授权过期或撤销 | 授权 | 下架模板、通知授权方，action_required = remove_asset |
| B1 | 擦边/违规文案 | 内容 | 更新提示词/文案，action_required = update_copy |
| B2 | 违规素材（裸露、暴力等） | 内容 | 移除素材或人工复核，action_required = remove_asset |
| C1 | 异常算力消耗 | 计费 | 执行积分回滚、记录 refund |
| C2 | 重复任务/刷量风险 | 计费 | 限制任务并上报风控，action_required = escalate_review |
| D1 | 举报待调查 | 运营 | 进入调查流程，risk_level = medium |
| D2 | 举报已结案 | 运营 | 记录结论，risk_level = low |
| D3 | 监管复审/高风险升级 | 运营/合规 | 触发 `escalation_level = compliance_committee` 并通知法务复核 |

## 数据处理要求
- audit_trail 记录：`operator_id`、`operator_role`、`policy_tag`、`action_required`、`escalation_level`。
- 前端：在审核面板、风控看板中展示 policy_tag 文案与对应颜色，参照 `content-ops/event-copy-matrix.md`。
- 平台：`/credits/charge`、`/licenses/check`、实时推送需携带 `policy_tag`；空值表示未触发策略。

## 状态
- [x] 9/21 埋点评审确认：policy_tag / action_required / escalation_level 枚举已同步 shared/metrics。
- [x] 通知 frontend-build / platform-integration 调整事件上报与 UI 提示。
