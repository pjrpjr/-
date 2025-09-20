# Platform Integration Mock Service

FastAPI 骨架，用于输出积分、授权、任务、审核回写等接口的 Swagger Mock，供 frontend-build 与其他协作团队联调。

## 快速开始
1. 建议创建虚拟环境并安装依赖：
   `powershell
   python -m venv .venv
   .venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   `
2. 启动服务：
   `powershell
   uvicorn app.main:app --reload --port 8080
   `
3. Swagger 文档：访问 http://localhost:8080/docs 或 http://localhost:8080/redoc。
4. OpenAPI 契约：静态文件位于 docs/openapi-platform-mock.json，如需更新可运行 python scripts/export_openapi.py（需已安装依赖）。

## 模块说明
- app/api/credits.py：积分预扣、结算、回滚及余额查询。
- app/api/authorizations.py：模板授权导入、吊销、列表及使用日志。
- app/api/tasks.py：任务详情、事件流与推送通道 Mock。
- app/api/reviews.py：operations-compliance 审核回写接口。
- scripts/export_openapi.py：导出当前路由的 OpenAPI 契约。
- docs/api-error-codes.md：鉴权与业务错误码对照表。
- docs/ui-assets-plan.md：设计令牌与素材调用清单。
- docs/role-access-mapping.md：角色能力与 API 映射。
- docs/delivery-schedule.md：交付节点追踪（素材、权限、埋点、复盘）。
- docs/cross-team-checklist.md：跨组执行看板，涵盖产品/体验/内容/合规/前端等节点。

## 联调节奏
- D1 18:00 前提供可访问的 Mock 服务地址（默认端口 8080，可调整后同步前端）。
- D2 上午：与 frontend-build 联调任务详情、事件推送展示；下午回归积分扣费视图逻辑。
- Content-ops 与 operations-compliance 请在 D1 内确认字段映射与审核回写字段是否满足要求。
