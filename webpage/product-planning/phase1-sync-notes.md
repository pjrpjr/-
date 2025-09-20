# Phase1 跨组跟进记录（2025-09-20）

## 9/21 埋点落地计划跟进
- **platform-integration**：已收到 `/licenses/check`、`/credits/estimate` 字段说明，待确认 `policy_tag` 枚举及事件回传格式（负责人：平台后端-Alice，反馈时间：9/21 12:00）。
- **frontend-build**：需在 9/21 前提交 CTA A/B 埋点及估算器字段实现方案（负责人：前端-Bob，待提供文档链接）。
- **operations-compliance**：检查风控告警字段映射、输出 policy_tag 枚举表（负责人：合规-Carol，进度：审核中）。
- **content-ops**：整理案例素材与 CTA 文案包，支持埋点校验（负责人：内容运营-Diana，计划：9/21 11:00 交付）。
- **产品规划**：9/21 将以上反馈汇总至 shared/CHANGELOG，并在 TODO 勾选。

## 9/25 交付项准备
- **wireframe v1.1（experience-design）**：确认线框调整点（Hero 双 CTA、案例文案），等待设计稿输出。
- **实时通道方案（frontend-build）**：WebSocket 主通道、REST 降级、SSE 兼容测试计划需在 9/22 前提供草稿以便评审。
- **接口草案 v0.2（platform-integration）**：参考 `phase1-interfaces.md`，反馈接口评估结果+错误码映射。
- **SOP v1.1（operations-compliance）**：补充“高风险模板” 24h 复核流程，计划 9/23 内审。
- **案例素材包（content-ops）**：3 个案例 Story + CTA 文案包等待经验设计对齐。

## 设计令牌与素材协同
- 采用 `shared/design-tokens.md` 中 accent、muted、radius/shadow；产品规划提供文案对照表，experience-design 前置确认。
- 资产命名参考 `shared/assets-manifest.md`，模板 DEMO 视频脚本由产品规划起草，需 9/22 前发给设计审核。

## 角色流程更新
- Visitor→Viewer 注册提示与 FAQ 文案需纳入 PRD v0.2，Reviewer/Compliance Ops 操作步骤同步到 SOP；计划 9/23 在 PRD 草稿更新。
