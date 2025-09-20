# 角色集成说明

基于 `shared/role-matrix.md`，前端当前支持以下角色体验：

| 角色 | 入口/页面 | 当前实现 | 待办 |
| --- | --- | --- | --- |
| Visitor | Landing、模板列表（只读） | 默认 `viewer` 视角展示，CTA 引导到注册按钮（待补） | 导航需补登录/注册入口，并隐藏需要权限的按钮 |
| Viewer | Landing、任务中心（个人视图） | `RoleProvider` 默认 `viewer`，任务中心展示 Mock 数据 | 接口就绪后校验授权/积分；根据错误码提示充值/实名 |
| Creator | 创作者视角、任务中心（创作者） | `data-role="creator"` 控制主题色与快捷入口 | 等待收益/模板 API；补充模板管理入口链接 |
| Reviewer | 审核面板 | `app/ops/review` 页提供骨架与 Mock 队列 | 合规提供接口字段后对接操作按钮、日志、批量操作 |
| Compliance Ops | 举报面板、风控视图 | `app/ops/reports` 页骨架与占位信息 | 接入举报接口、积分回滚入口、通知操作；接入风险 KPI | 
| Admin | （未开） | 暂未提供前端入口 | 待平台管理员需求明确后设计 | 

## 对接须知
1. 角色切换：通过 `RoleContext` 控制 viewer/creator；后台角色将通过路由及权限中间件控制。
2. 设计令牌：`app/globals.css` 使用 `data-role` 选择器切换 accent 令牌，需保持与 `shared/design-tokens.md` 一致。
3. 权限提示：根据矩阵要求，错误提示与缺权限状态需在接口对接时补齐（例如拒绝访问时展示授权申请/联系客服）。
4. 后续若新增子角色（如客服、财务），请在本文件与 `RoleContext` 中补充逻辑并同步 `TODO.md`。

版本：v0.1（2025-09-17），更新后请同步 `shared/CHANGELOG.md`。

## 路由守卫计划

- [ ] 在 Next.js middleware.ts 中读取用户角色（Cookie/JWT），重定向无权限用户至登录或错误页。
- [ ] 对后台路由 /ops/* 添加 Reviewer/Compliance/Admin 校验，普通用户访问返回 403 提示。
- [ ] 前端 RoleContext 仅负责主题/体验切换，实际权限以服务端返回为准。
- [ ] 联调前需由 platform-integration 提供角色判定 API (GET /auth/session)，operations-compliance 提供权限矩阵最终版。
