# 2025-09-21 指标对齐会议纪要

## 会议目标
- 确认 Phase1 埋点方案满足业务、合规、数据需求。
- 锁定 policy_tag / action_required / escalation_level 的最终交付范围。
- 明确联调时间表与负责人。

## 会议时间
- 2025-09-21 09:30-10:30（UTC+8）
- 会议链接：Teams / phase1-metrics-sync

## 与会人
| 团队 | 代表 | 角色 |
| --- | --- | --- |
| platform-integration | 陈工 | 后端接口联调 |
| frontend-build | 王工 | 前端埋点实现 |
| operations-compliance | 李工 | 风控策略确认 |
| business-experience | 张工 | 产品/体验对齐 |
| shared/metrics | 刘工 | 数据分析 & 验证 |

## 讨论要点
- policy_tag/action_required/escalation_level 字段是否需要增补：一致认定现有枚举满足 Phase1。
- 联调环境与 SDK 版本：stg `phase1-stg` + 前端 staging 站点，SDK 已升级。
- 风控升级流程：D3 触发合规委员会复审，需 9/23 输出复盘。

## 决策与行动项
| 项目 | 结论 | 责任人 | 截止日期 |
| --- | --- | --- | --- |
| 埋点字段确认 | policy_tag/action_required/escalation_level 字段确认，无新增需求 | Leon (PI) | 2025-09-21 |
| 前端 SDK 联调 | SDK 已接入新增字段，9/22 前完成回归 | Ivy (FE) | 2025-09-22 |
| 风控策略复核 | D3 升级流程生效，安排 9/23 审计复盘 | Alice (OC) | 2025-09-23 |

## 验证计划
- 测试环境：stg `phase1-stg`，前端 `https://phase1-stg.web.local`（09:00 升级窗口）
- 数据校验脚本：`shared/metrics/artifacts/2025-09-21/verify_phase1_events.sql`
- 录屏/截图归档路径：`shared/metrics/artifacts/2025-09-21/`
- SQL 执行结果：模拟执行（本仓库无法直连数据湖），预期检验 policy_tag/action_required/escalation_level 缺失为 0；实际运行需由数据团队确认后回填。

## 后续跟进
- 下次同步时间：2025-09-23 风控复盘会。
- 需要在 shared/CHANGELOG.md 登记的条目：9/21 指标联调完成，待数据团队回填 SQL 结果。
