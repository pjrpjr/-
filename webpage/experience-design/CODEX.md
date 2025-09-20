﻿# Codex 执行指令（体验设计）

## 系统指令
- 先阅读本目录 `TODO.md` 与 `..\\shared\\CHANGELOG.md`，确认最新指派与阻塞。
- 每次结束工作时，必须在 `..\\shared\\status-feed.md` 中 `business-experience` 行填写“完成 / 阻塞 / 下一步 / 责任人”，并把决策或阻塞同步写进 `..\\shared\\CHANGELOG.md`（附文档及行号）。
- 模块内进展需在 `TODO.md` 勾选或补充备注，确保与 `CHANGELOG` 和 status feed 保持一致。
- 如需提交草稿或存在跨组依赖，请先在 `..\\shared\\CHANGELOG.md` 标记状态（如 draft/blocked），再通知相关模块。
- 在 Codex CLI 中仅回复 `已更新文档，详见 shared/status-feed.md 与 shared/CHANGELOG.md`，避免额外长篇摘要。
- 每日 18:00 前自查当日记录是否已写入上述两份文档，缺失时立即补齐。

## 启动前检查
- 阅读 `TODO.md`，确认最新待办与协作依赖。
- 查看 `..\shared\CHANGELOG.md` 以及 `shared/BUSINESS_RULES.md`、`shared/TECH_DECISIONS.md`，确认是否有影响交互的跨组更新。
- 如需参考既有交互规范，先浏览 `experience-design-spec.md`。

## 启动 Codex
```powershell
codex --cd "D:\网页v2\webpage\experience-design"
```
- 可按需追加 `--model`、`--sandbox` 等参数；`--cd` 会直接定位到本目录。
- 启动后立即重读本目录 `TODO.md`，确认是否有其他小组的留言或依赖更新。

## 日常工作流
1. 根据 `TODO.md` 推进线框、视觉与交互规格，所有产出保存在当前目录。
2. 新增或调整公共组件/文案前，先在 `..\shared\CHANGELOG.md` 记录计划，完成后更新状态并回填摘要。
3. 交付阶段：
   - 低保真/交互稿统一记录在 `experience-design-spec.md` 或新增说明文档。
   - 高保真视觉稿输出后，在 `TODO.md` 标记通知 `frontend-build`、`content-ops` 等协作方。
4. 若需其他团队接力，在其目录 `TODO.md` 留言或引用 `shared/CHANGELOG.md` 条目，保持时间戳与状态一致。

## 注意事项
- 合规提示、积分逻辑需与 `platform-integration`、`operations-compliance` 同步确认后再定稿。
- 产出的图稿请保存为轻量格式（PNG/WebP），命名包含模块与版本号。
- 每次阶段结束前自检：断点适配、状态覆盖、文案 placeholder、任务中心流程完整性。

## 跨组协作提醒
- 与 `platform-integration`：对齐积分补扣、任务排队、授权状态等系统反馈，确认接口能力后更新视觉稿。
- 与 `operations-compliance`：核对审核面板、举报流程与复核 SLA，避免与合规标准冲突。
- 与 `product-planning`：同步任务中心策略（如加速套餐、收益展示），确保体验与业务目标一致。
- 与 `frontend-build`：提供组件标注与导出资源，必要时附交互说明或原型链接。



