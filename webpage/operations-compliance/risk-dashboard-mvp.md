# 风控监控面板 MVP 草案

## 1. 目标
- 依托 `risk-monitoring-indicators.md` 提供的 10 项指标，构建首版运营合规监控面板。
- 支持审核/举报团队快速发现 SLA 即将超时、任务失败、积分退款异常等问题。

## 2. 数据集需求
| 数据集 | 指标 | 字段 | 来源接口 | 刷新频率 | 备注 |
| --- | --- | --- | --- | --- | --- |
| 审核指标快照 | 审核通过率、复核率、逾期率 | date, total_reviewed, approved_count, escalated_count, overdue_24h | `/compliance/reviews/metrics?date=YYYY-MM-DD` | 小时级（默认 15 分钟） | 支持过滤模板类型、审核员 |
| 举报指标快照 | 举报成立率、举报逾期率 | date, total_reports, valid_reports, sla_breach, status_breakdown | `/compliance/reports/metrics` | 小时级 | 记录频道（站内、客服、邮件） |
| 任务执行指标 | 任务失败率、重复失败模板占比 | date, task_type, task_total, task_failed, repeat_fail_templates | `/tasks/metrics` | 15 分钟 | 区分出图 / 训练 |
| 积分监控 | 退款金额占比、异常扣费账号 | date, charge_total, refund_total, anomaly_accounts[] | `/credits/metrics` | 小时级 | anomaly_accounts 返回 top 20 |
| 告警响应 | 风险告警响应时长 | alert_id, severity, triggered_at, acknowledged_at, handler_id | `compliance.alert` 事件流 | 实时 | 前端需提供事件订阅能力 |

## 3. 可视化草图说明
- **顶部 KPI 区**（4 卡）：审核通过率、举报成立率、任务失败率、退款金额占比。展示当前值、同比（昨日/上周）以及阈值提示；背景使用 `risk-kpi-bg.png`。
- **趋势图**：
  - 审核指标折线（通过率/复核率/逾期率，可多轴）。
  - 举报 SLA 堆叠柱状图（按渠道）。
  - 任务失败率与重复失败模板数量组合图（柱 + 折线）。
- **预警列表**：表格展示触发阈值的记录，字段包含：时间、类型、严重度、状态、负责人。使用 `alert-warning.svg` / `alert-danger.svg` 图标。
- **异常账号卡片**：展示日扣费异常账号列表（top 10），提供“查看详情”跳转链接到任务中心。
- **响应时间热图**：按小时展示告警响应时长分布，辅助排班优化。

> 参考线框：
> 1. 顶部 4 列 KPI 卡，宽度 280px，高度 120px。
> 2. 中间区域左右布局：左侧折线图（审核/举报），右侧柱状图（任务/积分）。
> 3. 底部为预警列表和异常账号卡片。

## 4. 交互与状态
- KPI 卡达到阈值时显示橙色/红色说明文字：“> 12%（阈值 10%）请联系平台排查”。
- 预警列表支持按严重度筛选；点击行打开侧边弹窗，展示原始指标及处理记录。
- 告警响应热图支持 hover 显示具体分钟数；对连续 3 次超阈值自动提醒。
- 支持导出 CSV，包括各指标快照与预警记录。

## 5. 前端实现建议
- 前端使用已有图表库（如 ECharts/Chart.js）快速搭建；占位数据可先接 mock。
- KPI 卡背景采用 CSS `background-image: url(/admin/illustrations/risk/risk-kpi-background.png)`，保留暗化遮罩以保证可读性。
- 指标 API 返回为小时快照，前端需支持选择日/周范围（默认展示近 3 日）。
- 实时告警可接入 SSE (`/api/v1/tasks/stream` + `compliance.alert`)；无 SSE 时可轮询。

## 6. 下一步
1. 平台集成提供 metrics API 示例响应与错误码。
2. frontend-build 根据本草案制作初版线框 & mock 数据。
3. operations-compliance 10/7 前评估指标阈值有效性，必要时调整。
