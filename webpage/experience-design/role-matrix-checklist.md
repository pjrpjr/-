# 角色视图对齐清单（体验设计）

> 更新时间：2025-09-19（依据 shared/role-matrix.md、platform-integration/docs/api-permission-matrix.md 以及合规评审结论）

| 角色 | 关键界面/模块 | Scope 映射 | 设计状态 | 说明 |
| --- | --- | --- | --- | --- |
| Visitor | Landing、模板详情（只读） | 无 | ✅ 已确认 | 隐藏积分余额与操作入口，CTA 引导注册/登录 |
| Viewer | Landing、任务中心（个人视图）、实时提示 | `task.read` `credits.estimate` `credits.charge` `licenses.check` `tasks.push` | ✅ 已确认 | 展示余额、预扣提示与排队加速 CTA，所有操作写入 audit badge |
| Creator | 创作者后台、授权名单、收益面板 | `authorization.manage` `credits.read` `task.manage` `reports.create` | ✅ 已确认 | 高亮收益与任务状态，支持批量授权；标记 policy_tag 颜色映射 |
| Reviewer | 审核后台、举报面板、任务异常面板 | `review.approve` `credits.rollback` `reports.action` `tasks.audit` | ✅ 已确认 | Checklist + SLA 提示，操作区展示审批备注输入框与双人确认提醒 |
| Compliance Ops | 风控看板、政策配置、指标视图 | `compliance.policy` `reports.audit` `templates.publish` `metrics.read` | ⚠️ 待补充 | 等待 9/20 风控面板 IA 最终稿，需同步 policy_tag 颜色图例 |
| Admin | 管理后台、系统配置 | `admin.full` | ⚠️ 待确认 | Phase1 暂不开放管理后台，待 platform-delivery 交付多因素方案 |

## 9/19 角色权限评审结论
- 已同步 `review.approve`、`compliance.policy` 等 scope 到组件级映射，并在前端表单中引用。
- Reviewer 与 Compliance Ops 的提示语采用统一模板，引用 `policy_tag`、`risk_level`、`action_required` 三个字段。
- Viewer/Creator 的实时反馈需在信息卡中标记 audit badge，显示“操作将写入 audit_trail”。
- 待续项：Compliance Ops 风控面板（9/20 前补齐）、Admin 多因素流程（等待平台方案）。

## 设计自检要点
- 主题切换：所有画板已配置 `data-role` 与 theme token，Figma 原型链接已更新。
- 文案对齐：Reviewer/Compliance 提示文案引用 `content-ops/role-messaging-guide.md` 中最新字段占位符。
- 无障碍：按钮/链接对比度 ≥ 4.5:1；状态提示包含 icon + text + aria-label。

## 待确认 & 跟进
1. Compliance Ops 风控看板是否需要新增政策配置图例（等待 operations-compliance 反馈）。
2. Admin 视图是否纳入 Phase1 交付范围（等待 platform-delivery schema 与多因素实现）。
3. 若 policy_tag 枚举于 9/21 扩充，需同步更新颜色映射与提示语。
