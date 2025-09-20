# Codex 执行指令（内容运营）

## 系统指令
- 先阅读本目录 `TODO.md` 与 `..\\shared\\CHANGELOG.md`，确认最新指派与阻塞。
- 每次结束工作时，必须在 `..\\shared\\status-feed.md` 中 `business-experience` 行填写“完成 / 阻塞 / 下一步 / 责任人”，并把决策或阻塞同步写进 `..\\shared\\CHANGELOG.md`（附文档及行号）。
- 模块内进展需在 `TODO.md` 勾选或补充备注，确保与 `CHANGELOG` 和 status feed 保持一致。
- 如需提交草稿或存在跨组依赖，请先在 `..\\shared\\CHANGELOG.md` 标记状态（如 draft/blocked），再通知相关模块。
- 在 Codex CLI 中仅回复 `已更新文档，详见 shared/status-feed.md 与 shared/CHANGELOG.md`，避免额外长篇摘要。
- 每日 18:00 前自查当日记录是否已写入上述两份文档，缺失时立即补齐。

## 启动前准备
1. 先查看 `..\shared\CHANGELOG.md`，确认是否有影响文案/素材的变更计划，并更新 `TODO.md` 最新留言。
2. 阅读本目录内现有产物（如 `landing-hero.md`、`creator-success-stories.md`、`quickstart-guide.md` 等），对齐语气、术语和结构。
3. 若任务涉及跨组文档或共享资源，提前在 `TODO.md` 记录协作依赖与联系人。

## 启动 Codex
在 PowerShell 中执行：
```powershell
codex --cd "D:\网页v2\webpage\content-ops"
```
必要时追加参数（如 `--model`、`--plan`），`--cd` 会把会话根目录设置为当前小组目录。

启动后立即阅读本目录最新 `TODO.md`，确认是否有其他小组的留言或新增依赖，再开始具体作业。

## 作业规范
- 优先按照 `TODO.md` 的顺序处理需求，新增文案或补充素材请放在本目录的 Markdown 文件中。
- 新增文件命名使用小写连字符，内容以 Markdown 编排；如涉及引用数据，标注来源及脱敏说明。
- 修改或新增跨目录文件（如共享政策、通知接口）前，必须先在 `..\shared\CHANGELOG.md` 登记计划，完成后回填状态。

## 跨组协作流程
1. **platform-integration**：涉及通知字段、触发逻辑或 API 说明时，先在对方 `TODO.md` 留言，并同步当前文案占位符需求。
2. **operations-compliance**：更新合规声明、风险分级或整改流程时，提交草稿给该组复核，记录反馈与最终决定。
3. **experience-design**：输出首屏/流程文案后，与设计确认排版与组件限制，必要时附带上下文链接。
4. 所有协作事项需在本目录 `TODO.md` 标记状态；若有阻塞，请在共享渠道或 `shared/CHANGELOG.md` 备注。

## 收尾
- 完成任务后更新 `TODO.md` 的勾选状态与产出链接。
- 若改动跨组资源，确保 `..\shared\CHANGELOG.md` 状态与备注同步。
- 复查新文件语法、占位符、敏感信息脱敏情况，再结束本次会话。


