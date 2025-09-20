# Phase2 Tasks（平台集成 · v0.2 · 2025-09-18）

> 状态字段请同步到根 `TODO.md` 并在 shared/CHANGELOG.md 记录。所有任务先编写/更新测试，再实现代码。

| 编号 | 描述 | TODO 对应 | 负责人 | 测试要求 | 依赖 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| T2-1 | Phase2 规格评审并输出纪要 | 根 TODO：2025-09-18 规格评审 | Platform Integration × Product Planning | 无（文档评审） | Spec v0.2、plan v0.2 | 完成：2025-09-19（Phase2 Outline 已发布） |
| T2-2 | `/licenses/check` `/credits/estimate` 设计说明 v0.2 + 更新 `docs/api-design-notes.md` | instructions 9/18 | Platform Integration | 无（设计文档） | T2-1 | 完成：2025-09-18 |
| T2-3 | 更新 `docs/platform-static-assets.md`（CDN/鉴权策略）并同步 manifest | instructions 9/18 | Platform Integration × Shared | 无 | 体验设计/内容素材 | 完成：2025-09-18（等待正式素材） |
| T2-4 | 权限矩阵评审结论（更新 `docs/api-permission-matrix.md`、`specs/phase2/notes.md`） | instructions 9/19 | Platform Integration × Operations Compliance | N/A | T2-1 | 进行中：整理 9/19 会议纪要 |
| T2-5 | `/credits/estimate` `/credits/charge` `/licenses/check` 实现 + 单元测试 | instructions 9/20 | Platform Integration | tests/app/test_credits.py 等（待建） | T2-2、接口字段 | 待执行：9/20 启动实现/TDD |
| T2-6 | WebSocket/SSE 契约文档 + 实时推送实现计划 | instructions 9/22 | Platform Integration | N/A | T2-1 | 待执行：等待 9/20 推送字段确认 |
| T2-7 | Audit log 方案细化（日志字段、存储） | instructions 9/23 | Platform Integration × Operations Compliance | N/A | tasks app | 待执行 |
| T2-8 | 测试环境联调及部署 | instructions 9/24 | Platform Integration × Frontend | 集成测试 | T2-5、T2-6 | 待执行 |
| T2-9 | 平台联调复盘报告 | instructions 9/25 | Platform Integration | N/A | 联调完成 | 待执行 |
| T2-10 | Phase2 后端规划大纲 | instructions 9/26 | Platform Integration | N/A | 规格/计划输入 | 待执行 |

