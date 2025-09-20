# 角色权限矩阵

| 角色 | 关键能力 | 页面/模块权限 | 平台接口/Scope 依赖 | 备注 |
| --- | --- | --- | --- | --- |
| 游客（Visitor） | 浏览模板、查看案例、阅读 FAQ | Landing、模板详情（只读） | 无 | 不显示积分余额；CTA 引导注册/登录 |
| 注册用户（Viewer） | 申请授权、发起任务、充值积分 | Landing、模板详情、任务中心（个人视图） | Scopes: credits.estimate, credits.charge, licenses.check, task.read, tasks.push | 通过实名/合规校验后才能发起任务；操作写入 audit_trail |
| 创作者（Creator） | 上传训练成果、管理授权名单、查看收益 | 创作者后台、任务中心（创作者视图） | Scopes: authorization.manage, credits.read, task.manage, reports.create | 可下架模板、批量授权；需要审计日志与 policy_tag 颜色映射 |
| 审核员（Reviewer） | 审核模板材料、处理举报、触发人工回滚 | 审核后台、举报面板、任务异常列表 | Scopes: review.approve, credits.rollback, reports.action, tasks.audit | 操作需记录 operatorId/role、审批备注与 policy_tag |
| 运营合规（Compliance Ops） | 配置政策、监控指标、制定通知 | 风控看板、配置中心 | Scopes: compliance.policy, reports.audit, templates.publish, metrics.read | 拥有 Reviewer 权限 + 能编辑政策；需同步 policy_tag、risk_level、action_required |
| 平台管理员（Admin） | 配额管理、系统配置、用户冻结 | 管理后台、系统日志 | Scope: admin.full | 多因素认证；操作写入审计表并带审批号 |

## 使用说明
1. 新增或调整角色权限时，请更新本表并在 shared/CHANGELOG.md 登记。
2. 前端根据角色切换 token（见 shared/design-tokens.md）调整主题；后端依据 scope 控制接口返回字段。
3. 若需细化到按钮级权限，请在本表下追加子表或链接至专门文档。

## 版本记录
| 日期 | 说明 |
| ---- | ---- |
| 2025-09-19 | 与平台/合规评审一致，补充 scope 映射与 audit_trail 要求。 |
| 2025-09-18 | 同步 product-planning / operations-compliance 更新，补充 Visitor→Viewer 提示与 Reviewer 责任描述。 |
