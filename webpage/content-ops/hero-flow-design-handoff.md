# 体验设计交付文案包（首屏 + 流程，高保真同步）

## 1. 首屏 Hero 区
- **文案**：延续 `landing-hero.md` 的标题、副标题、Tag 与 CTA 文字；组件采用 `Card/StepHighlight` 与 `TagGroup/Inline`。
- **布局（Desktop 1440）**：
  - 宽 1280px 容器，左右边距 80px；背景引用 `public/gradients/hero-default.png`。
  - 左列为标题 + StepHighlight 3 列（每列 280px，间距 24px）。
  - 右列案例卡 360×420px，使用 `images/cases/case-*.jpg` 占位图。
- **布局（Mobile 390）**：
  - 主副标题居中，StepHighlight 改为横向滑动卡片（宽 280px，间距 16px）。
  - Primary CTA 固定底部，宽 358px，文案：“立即体验 30 分钟免费算力”。

## 2. 模板提交 → 出图 Stepper
| Step | 标题 | 说明文案 | 组件/样式 |
| ---- | ---- | -------- | -------- |
| 1 | 上传灵感素材 | 拖拽上传照片 / LoRA，系统自动生成成本预估。 | Step chip 背景 `var(--color-accent-soft)`，文本 `var(--color-accent)`；卡片使用 Card 容器。 |
| 2 | 填写模板说明 | 补充模板用途、适配场景、授权范围，自动引用平台红线提示。 | 在说明区域添加链接“参考案例：3 秒换装脚本如何写？” |
| 3 | 完成授权校验 | 一键套用《肖像授权》《版权承诺》，可添加联合创作者；平台不抽成。 | 成功提示使用 `var(--color-positive)` Toast。 |
| 4 | 支付算力并提交审核 | 选择算力套餐或启用“低余额自动提醒”，展示 24h 审核 SLA。 | 审核 SLA 提示条背景 `var(--color-warning)` 10% 透明度。 |
| 完成页 | 审核中提醒 | `已进入合规审核（预计 24 小时内完成），可在任务中心查看进度` | 按钮：`去任务中心`、`先浏览爆款模板`，使用 Button Primary/Secondary。 |

## 3. 充值/补扣/加速文案
- **补扣弹窗**：
  - 标题：`检测到额度不足，是否启用补扣？`
  - 正文：`当前任务预计消耗 {est_points} 积分，距余额仅差 {diff_points} 积分。启用补扣后将自动从绑定支付方式补齐。`
  - CTA：`立即补扣`（Primary），`稍后提醒`（Secondary）。
- **排队加速横幅**：`排队超过 3 分钟？使用 20 积分立刻进入优先通道。`｜次选项：`使用 50 积分连续加速 10 次任务`。
- **24h 复核提示**：`举报复核将在 24 小时内完成，逾期系统会自动升级到专员处理。`

## 4. 通知与整改（摘要）
- 对应字段、流程详见 `notification-remediation-template-v1.md`；警示语气配合 `var(--color-warning)` 标识。
- 补扣与违规预警在 UI 中均使用同样的 SLA 提醒文案，避免重复撰写。

## 5. 素材调用
- Hero 背景：`public/gradients/hero-default.png`（临时占位）。
- 案例图：`public/images/cases/case-*.jpg`（占位图待设计替换）。
- Quickstart 插画：`public/illustrations/quickstart-step{1-3}.svg`（临时版）。

## 6. 协同备注
- 若体验设计替换最终素材，请在 `shared/assets-manifest.md` 与 `shared/CHANGELOG.md` 更新状态，并同步 content-ops。
- 文案 placeholder 保持英文小写，以便多语言替换。
## 7. 资源导出更新（2025-09-18）
- 已导出 Hero 渐变背景、Quickstart Step 插画、任务状态图标、Persona Badge 至 `frontend-build/public`。
- 对应 manifest 行：`shared/assets-manifest.md` 中 Hero / Quickstart / Task Status / Persona 已标记“已交付（占位版）”。
- 占位素材命名遵循 `case-{scene}-{date}.jpg`、`quickstart-step{n}.svg`、`task-status-{state}.svg`、`persona-{role}.svg`。
