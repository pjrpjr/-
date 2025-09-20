# 网页协作工作区

本目录用于基于 `../网页需求.md` 搭建女娲造人 AI 平台的站点。

## 小组分工
- `business-experience/`：统筹 `product-planning`、`experience-design`、`content-ops`，负责 PRD、体验策略、视觉与文案资产。
- `platform-delivery/`：统筹 `frontend-build`、`operations-compliance`、`platform-integration`，负责前端实现、合规流程与后端接口落地。
- `shared/`：维护设计令牌、共享素材、接口契约、角色权限矩阵，并统筹跨组事项。

### 业务体验线（business-experience）
- `product-planning`：拆解需求，明确页面版块、关键旅程、指标与风险。
- `experience-design`：设计旅程界面、交互、响应式布局及组件状态。
- `content-ops`：产出文案、案例、通知模板、本地化与内容安全素材。

### 平台交付线（platform-delivery）
- `frontend-build`：实现前端页面、组件交互、实时订阅与可访问性。
- `operations-compliance`：制定审核/举报流程、模板上线标准、任务异常处理与指标采集。
- `platform-integration`：实现后台服务、积分账本、授权校验、ComfyUI 接口、实时推送。

## 协作约定
1. 领取子目录后，优先完成该目录内的 `TODO.md` 并记录决策；组级别任务请同步到 `business-experience/` 或 `platform-delivery/` 的 `TODO.md`。
2. 如需改动跨目录共享文件（组件、全局资源、接口契约等），请先在 `shared/CHANGELOG.md` 登记计划，完成后补充结果。
3. 优先新增内容；若需其他目录跟进，请在对方 `TODO.md` 留言或通过 shared 目录的 CHANGELOG 留痕，而非直接覆盖。
4. 建议小步提交，并在提交信息中标注目录名称，便于其他 Codex 跟踪。
