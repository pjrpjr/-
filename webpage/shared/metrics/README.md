# Phase1 Landing 指标 & 埋点 Schema

## 落地计划（9/21 前）
- [技术落地计划](implementation-plan.md)：包含负责人、环境依赖、测试策略与联调步骤。
- platform-integration：9/21 前输出 `/licenses/check`、`/credits/estimate` 接口草案，确认 `policy_tag`、`expected_credits_range` 字段。
- frontend-build：9/21 前完成 CTA A/B 埋点方案与估算器字段实现计划。
- operations-compliance：9/21 前更新 SOP 与告警字段映射，提供 policy_tag 枚举表。
- content-ops：9/21 前提交案例素材及 CTA 文案包，支撑体验与埋点。
- 产品规划：9/21 在 shared/CHANGELOG 登记落地结果与风险。

## 事件总览
| 事件 ID | 场景 | 触发说明 | 关键字段 | 责任小组 |
| ------- | ---- | -------- | -------- | -------- |
| landing_view | 用户访问首屏 | 页面加载完成后触发，记录首屏曝光 | `user_id`(脱敏)、`session_id`、`source_channel`、`ab_bucket` | frontend-build |
| cta_click | 用户点击首屏 CTA（立即复刻/看案例） | 按按钮 ID 区分 | `cta_id`、`user_id`(脱敏)、`template_id`(如有)、`timestamp` | frontend-build |
| license_apply | 提交模板授权申请 | 用户点击“一键复刻/申请授权”后调用 | `template_id`、`account_id`(脱敏)、`is_fast_track`、`persona_tag`、`policy_tag` | platform-integration |
| license_approved | 授权审核通过 | license 状态变更为 `approved` 时发送 | `license_id`、`template_id`、`account_id`(脱敏)、`approver_id`、`effective_at`、`expiry_type`、`max_runs` | platform-integration |
| license_rejected | 授权拒绝/撤销 | 状态变更为 `rejected` 或 `revoked` | `license_id`、`template_id`、`account_id`(脱敏)、`reason_code`、`policy_tag`、`action_required` | platform-integration、operations-compliance |
| task_start | 首屏来源任务入队 | 提示词提交后，校验通过时触发 | `task_id`、`template_id`、`account_id`(脱敏)、`estimated_credits`、`queue_type` | platform-integration |
| task_completed | 任务完成 | 状态 `succeeded`，写入算力实际消耗 | `task_id`、`template_id`、`credits_spent`、`duration_ms`、`output_count` | platform-integration |
| task_failed | 任务失败 | 状态 `failed`，记录失败类型 | `task_id`、`template_id`、`failure_code`、`sub_status`、`policy_tag`、`action_required` | platform-integration、operations-compliance |
| risk_alert | 风控提示或拦截 | operations-compliance 拦截/警告时 | `alert_id`、`task_id`、`risk_level`、`policy_tag`、`action_required`、`escalation_level` | operations-compliance |
| credits_updated | 积分补扣/回滚 | 拖尾补扣或人工回滚时 | `ledger_id`、`task_id`、`policy_tag`、`adjust_amount` | platform-integration |
| estimator_interact | 算力估算器交互 | 用户修改规格、查看估算 | `spec_id`、`expected_credits_range`、`persona_tag`、`precheck_balance` | frontend-build |
| heatmap_view | 查看热门模板榜 | 用户打开榜单或滑动查看更多 | `rank_type`、`template_id`、`position` | frontend-build |

## 数据字段定义
- `user_id` / `account_id`：使用平台内部脱敏 ID（hash），禁止直接写入手机号/微信号；映射表由 platform-integration 管理。
- `persona_tag`：由产品规划定义，初期取值 `{creator_studio, operator_contractor}`，用于区分 Persona A/B。
- `queue_type`：任务队列分类 `{standard, fast}`，用于后续算力加价策略分析。
- `failure_code`：预设枚举 `{authorization_denied, credit_insufficient, safety_block, infra_error}`，如遇新增需同步产品规划与 operations-compliance。
- `policy_tag`：风控策略标签（A1/A2/B1/B2/C1/C2/D1/D2/D3），由 operations-compliance 维护。
- `risk_level`：`high` / `medium` / `low`，与风控颜色映射一致。
- `action_required`：`resubmit_material` / `update_copy` / `remove_asset` / `appeal_only` / `escalate_review`，指引整改动作。
- `escalation_level`：`none` / `ops_review` / `compliance_committee`，用于标记 D3 监管升级场景。

## 埋点实现与交付
1. frontend-build 负责 FE SDK 与曝光/交互事件落地，预计在 Sprint #1 完成基础埋点。
2. platform-integration 在任务服务中记录授权与任务事件，输出至日志系统并通过 ETL 入库。
3. operations-compliance 在风控系统中同步 `risk_alert` 事件，确保包含处理动作与时间戳。
4. 所有埋点需在 9/20 前完成联调计划，评审确认后 9/21 输出技术实现方案链接。

## 数据治理
- 日志落地至数据湖 `landing_phase1` 命名空间，采用 UTC+8 日切。
- 敏感字段访问需通过权限审核，默认仅产品规划、数据分析、operations-compliance 可读。
- 指标看板将在后续由数据团队接手，暂定使用 Metabase 看板，初版需求由产品规划整理。

## 验证脚本
- `artifacts/2025-09-21/verify_phase1_events.sql`：校验 `policy_tag` / `action_required` / `escalation_level` 字段完整性及枚举范围。
