# 审核与举报后台前端对接需求

本文档用于与 `operations-compliance`、`platform-integration` 对齐审核后台与举报面板的数据字段、接口契约及交互期望。

## 1. 审核面板数据模型

| 区块 | 字段 | 类型 | 说明 | 来源 |
| ---- | ---- | ---- | ---- | ---- |
| 队列行 | submissionId | string | 模板提交流水号，用于唯一定位 | platform-integration |
| 队列行 | templateId | string | 模板 ID | platform-integration |
| 队列行 | templateName | string | 模板名称 | platform-integration |
| 队列行 | creatorId | string | 创作者 ID | platform-integration |
| 队列行 | creatorHandle | string | 创作者展示名 | platform-integration |
| 队列行 | submittedAt | string (ISO8601) | 提交时间 | platform-integration |
| 队列行 | status | enum(pending/recheck/blocked/approved/paused) | 当前审核状态 | operations-compliance |
| 队列行 | priority | enum(high/medium/low) | 优先级，与 SLA 相关 | operations-compliance |
| 队列行 | riskScore | number(0-1) | AI 初筛风险评分 | platform-integration |
| 详情 | assets[] | array | 素材列表（缩略图、原图、下载地址） | content-ops · platform-integration |
| 详情 | licenses[] | array | 授权文件、授权用户/企业列表 | operations-compliance |
| 详情 | aiFindings | array | AI 检测结果（标签、置信度、截图） | platform-integration |
| 详情 | history[] | array | 历史操作日志（操作人、时间、动作、备注） | operations-compliance |
| 详情 | violations[] | array | 违规记录与整改状态 | operations-compliance |
| 操作 | actions | array | 可执行操作（approve/reject/hold/escalate），需附 SLA & 提示语 | operations-compliance |

### 审核操作接口建议

- `POST /api/v1/review/{submissionId}/decision`
  - 请求体：`{ action: 'approve' | 'reject' | 'hold', reasonCode?: string, note?: string, attachments?: string[] }`
  - 响应：`{ status: string, updatedAt: string, nextStep?: string }`
- `POST /api/v1/review/{submissionId}/assign`
  - 请求体：`{ assigneeId: string, dueAt?: string }`
  - 响应：`{ status: 'ok' }`
- `GET /api/v1/review/{submissionId}/history`
  - 返回：`[{ operator, action, timestamp, note, attachments[] }]`

> **需要确认**：驳回原因是否固定模板、是否允许多选；通过时是否支持批量处理；被暂缓后如何提醒责任人。

## 2. 举报面板数据模型

| 区块 | 字段 | 类型 | 说明 | 来源 |
| ---- | ---- | ---- | ---- | ---- |
| 工单列表 | reportId | string | 举报工单 ID | operations-compliance |
| 工单列表 | templateId | string | 关联模板 ID | platform-integration |
| 工单列表 | templateName | string | 模板名称 | platform-integration |
| 工单列表 | reporterId | string | 举报人 ID/名称 | platform-integration |
| 工单列表 | channel | enum(in-app/email/manual) | 举报渠道 | operations-compliance |
| 工单列表 | reportedAt | string | 举报时间 | operations-compliance |
| 工单列表 | status | enum(open/investigating/resolved/suspended) | 工单状态 | operations-compliance |
| 工单列表 | severity | enum(low/medium/high) | 事件严重程度 | operations-compliance |
| 详情 | description | string | 举报描述 | platform-integration |
| 详情 | evidence[] | array | 证据附件（图片/文件/链接） | operations-compliance |
| 详情 | relatedTasks[] | array | 关联任务（taskId、类型、积分消耗、状态） | platform-integration |
| 详情 | creditImpact | object | 冻结/退款记录 | platform-integration |
| 详情 | handlers[] | array | 处理人、处理动作、时间、备注 | operations-compliance |
| 操作 | actions | array | available actions: suspend-template / refund / request-evidence / escalate | operations-compliance |

### 举报流程接口建议

- `GET /api/v1/reports?status=&severity=&page=`
- `GET /api/v1/reports/{reportId}`
- `POST /api/v1/reports/{reportId}/actions`
  - 请求体：`{ action: 'suspend' | 'resume' | 'refund' | 'close', reasonCode, note, notifyCreator?: boolean }`
- `POST /api/v1/reports/{reportId}/assign`
- `POST /api/v1/reports/{reportId}/timeline`
  - 用于记录沟通、证据补充等日志

> **需要确认**：举报成立是否自动下架模板、积分回滚是自动还是人工触发、是否需要通知举报人处理结果。

## 3. 实时推送与埋点

- 审核状态变化：`compliance.review.updated`
  - 载荷：`{ submissionId, status, operatorId, note, timestamp }`
- 举报状态变化：`compliance.report.updated`
  - 载荷：`{ reportId, status, operatorId, timestamp }`
- 模板下架通知：`template.suspended`
  - 载荷：`{ templateId, reasonCode, operatorId, effectiveAt }`
- 积分回滚完成：`credits.refunded`
  - 载荷：`{ transactionId, amount, userId, reason, operatorId }`

埋点建议：
- 审核操作按钮点击（含选择原因、是否确认弹窗）。
- 举报处理动作、附件查看、下架确认。
- 异常超时提醒弹窗展示与关闭事件。

## 4. 下一步行动

1. `operations-compliance` 提供上述字段与接口的可用状态、鉴权方式、错误码表，并确认 SLA。预计截止：D1 日终。
2. `platform-integration` 输出实际 API 路径与示例响应，确认是否可复用任务中心接口。
3. `frontend-build` 在接口冻结后实现数据绑定与交互逻辑，预估开发 2-3 天。
4. 联调前需要 content-ops 提供 3 份模拟数据（正常/违规/举报成立）。

> 文档版本：v0.1（2025-09-17），更新请同步 `shared/CHANGELOG.md`。

## 5. Mock 接入现状
- 前端已基于 `src/lib/api/mockBackend.ts` 提供审核队列、举报工单的占位数据与事件流，便于在无真实接口时联调 UI。
- 缺口待确认：
  - 审核动作需返回标准化 `reasonCode`、可选的附件字段及 SLA 息屏提醒；
  - 举报处理需提供积分回滚明细（流水号、操作者）、模板上下架后的传播范围，以及证据附件的文件类型；
  - 任务事件实际载荷字段命名（`label`/`context`/`impact`）需由 platform-integration 最终确认，便于埋点与错误提示对齐。
- API 切换：通过 `src/lib/api/index.ts` 的 `setApiAdapter` 可在接入真实后端时替换实现，Mock 层可继续在 Storybook/自动化测试场景复用。
