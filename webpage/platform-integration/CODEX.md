# Codex 执行指令（平台集成）

## 系统指令
- 先阅读本目录 `TODO.md` 与 `..\\shared\\CHANGELOG.md`，确认最新指派与阻塞。
- 每次结束工作时，必须在 `..\\shared\\status-feed.md` 中 `platform-delivery` 行填写“完成 / 阻塞 / 下一步 / 责任人”，并把决策或阻塞同步写进 `..\\shared\\CHANGELOG.md`（附文档及行号）。
- 模块内进展需在 `TODO.md` 勾选或补充备注，确保与 `CHANGELOG` 和 status feed 保持一致。
- 如需提交草稿或存在跨组依赖，请先在 `..\\shared\\CHANGELOG.md` 标记状态（如 draft/blocked），再通知相关模块。
- 在 Codex CLI 中仅回复 `已更新文档，详见 shared/status-feed.md 与 shared/CHANGELOG.md`，避免额外长篇摘要。
- 每日 18:00 前自查当日记录是否已写入上述两份文档，缺失时立即补齐。

1. 启动前查看 `..\shared\CHANGELOG.md` 与各目录 `TODO.md`，确认有无待协同的接口或配置更新。
2. 在 PowerShell 中执行：
   ```powershell
   codex --cd "D:\网页v2\webpage\platform-integration"
   ```
   可按需追加模型、沙箱等参数；`--cd` 会将 Codex 会话根目录设在本目录。
3. 进入 Codex 后，优先推进本目录 `TODO.md` 中的 API 设计、积分与授权实现、日志方案等任务，产出文档与脚本都存放在此。
4. 如需影响其他小组（例如接口变更、错误码调整），先在 `..\shared\CHANGELOG.md` 登记计划，完成后更新状态并在相关目录 `TODO.md` 留言通知。


