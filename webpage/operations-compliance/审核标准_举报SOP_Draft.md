# 审核标准 & 举报 SOP Draft

## 背景来源
- 产品规划：参考 `product-planning/phase1-foundation.md` 中对账号孵化场景的合规边界、授权流程、SLA 指标要求（24h 复核、3 天整改等）。
- 体验设计：对齐 `experience-design/experience-design-spec.md` 的审核后台、举报处理面板交互（复核提示、状态栏、告警颜色等）。
- 运营合规既有输出：`template-review-standards.md`、`task-exception-handling.md`、`reporting-sop.md`。

## 一、模板审核标准（草稿）
### 1. 审核目标
1. 资料齐全、真实可信（模板基础信息、示例图、工作流 JSON、主页截图、收益证明）。
2. 示例图风格与主页一致，确认来自平台内 ComfyUI 工作流且元数据完整可复现。
3. 收益证明、授权及合规边界符合业务规则，敏感领域附资质证明。

### 2. 审核流程
1. **资料查验**：人工核对必填字段、收益证明清晰度与真实性；缺项直接驳回。
2. **元数据与示例图核验**：检查 JSON 完整性与水印、分辨率；对比主页风格，异常交由风控。
3. **合规风险评估**：按违规分类手册打标，确认授权凭证，敏感行业加做资质复核。
4. **结论输出**：通过 / 驳回 / 升级复核；记录备注并触发通知/复核流。
5. **记录追踪**：审核结果回写接口、生成案例卡片、纳入周报指标（通过率、驳回率、复核率）。

### 3. 平台侧接口需求
- `POST /compliance/reviews/{templateId}`：提交审核决策，字段含 `status`（approved/rejected/escalated）、`reasonCodes[]`、`notes`、`operatorId`。
- `GET /compliance/reviews/{templateId}`：返回模板最近一次审核详情，含资料校验结果、元数据签名、相关任务 ID。
- `POST /compliance/reviews/{templateId}/attachments`：上传补充资料/复审证据，支持多文件，需回传存储 URL。
- `GET /templates/{templateId}/metadata` 扩展字段：补充工作流节点摘要、生成时间、校验 hash。
- 审核日志推送事件 `compliance.review.updated`（SSE/WebSocket），前端与后台实时刷新状态。

### 4. 前端（审核后台）需求
- 待审列表：支持按提交时间、风险等级排序；展示资料缺失提示与 SLA 倒计时。
- 详情页：
  - 模板资料卡 + 示例图画廊 + 元数据 JSON 查看器（折叠/复制）。
  - 审核 checklist（资料、示例图、合规项），可逐项勾选。
  - 驳回弹窗：多选原因 + 自定义补充说明。
  - 复核升级按钮：弹出确认框并选择复核人。
- 操作记录标签页：显示历史审核动作、附件、复核结论。
- 通知状态：在顶部提示“需复核”“资料待补”等，并与任务中心链接。

## 二、举报处理 SOP（草稿）
### 1. 流程概览
1. **受理**（即时确认）：渠道包括模板详情举报、客服、邮件；生成单号并 30 分钟内分类。
2. **材料收集**（1 小时内）：调取模板元数据、历史审核记录、相关对话；提醒举报人补证。
3. **合规复核**（4 小时内）：复审模板；高风险执行“先下架后通知”，冻结积分收益。
4. **通知与整改**（12 小时内）：告知创作者违规点 & 整改要求，默认 3 个工作日完成。
5. **复核与结案**（整改后 24 小时内）：恢复上线或升级处罚，并归档案例。

### 2. 平台侧接口需求
- `POST /compliance/reports`：创建举报单，字段含 `reporterId`、`templateId`、`evidence[]`、`channel`。
- `PATCH /compliance/reports/{reportId}`：更新状态（triaged/investigating/takedown/pending_fix/closed）与 SLA 时间戳。
- `POST /compliance/reports/{reportId}/actions`：执行动作（takedown/notify_creator/escalate/penalize），记录操作人。
- `POST /templates/{templateId}/status`：复用上下架接口，增加 `reasonCode`、`reportId` 关联。
- `POST /credits/refund`：支撑模板下架后的积分回滚，需支持部分/全额。
- `compliance.report.updated` 推送事件：同步举报状态、SLA 预警给前端与客服工具。

### 3. 前端（举报面板）需求
- 举报列表：按状态（待处理/复核中/已结案）分组，显示 SLA 倒计时与风险等级。
- 举报详情：
  - 展示举报人信息（脱敏）、证据附件、模板历史操作记录。
  - 提供“先下架后通知”快捷操作，自动跳转模板状态 API。
  - 整改要求输入框（富文本 + 模板话术库选择）。
  - 复核节点：记录复核人、时间、是否恢复。
- 时间线组件：展示受理、材料收集、复核、整改、结案各节点时间戳；逾期高亮。
- 关联任务入口：跳转任务中心查看受影响任务、退款进度。

## 三、跨组输入与依赖
| 事项 | 依赖小组 | 说明 |
| ---- | -------- | ---- |
| 审核字段与合规判定口径 | `product-planning` | 需确认必填字段及违规分类更新策略。
| 审核/举报面板高保真稿 | `experience-design` | 确认列表、详情、弹窗设计与提示语。
| 接口实现与事件推送 | `platform-integration` | 输出审核、举报、积分退款、模板上下架接口；确认错误码与鉴权方案。
| 前端交互与埋点 | `frontend-build` | 实现审核后台、举报面板、SSE 订阅；补齐埋点与状态联动。
| 用户通知与话术 | `content-ops` | 产出驳回/整改通知模板、FAQ、举报受理回执内容。

## 四、后续计划
1. 邀约 `frontend-build`、`experience-design`、`platform-integration` 参加审查会，锁定界面交互与接口字段（目标日期：T+2）。
2. 根据评审反馈固化 v1.0 文档，形成 SOP + 接口需求正式版，并在 `shared/CHANGELOG.md` 记录发布。
3. 支持前端原型验证与 API Mock，对接任务异常处理流程及积分退款路径。
4. 建立周报机制，跟踪审核/举报指标与问题清单。
