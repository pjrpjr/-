# Phase2 平台集成规格（草案）

## 1. 背景
Phase1 已交付积分补扣、任务推送、创作者后台等基础能力，但仍依赖内存数据与 Mock。Phase2 目标是在 2025-10 月内完成生产级实现：落地 PostgreSQL/Redis、补齐权限矩阵、开放 /licenses/check、完成支付上线与日志合规。

## 2. 目标
- **G1**：所有积分/授权/任务数据写入 PostgreSQL，支持审计与回溯。
- **G2**：完善权限矩阵与 /sessions/me 主题字段，支撑前端角色体验。
- **G3**：与消息中台对接生产级 WebSocket/SSE，提供健康监控与重试机制。
- **G4**：上线微信扫码登录与充值流程，完成对账与风控策略。
- **G5**：建设日志与埋点体系，满足 ops/compliance 与产品统计需求。

## 3. Scope
| 模块 | Phase2 范围 | 非目标 |
| --- | --- | --- |
| 数据层 | PostgreSQL schema、迁移脚本、Redis 锁/缓存、数据同步脚本 | 引入 OLAP（规划 Phase3） |
| API | /credits/* 实现真实账本、/licenses/check、/sessions/me 主题字段、创作者 Dashboard 统计接口 | 批量导出/报表下载（Phase3） |
| 推送 | WebSocket/SSE 生产配置、心跳/重连、推送监控 | MQTT/第三方推送 |
| 支付 | 微信扫码登录/充值、回调处理、对账作业 | 支付宝/信用卡接入（待定） |
| 日志/审计 | 任务留痕、异常日志、手动退款审计、审计查询接口 | 上线风险看板 UI |

## 4. 需求细化
### 4.1 数据模型
- credit_accounts, credit_ledger, uthorizations, uthorization_logs, 	asks, 	ask_state_history, payment_orders, 	ask_audit_logs。
- 迁移脚本位于 db/migrations/2025-Phase2/*.sql。

### 4.2 API 改动
| 接口 | 变更 |
| --- | --- |
| /api/v1/credits/estimate | 从 PostgreSQL 拉取历史数据，支持动态价格策略。 |
| /api/v1/credits/charge | 写入 ledger，支持 idempotency key。 |
| /api/v1/credits/refund | 新增，处理人工退款。 |
| /api/v1/licenses/check | 新增，返回授权剩余额度、违规 code。 |
| /api/v1/tasks/* | 读取数据库、推送事件。 |
| /api/v1/sessions/me | 返回 theme、角色 scope、最新余额。 |

### 4.3 权限
- 角色→scope 映射记录在 docs/api-permission-matrix.md。
- 所有敏感操作写入 udit_access_log。

### 4.4 性能
- 目标：积分扣费接口 P95 < 150ms；推送延迟 < 1s；WebSocket 在线连接支持 5k。

## 5. 依赖与风险
| 依赖 | 风险 | 缓解 |
| --- | --- | --- |
| 基础设施/DBA | 数据库资源不足 | 9/20 前提交容量规划，预留实例 |
| 消息中台 | 推送鉴权/限流未确认 | 9/18 会议确认 token & 限流策略 |
| 支付风控 | 凭证、回调域名审批 | 9/18 跟进审批状态 |
| 合规 | 日志脱敏规则 | 9/18 完成审查 |

## 6. 里程碑
| 日期 | 里程碑 |
| ---- | ---- |
| 2025-09-18 | 规格评审通过（产品、前端、合规、平台） |
| 2025-09-21 | Schema 与存储实现完成，开始联调 |
| 2025-09-23 | 推送与支付联调完成 |
| 2025-09-25 | 联调复盘、风险确认 |
| 2025-09-30 | Phase2 代码合入主干，准备上线试运行 |

## 7. 验收标准
- 积分/授权/任务数据可在数据库中查询并通过审计接口导出。
- 前端通过真实接口完成积分扣费、授权校验、任务推送体验。
- 微信扫码充值入账并完成对账脚本 T+1 验证。
- shared/CHANGELOG.md 记录所有关键里程碑。

## 8. 未决事项
- /credits/charge idempotency key 格式（待前端/支付确认）。
- OLAP/BI 方案（Phase3 讨论）。
- 国际化/多语言需求评估。
