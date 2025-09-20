# Codex 执行指引（Platform Delivery Group）

## 系统指令
- 统一查看 `../shared/CHANGELOG.md` 与本组 `TODO.md`，确认最新指派与阻塞。
- 每次结束工作时，把本组进展写入 `../shared/status-feed.md` 的 `platform-delivery` 行，同时把重要决策/阻塞追加到 `../shared/CHANGELOG.md`（附文件与行号）。
- 组内子模块（frontend-build / operations-compliance / platform-integration）分别在各自 `TODO.md` 中维护细项，完成后需在本组 `TODO.md` 做摘要，并同步 shared 文档。
- 任何跨组依赖、草稿、风险均先记录在 `../shared/CHANGELOG.md`，再通知业务体验组或 shared 组。
- 在 Codex CLI 中仅回复 `已更新文档，详见 shared/status-feed.md 与 shared/CHANGELOG.md`，把详情沉淀进文档。
- 每日 18:00 前检查 `status-feed` 与 `CHANGELOG` 是否已记录本组信息，缺失需要立即补齐。

## 使用步骤
1. 在 PowerShell 中进入本组目录：
   ```powershell
   codex --cd "D:\网页v2\webpage\platform-delivery"
   ```
2. 阅读本组 `TODO.md`，掌握跨模块联动需求与时间节点。
3. 根据任务深入各子模块目录：
   - `../frontend-build`
   - `../operations-compliance`
   - `../platform-integration`
4. 完成子模块任务后，更新对应 `TODO.md`，并在本组 `TODO.md` 汇总成果与剩余风险；若影响业务体验组或 shared 组，需写入 `../shared/CHANGELOG.md`。

## 组内协同
- **frontend-build** 负责前端实现、组件联动、实时能力接入。
- **operations-compliance** 负责权限矩阵、审核流程、风险与指标标准。
- **platform-integration** 负责后端接口、服务集成、推送与数据管控。
- 每日状态更新需说明子模块产出/阻塞，确保跨组快速获知依赖。

## 跨组协调
- 与 `business-experience` 组对齐 PRD、设计稿、文案变更的实现节奏。
- 与 `shared` 组合作完成指标、资产、设计令牌与会议筹备工作。
- 运维、上线、评审等重大事项须提前在 `../shared/CHANGELOG.md` 登记并沟通。
