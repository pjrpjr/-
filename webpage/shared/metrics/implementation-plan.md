# Phase1 指标技术落地计划（2025-09-21）

## 负责人
| 模块 | 负责人 | 联系方式 |
| --- | --- | --- |
| platform-integration | PI 陈工 | pi@platform |
| frontend-build | FE 王工 | fe@platform |
| operations-compliance | OC 李工 | oc@platform |
| business-experience | BX 张工 | bx@product |
| shared/metrics | Shared 刘工 | shared@pm |

## 环境依赖
- 后端：staging 集群 `phase1-stg`（包含 `/credits/*`、`/licenses/check` 实例）。
- 前端：Next.js staging 环境 `https://phase1-stg.web.local`，需启用埋点 SDK。
- 日志：数据湖 `landing_phase1` namespace，启用 Kafka topic `phase1_events`。
- 监控：Metabase 仪表盘占位 `Phase1 Landing`，需要指标组开放访问。

## 测试策略
1. **单元测试**：platform-integration 在事件生成模块补充 policy_tag/risk_level/action_required 字段测试。
2. **集成测试**：staging 环境端到端验证事件落地，使用 Postman collection `metrics-phase1.postman_collection.json`。
3. **数据校验**：数据团队运行 SQL 脚本 `verify_phase1_events.sql`，确认事件字段非空率 ≥ 99%。
4. **回归检查**：前端使用 Chrome DevTools 验证埋点 payload，并输出录屏归档。

## 联调步骤
1. 9/20 前完成接口字段上线到 staging，平台团队通知前端更新 SDK。
2. 9/21 上午 09:30 开始联调：前端触发关键事件，平台在日志中确认字段齐全。
3. 9/21 下午 14:00 与 operations-compliance 核对 `risk_alert` 事件策略，确认 D3 升级流程日志存在。
4. 9/21 结束前：数据分析验证事件入湖情况，记录在会议纪要“决策与行动项”部分。

## 风险与缓解
- **字段缺失**：若 staging 环境缺字段，立即回滚至前一版本并在 shared/CHANGELOG 标记。
- **埋点延迟**：Kafka 堆积>5 分钟时通知数据平台扩容，备选方案为临时写入 S3。
- **政策调整**：如 policy_tag 在 9/21 会议中新增，及时更新本计划与 README 链接。

## 输出物
- 会议纪要：`shared/metrics/meetings/2025-09-21-metrics-sync.md`
- 联调录屏与数据验证 SQL：上传至 `shared/metrics/artifacts/2025-09-21/`
- SQL 校验脚本：`shared/metrics/artifacts/2025-09-21/verify_phase1_events.sql`（验证 policy_tag/action_required/escalation_level）
