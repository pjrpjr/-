# 数据存储方案评估（PostgreSQL/MySQL + Redis）

## 1. 业务需求
- 核心实体：账户（tenant/user）、授权名单、积分流水、任务记录、训练作业、审核记录。
- 高并发读写：积分扣费、任务状态更新。
- 实时能力：推送状态、排行榜等。
- 审计：日志保留、可追溯。

## 2. 关系型数据库（PostgreSQL vs MySQL）
| 指标 | PostgreSQL | MySQL | 结论 |
| ---- | ---------- | ----- | ---- |
| JSON/半结构化支持 | 原生 JSONB、查询灵活 | JSON 支持但函数偏少 | 优势：PostgreSQL |
| 事务/锁 | MVCC、行级锁表现稳定 | InnoDB 亦可，但复杂事务略逊 | PostgreSQL |
| 扩展 | 支持扩展（timescaledb、pg_partman） | 生态广 | 视团队经验而定 |
| 团队经验 | 平台团队已有 PG 经验 | MySQL 用于其他项目 | 选择 PostgreSQL，MySQL 作为备选 |

**推荐**：PostgreSQL 14 + 主从复制 + 逻辑备份；使用 Schema 划分（`core`、`audit`、`ops`）。

## 3. Redis
| 场景 | 说明 |
| --- | --- |
| 积分预扣锁 | 使用 Redis 锁防止重复预扣/幂等冲突 |
| 任务状态缓存 | 缓存最近任务状态，推送时读取 |
| 实时指标 | 统计加速队列长度、速率 |
| 限流 | 结合令牌桶实现 API 调用控制 |

部署建议：Redis Sentinel 三节点（主从+哨兵），支持故障转移；持久化采用 AOF everysec。

## 4. 表设计（摘录）
- `credit_accounts`：账户表
- `credit_ledger`：积分流水
- `authorizations` / `authorization_logs`
- `tasks` / `task_events`
- `training_jobs`
- `audit_logs`

分区策略：
- `credit_ledger` 按月分区
- `task_events` 按创建时间或 task_id 哈希分片

## 5. 容量规划
| 表 | 预计日新增 | 30 日累计 | 备注 |
| --- | --- | --- | --- |
| `credit_ledger` | 20 万 | 600 万 | 记录大小约 200B，约 1.2GB/月 |
| `tasks` | 5 万 | 150 万 | 含训练/出图任务 |
| `task_events` | 3×任务数 | 450 万 | 每任务约 3-5 事件 |
| `authorization_logs` | 2 万 | 60 万 | |

## 6. 运维与监控
- 使用 pgBouncer 连接池；启用慢查询日志。
- 监控指标：QPS、锁等待、复制延迟。
- 定期 vacuum/analyze；对大表配置 autovacuum 政策。
- Redis 监控内存、连接数、主从复制延迟。

## 7. 后续
- 2025-09-19 前提供数据库 schema 初稿 (`db/schema.sql` 草案)。
- 与基础设施/DBA 确认部署窗口与备份策略。
- 评估是否引入 TimescaleDB 处理长时间指标数据。
