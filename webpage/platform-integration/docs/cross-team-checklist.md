# 关键节点执行清单（跨组）

| 日期 | 事项 | 责任组 | 相关文档/产出 | 当前状态 | 后续动作 |
| ---- | ---- | ---- | ---- | ---- | ---- |
| 2025-09-18 | 素材导出：Hero 渐变、Quickstart 插画、任务状态图标、Persona Badge | experience-design × content-ops × platform-integration × frontend-build | shared/assets-manifest.md、docs/ui-assets-plan.md、frontend-build/public/* | 待体验提供高保真导出；Ops 已放占位图 | 体验设计确认动效素材范围（对齐 stage/progress/next_eta），交付后 24h 内平台更新 manifest 与 README |
| 2025-09-18 | `/licenses/check`、`/credits/estimate` 等接口设计（联调计划） | platform-integration × frontend-build | docs/api-credit-authorization-push.md、docs/api-permission-matrix.md | `/credits/estimate` `/credits/charge` `/credits/ledger` 已就绪，等待前端反馈 | 9/18 前确认字段满足适配层需求，如需新增字段当日登记 changelog |
| 2025-09-19 | 角色权限自检/评审 | platform-integration × operations-compliance × experience-design × product-planning | docs/role-access-mapping.md、shared/role-matrix.md、operations-compliance/permission-matrix-selfcheck-2025-09-19.md | 自检清单已列出待评估项 | 9/19 评审前完成 scope 校验，产出差异清单并更新 changelog |
| 2025-09-19 | `/sessions/me` 返回角色主题标识 | platform-integration × frontend-build | docs/api-permission-matrix.md、openapi-platform-mock.json | 待实现 | D2 前在 Mock 中补充角色主题字段并记录产出 |
| 2025-09-21 | 埋点计划评审 | shared 监控组 × product-planning × platform-integration × experience-design × frontend-build | shared/metrics/README.md、experience-design/tracking-handshake-plan.md、product-planning/phase1-baseline.md | 计划中 | 汇总 CTA/variant/事件映射，形成联调 checklist，并在 changelog 登记 |
| 2025-09-25 | 联调复盘与风险跟进 | 平台集成 × frontend-build × experience-design × operations-compliance × product-planning | docs/delivery-schedule.md、risk-retro-20250925.md（预留）、delivery-followup-plan.md | 计划中 | 收集联调截图、更新复盘文档，评估剩余风险 |

## 待落实任务分配
- 产品规划：补齐 phase1-baseline.md 中补扣弹窗与加速横幅流程（引用新接口字段），更新 phase1-risk-review.md。
- 体验设计：tracking-handshake-plan.md 中加入推送节奏与补扣提示动效说明。
- 内容运营：hero-flow-design-handoff.md、role-messaging-guide.md 需同步加速/补扣文案。
- 运营合规：assets-delivery-plan.md、risk-dashboard-plan.md 更新图标/告警字段。
- 前端：docs/ 目录补充接口适配说明、联调操作手册。
- 平台集成：docs/api-* 系列保持与最新接口一致，完成权限矩阵与 session 主题字段。
- shared：shared/assets-manifest.md、shared/checklist.md 定期刷新节点状态。

> 本清单作为跨组执行看板，完成任一节点后需同步更新此表、TODO 与 shared/CHANGELOG。
