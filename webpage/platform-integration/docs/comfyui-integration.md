# ComfyUI 出图与一键训练调用流程

## 1. 出图流程
| 步骤 | 调用方 | 接口/操作 | 说明 |
| ---- | ------ | --------- | ---- |
| 1 | platform-integration | `POST /comfyui/v1/jobs` | 提交出图任务，传入 prompt、模板 ID、分辨率、加速模式等参数。|
| 2 | ComfyUI | 回传任务 ID、预计耗时、算力需求 | 用于估算积分消耗，与 `/credits/estimate` 数据对齐。|
| 3 | platform-integration | `POST /api/v1/credits/pre-deduct` | 根据 ComfyUI 提供的 estimated_cost 预扣积分。|
| 4 | ComfyUI | 异步通知或轮询 `GET /comfyui/v1/jobs/{id}` | 返回运行状态、输出 URL。|
| 5 | platform-integration | `POST /api/v1/credits/commit` / `/cancel` | 根据执行结果结算或回滚积分。|
| 6 | platform-integration | 推送任务事件 | 通过 WebSocket/SSE 推送 `stage`、`progress`、`next_eta`。|

### 1.1 输入参数
- 模板：`template_id`
- Prompt/Control 信息
- 输出规格：`resolution`（sd/hd/4k）
- 优先级：`priority`（standard/accelerated）
- 其他 extras：如 `hires_fix`, `upscaler`

### 1.2 输出字段
- `job_id`
- `estimated_time`（分钟）
- `gpu_slots`
- `result_urls`
- `error_details`

### 1.3 算力/耗时预估
- 参考 `docs/api-credit-authorization-push.md` 中 `/credits/estimate` 逻辑。
- 标准模式：ETA ≈ 8 分钟；Accelerated：ETA ≈ 3 分钟；根据 ComfyUI 反馈动态调整。

## 2. 一键训练流程
| 步骤 | 调用方 | 接口/操作 | 说明 |
| ---- | ------ | --------- | ---- |
| 1 | platform-integration | `POST /comfyui/v1/training` | 上传训练数据、超参配置。|
| 2 | ComfyUI | 返回 `training_id`、预计时长、GPU 耗时。|
| 3 | platform-integration | 调用 `/credits/estimate`（scene=`model.train`）获取积分消耗；若确认执行，调用 `/credits/pre-deduct`。|
| 4 | ComfyUI | 训练开始，周期性回传状态（`queued`、`running`、`checkpointing`、`completed`/`failed`）。|
| 5 | platform-integration | 根据状态更新任务表、推送事件，同时写入训练日志。|
| 6 | 平台 | 训练结束调用 `/credits/commit` 或 `/credits/cancel`（失败）。|

### 2.1 关键字段
- 训练配置：`epochs`, `batch_size`, `learning_rate`
- 数据快照：数据集 ID、文件清单
- 输出：模型路径、版本、性能指标

### 2.2 依赖
- GPU 调度：确认可用 GPU 类型/数量
- 数据存储：临时训练数据存放（对象存储/分布式文件）
- 算力预估：按 GPU 小时计算积分消耗

## 3. 算力消耗与积分映射
| 场景 | 基础积分 | 分辨率/模型权重 | 加速附加 | 备注 |
| ---- | -------- | ---------------- | -------- | ---- |
| image.generate | 18 | hd +6 / 4k +14 | accelerated +12 | extras 按配置叠加 |
| model.train | 120 | base 0 | accelerated +40 | 需按持续时间动态刷新 |

## 4. 数据字典
- `job_status`：`queued` / `processing` / `delivery`
- `training_stage`：`data_ingest` / `training` / `evaluating` / `publishing`
- `stage_progress`：0-100
- `next_eta`：ISO8601 字符串，预计进入下一阶段时间，允许 `null`

## 5. 后续动作
- 与 AI-Workflow 获取最新 API 规格和示例 payload。
- 与 GPU 调度确认任务排期窗口与加速队列 SLA。
- 将 `/comfyui` 系列接口纳入权限矩阵（scene -> scope 映射）。
