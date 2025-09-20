# 平台集成节点追踪

| 日期 | 事项 | 输出 | 负责人 | 状态 | 备注 |
| --- | --- | --- | --- | --- | --- |
| 2025-09-18 | 素材交付（quickstart 插画、品牌渐变背景、案例图片路径） | 更新 `docs/ui-assets-plan.md`，素材上传至 `frontend-build/public` | experience-design / content-ops / platform-integration | 已完成 | 占位素材已上传（2025-09-17），待设计提供正式稿后替换并更新 CDN 策略 |
| 2025-09-19 | 权限矩阵自检 | 校对 `docs/role-access-mapping.md` 与 `shared/role-matrix.md`，输出差异清单 | platform-integration | 计划中 | 需与 frontend-build、operations-compliance 联合检查 scope 配置 |
| 2025-09-21 | 埋点计划确认 | 评审 `shared/metrics/README.md` 中埋点需求，补充平台接口字段 | platform-integration × product-planning | 计划中 | D2 联调完成后梳理事件与属性映射 |
| 2025-09-25 | 交付跟进与风险复盘 | 汇总素材、接口、权限等交付情况，输出风险复盘文档 | platform-integration | 计划中 | 结合上线准备清单，形成 `docs/risk-retro-20250925.md`（预留） |

## 后续动作
- 每个节点完成后更新本表状态并在 `shared/CHANGELOG.md` 记录成果或阻塞。
- 若依赖外部团队（设计、内容）延迟，需在 TODO 备注标注新日期并通知对应负责人。
