# Phase 2 Plan — Operations Compliance

## Milestones
| 日期 | 里程碑 | 说明 |
| ---- | ------ | ---- |
| 09/18 | Phase2 规格冻结 | Spec/Plan/Tasks 定稿，跨组确认范围 |
| 09/19 | 权限矩阵评审 | Ops + Platform 会议，更新 API 权限及审计要求 |
| 09/21 | 埋点计划确认 | 跨组评审合规字段，更新 shared/metrics/README.md |
| 09/25 | 风控复盘交付 | 汇总自检结果与风险行动项 |
| 09/30 | Phase2 总结 | 风控看板 MVP、审核面板增强上线评估 |

## Workstreams
### W1 审核面板增强
- 负责人：Ops Compliance（规格）、Frontend Build（实现）、Platform Integration（接口）。
- 任务：引用驳回原因枚举、举报动作、积分回滚字段；保持 Reviewer/Compliance Ops 权限控制。
- 测试：前端单元测试 + 手动核对下拉/提示；接口返回枚举值校验；UAT 场景覆盖通过/驳回/复核。

### W2 风控看板 MVP
- 负责人：Frontend Build（前端）、Platform Integration（metrics API）、Ops Compliance（指标定义）。
- 任务：实现 KPI 卡、趋势图、预警列表、异常账号卡片，接入 `/metrics` 与 SSE。
- 测试：Mock 数据单元测试、SSE 断线重连测试、指标阈值触发脚本。

### W3 埋点 & 权限矩阵
- 负责人：Ops Compliance（字段）、Shared（会议组织）、Platform Integration（更新 API）、Product Planning（PRD 更新）。
- 任务：`compliance-tracking-inputs.md` -> shared/metrics/README.md；权限自检清单 -> `api-permission-matrix.md`。
- 测试：埋点 SDK log 验证、权限中间件集成测试、审计日志字段检查。

### W4 素材 & 文案
- 负责人：Experience Design、Content Ops、Ops Compliance。
- 任务：导出高保真 SVG/PNG，更新 assets-manifest；同步整改模板与角色文案。
- 测试：前端静态资源加载、命名规范/权限检查。

## Dependencies
- Experience Design：9/18 前导出素材；9/19 提供评审反馈。
- Frontend Build：资源替换、审核面板/风控看板实现、埋点接入。
- Platform Integration：接口/metrics/SSE 字段；鉴权与审计日志。
- Product Planning：phase1-baseline 更新角色流程、指标定义；risk-review。
- Content Ops：整改通知模板、文案更新。

## Risks
| 风险 | 影响 | 缓解措施 |
| ---- | ---- | -------- |
| 素材延迟交付 | 影响前端替换 | 保留占位稿、持续在经验设计 TODO 提醒 |
| 接口字段变更 | 埋点对齐失败 | 自检清单+CHANGELOG 同步，必要时 nightly 对账 |
| 指标数据缺失 | 风控看板无法上线 | 提前与 Platform Integration 对接 mock 数据和告警策略 |

## Testing Strategy
- 单元：前端组件 + 埋点 SDK + API 枚举解析。
- 集成：Reviewer/Compliance Ops 权限守卫；风控看板 API -> UI 数据流；积分回滚流水写入。
- UAT：跨组联调脚本（审核通过、驳回、举报、退款、告警响应）。
- 监控：上线后通过埋点与指标看板观察 24h。

## Reporting
- 每日 18:00 前更新 shared/CHANGELOG.md 与 shared/checklist.md。
- 重大阻塞>24h 在 TODO 与 CHANGELOG 标注并 @ 责任组。
