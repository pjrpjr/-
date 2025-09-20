# Phase1 Risk Review Draft

## 目标
梳理 Phase1 首屏 + 授权流程的潜在风险、应对策略与责任人，支撑 9/25 交付后的复盘。

## 风险项
| 风险类别 | 描述 | 影响 | 当前状态 | 应对措施 | 责任人 |
| -------- | ---- | ---- | -------- | -------- | ------ |
| 算力估算偏差 | `/credits/estimate` 返回区间与实际消耗波动 >20% | 预算误差、扣费纠纷 | 已发现：缺乏真实样本 | 采集试运营数据并调整估算因子；提供提示语 | product-planning（数据）、platform-integration（实现） |
| 授权撤销延迟 | Creator 撤销后 Viewer 仍可提交任务 | 合规风险 | 已记录：/licenses/check 需实时生效 | 接口实时校验 + 任务入队前二次检查 | platform-integration、operations-compliance |
| 风控告警漏报 | `policy_tag` 未同步导致告警逻辑缺失 | 合规风险 | 进行中：合规将在 9/21 提供枚举 | 补齐 `policy_tag` 枚举并在埋点回传；SOP 审核 | operations-compliance |
| 角色指引模糊 | Visitor 不清楚注册收益，Reviewer 操作口径不明 | 转化下降、流程卡点 | 已更新：PRD/SOP 引用 role-messaging 指南 | 持续收集反馈并优化文案 | product-planning、experience-design |
| 素材交付延迟 | 9/18 插画/案例未到位影响首屏高保真 | 设计阻塞 | 占位素材已交付，等待正式稿 | 跟进体验设计/内容运营提供最终源文件，平台集成更新 CDN 策略 | product-planning、experience-design、content-ops |

## 下一步
- 9/21：根据埋点反馈更新风险状态。
- 9/25：在交付评审时复盘并输出正式风险报告。
- 2025-09-26：需要补充最终复盘（在 TODO.md 中提醒）。
