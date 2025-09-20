# Codex 执行指引（共享协作）

## 系统指令
- 先阅读本目录 `TODO.md` 与 `shared/CHANGELOG.md`，确认最新指派与阻塞。
- 每次结束工作时，必须在 `shared/status-feed.md` 中 `shared` 行填写“完成 / 阻塞 / 下一步 / 责任人”，并把决策或阻塞同步写进 `shared/CHANGELOG.md`（附文档及行号）。
- 模块内进展需在 `TODO.md` 勾选或补充备注，确保与 `CHANGELOG` 和 status feed 保持一致。
- 如发现文档缺口或跨组依赖，请先在 `shared/CHANGELOG.md` 标记状态（如 draft/blocked），再通知相关模块跟进。
- 在 Codex CLI 中仅回复 `已更新文档，详见 shared/status-feed.md 与 shared/CHANGELOG.md`，避免额外长篇摘要。
- 每日 18:00 前自查当日记录是否已写入上述两份文档，缺失时立即补齐。

## 日常职责
1. 进入前先看 `shared/CHANGELOG.md` 与本目录 `TODO.md`，确认是否有新的指派或阻塞。
2. 在 PowerShell 中运行：
   ```powershell
   codex --cd "D:\网页v2\webpage\shared"
   ```
   如需指定模型可追加参数，务必保持工作目录在 shared 模块。
3. 负责维护共享设计规范、资产清单、跨模块对齐文档，确保通知链路一致并及时留痕。
4. 其他小组有更新时，需同步到 `shared/CHANGELOG.md`，并在对应模块 `TODO.md` 或状态表做备注。

## 注意事项
- 若发现共享文档缺失，请先创建草稿并在 `shared/CHANGELOG.md` 标记 `draft` 状态，随后通知责任模块完善。
- 跨模块会议（如 9/21 指标对齐会）需提前 24 小时提醒相关 Codex，并准备纪要模板以便会后沉淀。
- 确保每天 18:00 前完成 `status-feed.md` 与 `CHANGELOG.md` 的更新复核。
- 如遇权限或环境故障，记录在 `status-feed.md` 的阻塞栏目并 @ 产品/平台 负责人。
- 归档平台 API、权限、ER 图等资料时，请保持目录结构清晰并在 `CHANGELOG` 留下链接。
