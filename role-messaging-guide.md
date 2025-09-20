# Role Messaging Guide（Draft v0.2）

> 参考 `shared/role-matrix.md` 与 platform-integration 文档（`docs/api-credit-authorization-push.md`、`docs/role-access-mapping.md`、`docs/api-permission-matrix.md`），对齐通知事件名称、关键字段与不同角色语气。

## 1. 事件 × 角色矩阵
| 事件 | 事件 ID / 接口 | 关键字段 | 游客 Visitor | 注册用户 Viewer | 创作者 Creator | 审核员 Reviewer |
| --- | --- | --- | --- | --- | --- | --- |
| 注册完成 | `front:signup.completed` | {campaign}, {source} | 页面浮层引导注册，无系统通知 | 站内信 + 邮件欢迎文案，提示完善资料领体验券 | 若由创作者邀请，追加“申请联合创作者”提示 | - |
| 授权申请提交 | `license_apply` | {template_id}, {account_id}, {persona_tag}, {policy_tag} | - | 浮层提示“申请已提交”，注明审核 24h SLA，可点击“查看进度” | 站内信提醒有新申请，列出申请人信息与资料缺失提示 | 审核后台新建待办，标记 SLA 倒计时 |
| 模板授权通过 | `license_approved` | {license_id}, {template_id}, {valid_to}, {max_runs} | - | 站内信+短信说明授权生效、任务中心入口 | 站内信+邮件强调收益归属不抽成、后台入口 | 审核后台写入操作日志即可，无额外提示 |
| 模板授权驳回 | `license_rejected` | {license_id}, {reason_code}, {policy_tag} | - | 站内信解释缺失材料/违规原因，附整改提示与申诉入口 | 邮件 + 站内信说明整改要求与申诉链接 | 审核后台展示 redline 编号与处理人 |
| 积分预扣 | `credits_pre_hold` | {task_id}, {pre_deduct_id}, {balance_after} | - | 站内通知/浮层，突出对账信息与占用额度 | 创作者后台同步成本数据，用收益视角解释 | - |
| 任务入队/排队提示 | `task_start` | {task_id}, {queue_type}, {estimated_credits} | - | 站内浮层提示排队位置，若超 SLA 推荐加速 | 后台提醒“任务排队”，可同步团队成员 | 审核后台只记录，无需推送 |
| 积分结算 | `credits_settled` | {final_cost}, {refund}, {ledger_id} | - | 站内信列出任务 ID + 扣费金额；邮件可选 | 创作者后台图表更新 ROI、收益回吐 | - |
| 任务完成 | `task_completed` | {task_id}, {credits_spent}, {result_url} | - | 站内信总结任务结果并附加复刻/分享 CTA | 后台推送“可发布/上架”，建议收集反馈 | - |
| 任务失败 | `task_failed` | {task_id}, {failure_code}, {refunded_amount}, {violation_flag} | - | 站内信/邮件说明失败阶段与退款额度，提供重试 CTA | 若因违规，强调整改步骤；否则建议专家支持 | 审核后台同步失败原因，必要时触发复盘 |
| 训练成功 | `training.succeeded` | {task_id}, {model_id}, {entry_url} | - | 站内信/邮件（简洁提示下一步） | 追加“发布模板”“直播脚本”等运营建议 | - |
| 训练失败 | `training.failed` | {task_id}, {error_code}, {refunded_amount} | - | 站内信/邮件说明失败阶段与退款额度 | 追加“预约专家诊断”CTA | - |
| 排队加速推荐 | `task.state.changed` + {queue_position} > SLA | {queue_position}, {estimated_time} | - | 横幅提示 20/50 积分加速选项 | 创作者后台提供“团队加速池”提示 | - |
| 风险预警 / 整改 | `risk_alert` | {alert_id}, {policy_tag}, {action_taken}, {deadline} | - | 中性语气提醒 + 截止时间 + 申诉入口 | 强调伙伴关系，提供客服/模板支援 | 审核后台 24h SLA 倒计时提醒 |
| 举报受理 | `report.received` | {report_id}, {received_at}, {sla_confirm} | 若为举报人，站内信确认受理 | 同左 | 被举报创作者收到“已下架/待整改” | 审核后台出现新工单待办 |
| 举报处理结果 | `report_closed` | {report_id}, {conclusion}, {action_taken} | 公告仅显示公开结果 | 举报人站内信说明处理结论 | 创作者收到整改结果与后续要求 | 审核后台自动归档，触发复盘提醒 |
| 角色升级（Viewer→Creator） | `account.role.updated` | {old_role}, {new_role} | - | 站内信引导完成创作者功能开通 | 邮件庆祝 + 引导使用创作者后台工具 | - |

> 注：余额不足提醒暂由前端依据 `credits_pre_hold.balance_after` 与用户自定义阈值触发；若平台后续提供专门事件，请更新事件 ID。

## 2. 语气关键词
- **游客**：可信、低门槛（仅页面文案，无推送）。
- **注册用户**：透明、数据化，强调余额、任务 ID、对账信息。
- **创作者**：合作伙伴、收益导向，突出自主掌控与服务支持。
- **审核员**：专业、客观，强调操作记录、红线编号与解决方案。

## 3. 通知触达渠道建议
- Viewer：站内信 + 可选短信；重要节点（授权通过、违规预警）同时邮件备份。
- Creator：站内信 + 邮件，视情况追加短信/IM；后台面板展示富信息卡片。
- Reviewer：内部审核系统待办 + Slack/钉钉提醒，无需外部渠道。

## 4. 设计/样式指引
- 颜色与组件引用 `content-ops/design-tokens-mapping.md` 与 `shared/design-tokens.md`。
- 警示类通知使用 `var(--color-warning)` 底色（10% 透明）+ `#dc2626` 文本。
- 创作者视图按钮与标签切换至 `#9333ea` 系列。

## 5. 待确认/后续
- Platform-integration：确认是否新增 `credits.balance_alert` 或其他事件；若有，请补充事件 ID 与 payload。
- Operations-compliance：提供审核员内部通知模版文本，补充到 Reviewer 列。
- Product-planning：在 PRD 中引用本表的语气与事件 ID，避免跨文档偏差。



## 版本记录
| 日期 | 说明 |
| 2025-09-18 | 待 9/19 角色权限评审后补充 Viewer/Creator/Reviewer 文案差异；提前占位更新。 |
| ---- | ---- |
