# 多 Codex 协作指引

## 启动前准备
1. 阅读 `README.md` 了解团队分工（用户体验线 / 平台能力线 / 运营合规线）。
2. 查看 `shared/BUSINESS_RULES.md` 与 `shared/TECH_DECISIONS.md`，确保对业务规则与技术栈一致理解。
3. 在 `shared/CHANGELOG.md` 检查是否有进行中的跨组任务，并记录即将开展的公共改动计划。
4. 若需使用审核或风控流程，阅读 `operations-compliance/TODO.md` 中的最新标准与 SLA。

## 启动各 Codex 实例
- 使用命令：
  ```powershell
  codex --cd "D:\网页v2\webpage\<目录>"
  ```
  将 `<目录>` 替换为对应模块（如 `product-planning`、`experience-design` 等）。
- 每个目录包含 `TODO.md` 与 `CODEX.md`：
  - `TODO.md`：列出当前待办事项、协作依赖。
  - `CODEX.md`：说明启动步骤、注意事项、跨组协作流程。
- 启动后先阅读本目录 `TODO.md` 的最新内容，确认是否有其他小组留言。

## 日常协作流程
1. **计划与记录**：跨目录改动（组件、接口、文案、审核规则等）必须先在 `shared/CHANGELOG.md` 记录计划，完成后更新状态。
2. **同步与留言**：若需要其他小组接力，在对方目录的 `TODO.md` 增加留言或补充，并在 `shared/CHANGELOG.md` 简述。
3. **业务与技术对齐**：
   - 产品/体验/内容团队：定期复查 `shared/BUSINESS_RULES.md`，如有新增需求，更新后通知其他组。
   - 平台集成：更新接口契约、错误码、部署说明时，提交到 `shared` 目录并在日志中记录。
   - 运营合规：SOP、班次调整、审核策略变更需同步给其他组，确保前端与平台接口一致。
4. **实时跟进**：各 Codex 实例在关键节点（阶段完成、接口调整、需求变更）时，及时在 `shared/CHANGELOG.md` 更新状态，并说明需要其他团队确认的事项。

## 质量与合规
- `shared/TODO.md` 提供跨组自检清单，确保文案/设计/前端/平台/运营合规同步校验。
- 涉及模板、积分、任务处理或审核流程的改动需与 `operations-compliance` 协商，避免违反业务规则。
- 模板示例图、元数据、积分扣费等敏感流程按照 `BUSINESS_RULES.md` 执行，必要时附上证据或日志。

## 建议节奏
- 每个 Codex 实例保持“小步快跑”：完成一个 TODO 立即记录结果并更新 `CHANGELOG.md`，减少冲突。
- 可以在每日（或阶段性）产出 mini 总结，提醒其它团队关注重点变更。
- 遇到需求不明确或新增场景，先通过问答澄清，再落地到 TODO/文档中。

## 常见问题
- **问：如何切换目录？** 使用 `codex --cd "D:\网页v2\webpage\<目录>"` 启动新的 Codex；无需在终端手动切换目录。
- **问：公共改动如何登记？** 在 `shared/CHANGELOG.md` 新增一行，状态写“计划中”；完成后改为“已完成”并补备注。
- **问：如何查阅最新业务规则？** 查看 `shared/BUSINESS_RULES.md`、`TECH_DECISIONS.md`，若有更新需要所有 Codex 同步。
- **问：运营审核策略在哪看？** 参考 `operations-compliance/TODO.md`、`BUSINESS_RULES.md` 相关条目，涉及变更要先与运营合规线确认。

## 后续维护
- 若流程或分工有调整，请优先修改 `README.md`、`BUSINESS_RULES.md`、`TECH_DECISIONS.md`，并在 `shared/CHANGELOG.md` 公告。
- 每个团队完成阶段性任务时，可在 `shared` 目录补充成果文档或链接，方便其他 Codex 快速了解进度。
