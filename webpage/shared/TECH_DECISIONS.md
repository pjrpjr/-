# 技术选型与实施路线

## 栈选择
- 后端框架：FastAPI（Python）。理由：便于直接调用 ComfyUI API、一键训练脚本，生态成熟且文档友好，AI 辅助生成代码的示例丰富。
- 数据库：PostgreSQL（主库）＋ Redis（缓存/任务状态）。理由：Postgres 结构化能力强，支持事务保证积分扣费准确；Redis 适合处理实时状态、速率限制与消息推送。
- 消息推送：WebSocket（首选）或 Server-Sent Events；Redis Pub/Sub 或 Celery + Redis 作为任务/推送调度。

## 必要准备
1. 云环境：准备 Postgres 数据库实例、Redis 实例、FastAPI 部署环境（可用 Docker/Kubernetes 或云厂商托管服务）。
2. 安全策略：规划 API 鉴权（JWT/Session）、IP 白名单（对接 ComfyUI/训练脚本）、敏感配置存放方式（环境变量/密钥管理）。
3. 监控与日志：接入基础监控（进程、队列、任务耗时、失败率、积分扣费异常），配置日志聚合。

## 推进步骤
1. `platform-integration`
   - 建仓：初始化 FastAPI 项目结构，接入数据库迁移工具（Alembic）。
   - 数据建模：定义用户、积分账户、模板、授权、任务、支付订单等模型。
   - 接口实现：分阶段完成授权校验、积分扣费、ComfyUI 出图、训练任务、任务实时推送。
   - 创作者后台 API：完成授权名单导入、授权配置、任务统计接口。
2. `product-planning`
   - 输出详细的积分/授权/任务流程图和状态机，锁定业务边界与错误处理。
3. `experience-design`
   - 落地任务中心、授权管理、充值与实时提示的界面稿。
4. `frontend-build`
   - 验证 WebSocket 推送方案；搭建任务中心页面与角色切换逻辑。
5. `content-ops`
   - 拟定积分扣费、授权成功/失败、任务通知、创作者升级文案与说明。
6. `shared`
   - 建立技术决策档案（本文件）、接口契约目录、角色权限矩阵；持续同步各组进度。

## 决策确认
- 请在 `shared/CHANGELOG.md` 记录“技术选型确认（FastAPI + Postgres + Redis）”计划与完成状态，便于其他 Codex 对齐。
- 若后续想引入其它服务（如 Celery/消息队列），可在本文件追加。
