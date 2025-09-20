# 风险复盘（Experience Design · 2025-09-17）

## 已识别风险
1. **补扣弹窗文案 vs. 支付流程**：若 platform-integration 最终取消自动补扣，将导致 CTA 与提示失真。
2. **加速横幅合法性**：需确保 content-ops 已确认积分加速文案不涉及“保证收益”表述。
3. **Rev/Compliance 警示色**：红色/琥珀色提示需与 operations-compliance 最新 SOP 保持一致。

## 缓解措施
- 与 platform-integration、content-ops 每日站会同步金额与文案调整；已在 TODO 中标记 24h 内处理。
- 高保真稿保留“可选加速”脚注并附链接到积分规则。
- 为审核/举报界面预留调色板变量，若合规团队提供新颜色可快速替换。

## 下步行动
- 9/18 上午确认自动补扣是否保留，必要时更新弹窗交互稿。
- 9/19 权限矩阵评审会议记录需回填至 `shared/CHANGELOG.md`。
- 9/21 埋点计划确认：若 shared/metrics/README.md 更新字段，需要同步到体验稿注释。
