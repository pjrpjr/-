# 创作者后台 API 设计

## 1. 功能范围
| 模块 | API | 说明 |
| --- | --- | --- |
| 授权导入 | `POST /api/v1/authorizations/import` | 支持 CSV 上传、重复跳过、额度配置。|
| 授权管理 | `GET /api/v1/authorizations/{template_id}` / `logs` | 查看名单/使用记录。|
| 模板配置 | `PUT /api/v1/templates/{template_id}` | 更新模板价格、授权策略（预留）。|
| 任务统计 | `GET /api/v1/creator-dashboard/overview` | 汇总任务数、营收、积分消耗。|
| 收益明细 | `GET /api/v1/creator-dashboard/payouts` | 关联财务流水。|
| 手动退款 | `POST /api/v1/credits/refund` | 与 operations-compliance 合作控制权限。|

## 2. Dashboard 指标
- 今日/本周任务完成数、失败数。
- 积分消耗 vs 收益曲线。
- 最受欢迎模板（按使用次数/收益排序）。

## 3. 授权导入流程
1. 创作者后台上传 CSV → 前端调用 `/authorizations/import`。
2. 平台校验格式、写入授权表，返回新增/跳过数。
3. 如需撤销 → `/authorizations/revoke`。
4. 所有操作写入 `authorization_logs`。

## 4. 任务统计数据源
- PostgreSQL `tasks`, `credit_ledger`。
- Redis 缓存今日统计，定时落库。
- 计划引入 OLAP（ClickHouse/StarRocks）支撑更多维度分析（Phase2）。

## 5. 权限控制
- `creator_admin` scope：导入、撤销、查看统计。
- `creator_finance` scope：查看收益与退款操作。
- 所有码权操作需写入 `audit_access_log`。

## 6. 时间线
- 2025-09-18：完成接口 Swagger 草案（财务、运营评审）。
- 2025-09-21：联调授权导入/撤销与 Dashboard 初版。
- 2025-09-25：对接财务退款流程（参考 phase1-risk-review）。

## 7. 待办
- 与创作者后台团队确认页面结构和指标优先级。
- 与财务确认收益接口返回字段。
- 输出 Swagger 片段 -> `docs/openapi-platform-mock.json` 更新。
