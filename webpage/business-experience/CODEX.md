# Codex 执行指引（Business Experience Group）

## 系统指令
- 统一查看 `../shared/CHANGELOG.md` 与本组 `TODO.md`，确认最新指派与阻塞。
- 每次结束工作时，把本组进展写入 `../shared/status-feed.md` 的 `business-experience` 行，同时把重要决策/阻塞追加到 `../shared/CHANGELOG.md`（附文件与行号）。
- 组内各子模块（product-planning / experience-design / content-ops）的具体待办仍在各自 `TODO.md` 中维护，更新后须在本组 `TODO.md` 做摘要。
- 会议纪要、跨组依赖、草稿状态请先记录在 `../shared/CHANGELOG.md`，再同步给相关组。
- 在 Codex CLI 中仅回复 `已更新文档，详见 shared/status-feed.md 与 shared/CHANGELOG.md`，把详细内容沉淀到文档。
- 每日 18:00 前检查 `status-feed` 与 `CHANGELOG` 是否已更新本组信息，缺失时立即补齐。

## 使用步骤
1. 在 PowerShell 中进入本组目录：
   ```powershell
   codex --cd "D:\网页v2\webpage\business-experience"
   ```
2. 阅读本组 `TODO.md`，了解跨模块联合任务与优先级。
3. 根据需要深入各子模块目录：
   - `../product-planning`
   - `../experience-design`
   - `../content-ops`
   在子目录里处理各自详细交付（PRD、设计稿、文案等）。
4. 子模块完成事项后，更新其 `TODO.md` 并在本组 `TODO.md` 汇总；若有跨组依赖，及时写入 `../shared/CHANGELOG.md`。

## 组内协同
- **产品规划**负责 PRD、里程碑、指标与风险，确保与体验、内容同步。
- **体验设计**负责线框、视觉、交互规范，提供组件标注与资源管理。
- **内容运营**负责文案、模板、通知与本地化计划，保持文案合规与品牌一致。
- 组内任务需在每日状态更新中说明哪一子模块完成了哪些输出、还有哪些阻塞。

## 跨组协调
- 与 `platform-delivery` 确认接口、前端实现、合规检查的节奏；遇到阻塞写入 `shared/CHANGELOG.md`。
- 与 `shared` 协作完成资产、令牌、指标汇总及会议筹备。
- 如需上线评审或高风险决定，提前在 `shared/CHANGELOG.md` 添加条目并安排同步会议。
