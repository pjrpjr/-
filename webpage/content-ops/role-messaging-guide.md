# Role Messaging Guide（Draft v0.2）

> 参考 `shared/role-matrix.md` 与 platform-integration 文档（`docs/api-credit-authorization-push.md`、`docs/role-access-mapping.md`、`docs/api-permission-matrix.md`），对齐通知事件名称、关键字段与不同角色语气。

## 1. 事件 × 角色矩阵
| 事件 | 事件 ID / 接口 | 关键字段 | 游客 Visitor | 注册用户 Viewer | 创作者 Creator | 审核员 Reviewer |
| --- | --- | --- | --- | --- | --- | --- |
| 注册完成 | `account.signup.completed` | {campaign}, {source_channel} | 页面浮层引导注册，无系统通知 | 站内信 + 邮件欢迎文案，提示完善资料领体验券 | 若由创作者邀请，追加“申请联合创作者”提示 | - |
| 授权申请提交 | `license_apply` | {template_id}, {account_id}, {is_fast_track}, {persona_tag}, {policy_tag} | - | 浮层提示“申请已提交”，注明审核 24h SLA，展示 {is_fast_track} 状态与“查看进度”入口 | 站内信提醒有新申请（含 {persona_tag}），列出缺失材料并提供“补齐授权名单”CTA | 审核后台新建待办，标记 SLA 倒计时并记录 {policy_tag} 初始值 |
| 授权通过 | `license_approved` | {license_id}, {template_id}, {account_id}, {approver_id}, {effective_at}, {expiry_type}, {max_runs} | - | 站内信+短信说明授权生效，突出 {effective_at}/{expiry_type} 与积分扣费说明 | 站内信+邮件强调收益归属、剩余 {max_runs}，附后台入口及“配置任务”CTA | 审核后台写入操作日志：保存 {approver_id}，确认 `operatorRole=reviewer`，无额外通知 |
| 授权驳回 | `license_rejected` | {license_id}, {template_id}, {account_id}, {reason_code}, {policy_tag}, {action_required}, {appeal_deadline} | - | 站内信解释 {reason_code} 与 {action_required}，提供整改指南与 {appeal_deadline} 申诉入口 | 邮件+站内信同步 policy_tag 说明违规类型，附整改模板与升级路径 | 审核后台展示红线编号，提示 24h 内复核；若 {policy_tag}=A2 触发合规复盘提醒 |
| 积分预扣 | `credits_pre_hold` | {task_id}, {pre_deduct_id}, {frozen_amount}, {balance_after}, {expire_in} | - | 站内通知/浮层展示冻结 {frozen_amount} 与 {balance_after}，提醒 {expire_in} 内确认 | 创作者后台同步成本数据，用收益视角解释并提供对账导出 | - |
| 任务入队/排队提示 | `task_start` | {task_id}, {template_id}, {queue_type}, {estimated_credits} | - | 站内浮层提示排队位置；若 {queue_type}=standard 且超 SLA，推荐加速套餐 CTA | 后台提醒“任务排队”，可同步团队成员并标记预估消耗 | 审核后台只记录，无需推送 |
| 积分结算 | `credits_settled` | {pre_deduct_id}, {task_id}, {final_cost}, {refund}, {ledger_id}, {balance_after} | - | 站内信列出 {task_id} 与扣费金额；若 {refund}>0 说明退款到账，提示下载 {ledger_id} 对账 | 创作者后台图表更新 ROI、收益回吐，提醒导出流水 | - |
| 任务完成 | `task_completed` | {task_id}, {template_id}, {credits_spent}, {output_count}, {result_url} | - | 站内信总结任务结果并附 {result_url} + 复刻 CTA | 后台推送“可发布/上架”，建议收集反馈或预约推广 | - |
| 任务失败 | `task_failed` | {task_id}, {template_id}, {failure_code}, {refunded_amount}, {violation_flag}, {policy_tag} | - | 站内信/邮件说明失败阶段与 {refunded_amount}，若 {violation_flag}=true 提供人工支持入口 | 若 {violation_flag}=true，强调整改步骤并引用 policy_tag；否则建议预约专家诊断 | 审核后台同步失败原因，必要时触发复盘或风控升级 |
| 训练成功 | `training.succeeded` | {task_id}, {model_id}, {entry_url}, {suggested_templates[]} | - | 站内信/邮件（简洁提示下一步），附快速体验入口 | 追加“发布模板”“直播脚本”等运营建议 | - |
| 训练失败 | `training.failed` | {task_id}, {error_code}, {failed_stage}, {refunded_amount} | - | 站内信/邮件说明失败阶段与退款额度，提供重试 CTA | 追加“预约专家诊断”CTA，并说明 error_code | - |
| 排队加速推荐 | `task.state.changed`（SSE） | {task_id}, {queue_position}, {estimated_time}, {offer_credits} | - | 横幅提示 20/50 积分加速选项，并显示 {estimated_time} | 创作者后台提供“团队加速池”提示，记录 {offer_credits} | - |
| 风险预警 / 整改 | `risk_alert` | {alert_id}, {task_id}, {policy_tag}, {risk_level}, {action_required}, {deadline} | - | 中性语气提醒 + 截止时间 + 申诉入口；`risk_level=critical` 追加短信 | 强调伙伴关系，解释 policy_tag 等级并提供客服/模板支援 | 审核后台 24h SLA 倒计时提醒，要求记录 `operatorRole` |
| 举报受理 | `report.received` | {report_id}, {template_id}, {received_at}, {sla_confirm}, {reporter_channel} | - | 若为举报人，站内信确认受理并提醒 {sla_confirm} | 被举报创作者收到“已下架/待整改”告知，附整改指引 | 审核后台出现新工单待办，标记处理人 |
| 举报处理结果 | `report_closed` | {report_id}, {conclusion}, {action_taken}, {closed_at}, {appeal_link} | 公告仅显示公开结果 | 举报人站内信说明 {conclusion} 与 {action_taken}，附申诉链接 | 创作者收到整改结果与后续要求，提示申诉流程 | 审核后台自动归档，触发复盘提醒 |
| 角色升级（Viewer→Creator） | `account.role.updated` | {account_id}, {old_role}, {new_role}, {effective_at} | - | 站内信引导完成创作者功能开通，说明 {effective_at} 生效 | 邮件庆祝 + 引导使用创作者后台工具 | - |


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
- Platform-integration：若确认新增 `credits.balance_alert` 事件，请在 9/21 前提供 ID/字段，便于同步至 `event-copy-matrix.md`。
- Operations-compliance：9/21 埋点评审如扩充 policy_tag（例：新增 D3），需第一时间回传并同步 Reviewer/Creator 文案。
- Content-ops：与 frontend-build 在 `event-copy-matrix.md` 中核对 CTA/触发条件，评审后 24h 内更新 `notification-templates.md`（多语言稿沿用本表占位符）。



## 6. 指标对齐纪要（2025-09-19）
- `license_apply`/`license_approved`/`license_rejected` 补齐 {is_fast_track}/{approver_id}/{expiry_type}/{action_required} 字段，与 `shared/metrics/README.md` 事件表一致。
- 风险与整改类通知引用 `operations-compliance/compliance-tracking-inputs.md` 中的 policy_tag、action_required、risk_level 枚举，并区分 Viewer/Creator 语气。
- 举报相关行写明 {conclusion}/{action_taken}，与 `event-copy-matrix.md` 计划字段同步。
- Reviewer 列提示记录 `operatorRole`，对齐 `platform-integration/docs/api-permission-matrix.md` 审计要求。

## 版本记录
| 日期 | 说明 |
| ---- | ---- |
| 2025-09-19 | 合并 9/19 角色权限评审输出：补充 license_* 字段、policy_tag/action_required 语气差异，与 `shared/metrics/README.md` 对齐。 |
| 2025-09-18 | 待 9/19 角色权限评审后补充 Viewer/Creator/Reviewer 文案差异；提前占位更新。 |

