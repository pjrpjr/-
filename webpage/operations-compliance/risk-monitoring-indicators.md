# 风控监控指标草案

## 1. 监控目标
- 快速发现模板审核/任务执行过程中的异常，保障积分与合规风险可控。
- 为每周复盘提供量化指标，指导策略优化与资源配置。

## 2. 指标总览
| 指标名称 | 定义 | 计算方式 | 口径说明 | 预警阈值 | 负责人 |
| -------- | ---- | -------- | -------- | -------- | ------ |
| 审核通过率 | 审核通过模板数 / 审核完成总数 | `approved_count / total_reviewed` | 日切，排除撤回单 | <70% 触发预警 | 审核负责人 |
| 审核复核率 | 升级复核单数 / 审核完成总数 | `escalated_count / total_reviewed` | 日切 | >15% 触发复盘 | 审核负责人 |
| 审核逾期率 | 超过 24h 的审核单数 / 当日处理单数 | `overdue_24h / total_reviewed` | 日切 | >5% 触发加班排班 | 排班经理 |
| 举报成立率 | 成立举报数 / 结案举报数 | `valid_reports / closed_reports` | 周切，剔除测试单 | >40% 触发专项排查 | 合规负责人 |
| 举报逾期率 | 超过 4h 初审或 24h 复核的举报数 / 全部举报 | `sla_breach / total_reports` | 日切 | >10% 告警 | 合规负责人 |
| 任务失败率 | 失败任务数 / 总任务数 | `task_failed / task_total` | 区分出图/训练 | >12% 触发事故流程 | 任务运营 |
| 退款金额占比 | 退款积分总额 / 扣费积分总额 | `refund_credit / charge_credit` | 日切 | >8% 触发计费复盘 | 计费负责人 |
| 重复失败模板占比 | 24h 内同模板失败≥2次 / 活跃模板数 | `repeat_fail_templates / active_templates` | 日切 | >5% 升级风控策略 | 模板运营 |
| 积分异常消耗 | 单账号日扣费>均值+3σ 的账号数 | 算力日志统计 | 日切 | >10 个账号预警 | 风控数据 |
| 风险告警响应时长 | 从告警触发到处理人受理的平均时间 | `avg(response_time)` | 分钟 | >30 分钟告警 | 值班负责人 |

## 3. 数据采集与管道
- **平台接口**：
  - 审核：`/compliance/reviews/metrics?date=YYYY-MM-DD` 返回通过数、复核数、逾期数。
  - 举报：`/compliance/reports/metrics` 返回各状态数量、逾期列表。
  - 任务：`/tasks/metrics` 区分出图/训练失败率、重试次数。
  - 积分：`/credits/metrics` 返回扣费与退款总额、异常账号列表。
- **事件推送**：
  - `compliance.review.updated`、`compliance.report.updated`、`compliance.alert`，进入实时监控通道。
  - `tasks.failed`、`credits.balance-changed`，同步到风控监控。
- **数据仓库**：将上述接口结果写入每日快照表（`risk_daily_snapshot`），供 BI 看板使用。

## 4. 呈现方式
- **监控看板**（Ops Dashboard）：
  - 审核&举报指标：折线 + KPI 卡片，支持筛选时间范围、模板类别。
  - 任务与积分：堆叠柱状图展示出图/训练失败率与退款金额。
  - 预警列表：展示触发阈值的记录，支持认领与备注。
- **告警策略**：
  - 预警阈值触发后，通过飞书机器人 + 邮件通知值班人员。
  - 三次连续告警需在周会上复盘并形成改进项。

## 5. 后续动作
1. `platform-integration` 提供 métrics API 初版（字段：total、approved、escalated、overdue 等）。
2. `frontend-build` 配合设计监控面板组件（图表、预警列表、过滤器）。
3. `experience-design` 输出 Ops Dashboard 草图，包含指标卡、图表样式、色板定义。
4. `operations-compliance` 设立指标周会（每周一），评估阈值有效性并调整策略。
