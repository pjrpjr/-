# 共享协作任务清单
> 统一执行指令：逐项执行本 TODO 的任务，完成后勾选并于 shared/CHANGELOG.md 登记状态/阻塞，跨组事项需在相关文档和 TODO 留言同步。

- [x] 整理统一的设计令牌（色板、字体、间距、阴影等），同步更新给所有小组。文档：shared/design-tokens.md。
- [x] 维护公共素材（Logo、图标、背景图等），注明源文件位置与导出规格。清单：shared/assets-manifest.md。
- [ ] 在动手前于 CHANGELOG.md 记录所有计划中的跨组改动，并在完成后更新状态。（持续工作）
- [x] 发布跨目录修改的自检清单（文案/设计/前端/平台集成/运营合规），预防回归问题。（待与各组共拟模板）
  - 产出：shared/checklist.md Draft v0.1（2025-09-18），已公告 shared/CHANGELOG。
- [ ] 协调训练系统、社区互动、管理后台等后续模块的路线图，决定是否在当前页面露出占位信息。
- [ ] 归档 platform-integration 输出的接口文档、错误码、环境配置、数据库 ER 图，确保其他小组可查。（docs/ 下待补 ER 图）
- [x] 维护角色权限矩阵（用户/创作者/审核员/管理员），同步到前端与平台集成两侧，避免权限冲突。文档：shared/role-matrix.md。
- [x] 整理 operations-compliance 的审核标准、SOP、工具需求，供体验/前端/平台团队参考。参考：operations-compliance/template-review-standards.md、operations-compliance/task-exception-handling.md、operations-compliance/reporting-sop.md、operations-compliance/audit-panel-fields.md。
- [x] 9/18 前确认所有素材的上传路径与权限：协助 content-ops、operations-compliance 验证 public 目录权限、命名规范，并在 assets-manifest.md 标记“已交付/待交付”。
  - 产出：shared/assets-manifest.md 更新 Hero / Quickstart / Persona / Task Status 行；shared/CHANGELOG.md 登记 2025-09-18 交付。
- [x] 9/19 前发布跨目录自检清单（草稿），包含文案、设计、前端、平台、运营合规的交付核对项，提交 shared/checklist.md 并公告至 CHANGELOG。
- [x] 与 product-planning 对齐角色流程更新，在 role-matrix.md 和 design-tokens.md 追加“版本历史/变更说明”。
  - 产出：shared/role-matrix.md、shared/design-tokens.md 新增 2025-09-18 版本记录条目。
- [ ] 9/21 组织埋点评审会议（协调产品/体验/前端/平台/合规、内容），并将结果写入 shared/metrics/README.md 与 CHANGELOG。
  - Ops compliance：已提交草案 `operations-compliance/compliance-tracking-inputs.md`（2025-09-18），会议需确认字段/枚举落地。
- [ ] 9/25 汇总跨组交付自检结果：根据 shared/checklist.md 回收反馈，在 CHANGELOG 标记完成项并同步下一阶段关注点。
- [ ] 维持 daily 状态同步：每天下午 18:00 前将新增交付、阻塞、资源上传情况写入 shared/CHANGELOG.md。（执行中：2025-09-21 记录埋点评审结果）
> 2025-09-18：素材上传权限已验证，自检清单发布，等待 9/21 埋点评审。



