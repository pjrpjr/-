# Phase2 实施计划（Plan）

## 1. 概览
- 计划周期：2025-09-18 ~ 2025-09-30
- 团队：平台集成（Owner）、frontend-build、experience-design、operations-compliance、支付风控、基础设施。
- 主要成果：数据库上线、接口切换、推送/支付联调、日志合规。

## 2. 工作分解
| 编号 | 任务 | 负责人 | 依赖 | 截止 |
| --- | --- | --- | --- | --- |
| P2-1 | 评审规格（spec.md）并冻结范围 | 平台集成、产品、前端、合规 | 无 | 9/18 |
| P2-2 | 数据库 schema 与迁移脚本（db/migrations/2025-Phase2） | 平台集成、DBA | P2-1 | 9/21 |
| P2-3 | Redis 锁/缓存接入 (pp/core/state→真实存储) | 平台集成 | P2-2 | 9/22 |
| P2-4 | 实现 /licenses/check、/credits/refund、真实扣费流程 | 平台集成 | P2-2 | 9/22 |
| P2-5 | /sessions/me theme、权限矩阵落地 | 平台集成 × frontend-build | P2-1 | 9/19 |
| P2-6 | WebSocket/SSE 生产配置、健康监控 | 平台集成 × 消息中台 | P2-1 | 9/23 |
| P2-7 | 微信扫码登录/支付对接、对账作业 | 平台集成 × 支付风控 × 财务 | P2-1 | 9/23 |
| P2-8 | 日志与审计接口 (	ask_audit_logs, 导出接口) | 平台集成 × 合规 | P2-2 | 9/24 |
| P2-9 | 前端联调（credits/licences/tasks/push/payment） | frontend-build × 平台集成 | P2-4~P2-7 | 9/25 |
| P2-10 | 联调复盘与风险确认 | 全体 | P2-9 | 9/25 |
| P2-11 | 文档与运维交接（README、runbook、监控） | 平台集成 × 运维 | P2-10 | 9/29 |

## 3. 测试计划
- 单元测试：积分、授权、任务模块覆盖率 ≥ 80%。
- 集成测试：使用 pytest + docker-compose 启动 PG/Redis，覆盖扣费/退款/授权校验/任务流。
- WebSocket/SSE：编写负载脚本验证 5k 并发，记录延迟。
- 支付：沙箱环境 end-to-end 测试，含对账脚本回放。

## 4. 发布流程
1. 合并至 develop 分支，运行 CI（单测 + 集成测试）。
2. 生成迁移脚本，DBA 审核后上线。
3. 灰度：先切 20% 任务、10% 支付。
4. 监控 48h，无严重告警后全量切换。

## 5. 风险与缓解
- **R1**：数据库迁移导致并发锁 → 采用 ddl 分批执行、观察慢查询。
- **R2**：支付回调不稳定 → 接入重试队列、对账监控。
- **R3**：推送大量连接导致压力 → 开启 autoscaling、配置连接上限。

## 6. 文档交付
- docs/ 系列：更新 API、权限、资产、异常处理。
- shared/assets-manifest.md：素材更新。
- shared/checklist.md：里程碑记录。

## 7. 评审记录
- 评审会：2025-09-18 15:00，参会：平台、产品、前端、合规、支付、基础设施。
- 评审意见整理在 specs/phase2/notes.md（若有）。

## 8. 下一步
- Phase3 (10 月)：引入 OLAP + BI 仪表盘、开放 API 市场。
