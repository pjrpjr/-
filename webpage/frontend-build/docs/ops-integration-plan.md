# 审核 / 举报 面板联调计划

日期：2025-09-17
负责人：frontend-build

## 待对齐接口
- 审核列表：`GET /compliance/review-queue`
- 审核详情：`GET /compliance/review/{submissionId}`
- 审核操作：`POST /compliance/review/{submissionId}/decision`、`/assign`
- 举报列表/详情/操作：`GET /compliance/reports`, `GET /compliance/reports/{id}`, `POST /compliance/reports/{id}/actions`

## 数据字段缺口
- 审核驳回原因枚举、SLA、附件上传方式。
- 举报处理动作（suspend/resume/refund/request-evidence/close）及状态流转。
- 积分回滚流水字段（transactionId、amount、operator、reason）。
- 操作权限限制：Reviewer vs Compliance Ops vs Admin。

## 前端待办
1. 替换 mock 数据源，改为上述接口：更新 `api.fetchReviewQueue` 等实现。
2. 完善详情面板：带入素材预览、授权文件、AI 检测结果、历史日志。
3. 操作按钮：根据接口状态禁用/启用，提交操作后刷新列表。
4. 错误处理：接口失败/权限拒绝时展示对应提示。
5. 日志：操作成功/失败写入埋点。

## 依赖
- operations-compliance 提供 `compliance-interface-fields-2025-09-18.md` 枚举（已收到 TODO 提醒）。
- platform-integration 提供接口路径、鉴权参数、错误码。
- experience-design 提供操作面板高保真及交互细节。

## 里程碑
- 9/18：收集字段枚举与接口草案。
- 9/19：完成前端接口封装+UI 显示字段。
- 9/20：联调操作（通过/驳回/暂停、举报 suspend/refund 等）。
- 9/21：在 shared/CHANGELOG.md 登记“审核/举报联调进度”。

## 风险
- 枚举变动需要 UI 同步更新。
- 操作接口可能需要幂等与重试，待后端给方案。
- 素材预览涉及敏感信息，需确认访问授权。

