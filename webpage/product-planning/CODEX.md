# Codex 执行指引（产品规划组）

## 系统指令
- 先阅读本目录 `TODO.md` 与 `..\shared\CHANGELOG.md`，确认最新指派与阻塞。
- 每次结束工作时，必须在 `..\shared\status-feed.md` 中 `business-experience` 行填写“完成 / 阻塞 / 下一步 / 责任人”，并把决策或阻塞同步写进 `..\shared\CHANGELOG.md`（附文档及行号）。
- 模块内进展需在 `TODO.md` 勾选或补充备注，确保与 `CHANGELOG` 和 status feed 保持一致。
- 如需提交草稿或存在跨组依赖，请先在 `CHANGELOG` 标记状态（如 draft/blocked），再通知相关模块。
- 在 Codex CLI 中仅回复 `已更新文档，详见 shared/status-feed.md 与 shared/CHANGELOG.md`，避免额外长篇摘要。
- 每日 18:00 前自查当日记录是否已写入上述两份文档，缺失时立即补齐。

## 前置事项
1. 首次进入请阅读全文档 `TODO.md`，确认阶段目标、协作方与时间节点。
2. 结合 `../网页需求.md`、`../多模块开发.md` 以及 `../README.md` 校准业务定位与交付范围。
3. 查阅 `..\shared\CHANGELOG.md`，了解跨模块状态、阻塞与既有决策。
4. 使用 Codex CLI：
   ```powershell
   codex --cd "D:\网页v2\webpage\product-planning"
   ```
   如需指定模型再附加 `-m` 参数，确保工作目录固定在本模块。
5. 执行前确认 `phase1-*`、`phase2-*` 文档的最新版本，避免覆盖他人更新。

## 注意事项
- 产品规划需与 `shared/BUSINESS_RULES.md`、`shared/TECH_DECISIONS.md` 保持一致，禁止自定义未备案的约束。
- 任何对 PRD、里程碑或指标的修改都要与 `content-ops`、`operations-compliance`、`experience-design` 事先同步。
- 录入/调整文档时请保持 UTF-8 编码与 Markdown 语法，必要时添加简短说明帮助其他模块理解。
- 若要引用外部数据或链接，务必注明来源及生效时间，防止信息过期。

## 协作流程
1. **需求同步**：在 `phase1-baseline.md`、`phase1-interfaces.md` 等文档中梳理 personas、JTBD、接口范围，并在 `TODO.md` 标记责任人。
2. **时间轴维护**：对里程碑、交付清单、风险评估等内容，需在 `phase1-deliverables-tracker.md`、`phase1-risk-review.md` 内保持最新版，并将变更写入 `..\shared\CHANGELOG.md`。
3. **跨组沟通**：与 `platform-integration`、`frontend-build`、`experience-design`、`content-ops`、`operations-compliance` 对齐依赖后，更新 `TODO.md` 与 `status-feed` 记录。
4. **成果归档**：阶段产出完成后，及时在 `shared/CHANGELOG.md` 标记“done”，并在相关 PRD/计划文档内补充总结或链接。
5. **风险复盘**：遇到阻塞时先在 `status-feed.md` 写明，再与责任模块约时间解决，必要时在 `phase1-risk-review.md` 追加风险项。


