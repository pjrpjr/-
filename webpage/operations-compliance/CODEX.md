# Codex 执行指令（运营合规）

## 系统指令
- 先阅读本目录 `TODO.md` 与 `..\\shared\\CHANGELOG.md`，确认最新指派与阻塞。
- 每次结束工作时，必须在 `..\\shared\\status-feed.md` 中 `platform-delivery` 行填写“完成 / 阻塞 / 下一步 / 责任人”，并把决策或阻塞同步写进 `..\\shared\\CHANGELOG.md`（附文档及行号）。
- 模块内进展需在 `TODO.md` 勾选或补充备注，确保与 `CHANGELOG` 和 status feed 保持一致。
- 如需提交草稿或存在跨组依赖，请先在 `..\\shared\\CHANGELOG.md` 标记状态（如 draft/blocked），再通知相关模块。
- 在 Codex CLI 中仅回复 `已更新文档，详见 shared/status-feed.md 与 shared/CHANGELOG.md`，避免额外长篇摘要。
- 每日 18:00 前自查当日记录是否已写入上述两份文档，缺失时立即补齐。

## 启动步骤
1. 先阅读 `..\shared\CHANGELOG.md`、`..\shared\BUSINESS_RULES.md` 以及本目录 `TODO.md`，掌握最新协同计划、业务口径与待办事项。
2. 若涉及跨目录改动，先在 `..\shared\CHANGELOG.md` 登记计划（含影响范围、预计产出、协作者）。
3. 在 PowerShell 中进入 Codex 会话：
   ```powershell
   codex --cd "D:\网页v2\webpage\operations-compliance"
   ```
   需要附加参数时可继续补充，`--cd` 会将会话根目录定位到本目录。
4. 启动后先阅读本目录 `TODO.md` 的最新内容，确认是否有其他小组留言，再按照优先级推进文档、流程或工具输出，并在完成后勾选与记录决策。

## 注意事项
- 文档统一使用 UTF-8 编码，保存在当前目录；命名遵循已有约定（SOP、流程、接口说明等）。
- 变更涉及其他小组时，务必先沟通依赖与时间点，再执行修改，避免重复劳动。
- 若需引用共享素材或接口文档，请确认 `..\shared` 目录下的最新版本并保持同步更新。
- 对政策、审核标准等敏感信息的调整，需在完成后于 `..\shared\CHANGELOG.md` 标注“已完成”并留下简要说明。

## 跨组协作流程
1. **识别依赖**：在 `TODO.md` 记录每项任务的协作者与所需输入，必要时在对方目录 `TODO.md` 留言提醒。
2. **登记计划**：跨目录改动或需要平台支持时，提前在 `..\shared\CHANGELOG.md` 填写计划并 @ 对应负责人。
3. **共同推进**：与 `product-planning`、`experience-design`、`frontend-build`、`platform-integration` 等协作者确认接口、原型或实现节奏，必要时召开同步会议并沉淀纪要。
4. **落地与归档**：交付物准备就绪后，将文档放置在本目录（或约定位置），并把相关接口/素材同步到 `..\shared`（如需）。
5. **状态更新**：
   - 在 `TODO.md` 勾选完成项并补充结论/后续事项。
   - 更新 `..\shared\CHANGELOG.md` 的状态列，标记为“已完成”并说明主要影响。
   - 若对他组有待办/风险，及时在其目录 `TODO.md` 追加留言，确保后续跟进。


