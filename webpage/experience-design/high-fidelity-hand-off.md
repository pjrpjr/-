# High Fidelity Handoff – Experience Design

> 版本：2025-09-18 · 针对 9/18 素材交付节点出具。所有尺寸以像素为单位，基于 1440×900 桌面和 390×844 移动基准。

## 1. 首屏 Hero（Desktop 1440）
- 背景：`public/gradients/hero-default.png`，径向渐变从 `#0b1f45`（左上）过渡到 `#111827`（右下），叠加 8% 噪点纹理。
- 布局：12 列栅格，左右边距 80px，内容宽 1280px。
- 主标题：H1 32/44，颜色 `var(--color-fg)`，字重 600；与副标题间距 16px。
- 副标题：Body 18/30，颜色 `var(--color-muted)`。
- 三步要点：使用 `Card/StepHighlight` 组件，列宽 280px，间距 24px，背景 `var(--color-surface)` + 阴影 `var(--shadow-soft)`。
- CTA Primary：填充 `var(--color-accent)`，文字白色，尺寸 192×48，圆角 `var(--radius-md)`；Hover 上移 1px。
- CTA Secondary：描边按钮，描边与文字均使用 `var(--color-accent)`。
- 信任背书条：`TagGroup/Inline` 组件，高度 44px，背景 `var(--color-surface)`，垂直间距 24px。
- 右侧案例卡：宽 360px，高 420px，顶部图块 16:9（210px），底部信息区分三行统计；底部链接使用箭头图标 `icons/chevron-right.svg`。

### Hero（Mobile 390）
- 背景改为纵向渐变，同色值，上边距 24px。
- 标题居中，CTA Primary 固定底部 16px，宽度 358px。
- 三步要点改为水平滑动卡片（每张宽 280px，间距 16px）。

## 2. 快速流程 Stepper
- 组件：Desktop 使用 `Stepper/Vertical`（左栏 320px），Mobile 使用 `Stepper/Horizontal`。
- Step chip 背景 `var(--color-accent-soft)`，文字 `var(--color-accent)`。
- Step 容器高度 160px，内含 96px 插画；行间距 12px。
- 链接样式：`var(--color-accent)` 下划线。

## 3. 模板展示 & DEMO 卡
- Desktop 4 列，卡片宽 288px，高 360px；Hover 放大 1.02。
- 卡片元素：封面图 16:9，标题 H4 18/26，积分 Badge 背景 `var(--color-accent-soft)`。
- 状态栏：进行中（`var(--color-positive)`）、排队（`var(--color-accent)`）、异常（`#dc2626`）。
- CTA “一键复刻”：默认填充；排队时变描边 + 倒计时。

## 4. 补扣弹窗（Desktop / Mobile）
- 尺寸 480×420，圆角 24px。
- Header 渐变 `linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)`。
- 内容区：余额提示、充值档位（ButtonGroup/Segmented）、说明列表。
- 档位按钮默认 `var(--color-surface)`，选中时填充 `var(--color-accent)`。
- Footer：主 CTA + 次按钮（描边）。

## 5. 任务中心
- 布局：左侧导航 280px（浅色卡片），右侧列表。
- 列表项高度 120px，含缩略图、信息列、操作列。
- 加速横幅：背景 `linear-gradient(135deg, #1e40af, #6366f1)`，字体白色，按钮描边白色。
- Toast：右上角，宽 320px；成功绿色、警告琥珀、错误红色。

## 6. 举报复核界面
- SLA 倒计时使用 `var(--color-warning)` 背景；逾期背景 `#dc2626`。
- 审核 Checklist 采用 `inputs/checkbox` 组件，左侧 24px 图标。
- 日志面板宽 320px，背景 `#f8fafc`，滚动高度 360px。

## 7. 角色主题
- Visitor：主题色 `var(--color-accent)`，隐藏积分模块。
- Viewer：同 Visitor，但显示余额卡片。
- Creator：主题切换至 `#9333ea`，按钮及链接同步调整。
- Reviewer/Compliance：工作台深灰 `#0f172a` + 卡片 `#ffffff`，警示色 `var(--color-warning)`。

## 8. 素材交付状态（2025-09-18 已交付）
| 资产 | 规格 | 文件 | 状态 | 负责人 |
| --- | --- | --- | --- | --- |
| Hero 渐变背景 | 1920×1080 PNG | `public/gradients/hero-default.png` | 已交付 v1.0 | experience-design |
| Quickstart 插画 | SVG ×3 | `public/illustrations/quickstart-step{1-3}.svg` | 已交付 v1.0 | experience-design |
| 任务状态图标 | SVG Success/Warning/Error | `public/icons/task-status-{success,warning,error}.svg` | 已交付 v1.0 | experience-design × ops-compliance |
| Persona Badge | SVG (Visitor/Viewer/Creator) | `public/icons/persona-{visitor,viewer,creator}.svg` | 已交付 v1.0 | experience-design |

- 文件位于 `frontend-build/public/...`，命名符合 manifest 规范。
- 导出记录已同步 `shared/assets-manifest.md` 与 `shared/CHANGELOG.md`。

## 9. 资源快照
| 项目 | 文件 | 说明 |
| --- | --- | --- |
| Hero 背景 | `frontend-build/public/gradients/hero-default.png` | 1920×1080 径向渐变 |
| Quickstart 插画 | `frontend-build/public/illustrations/quickstart-step1.svg`～`quickstart-step3.svg` | 上传/说明/审核流程插画 |
| 任务状态图标 | `frontend-build/public/icons/task-status-success.svg` 等 | 状态图标（成功/警告/失败） |
| Persona Badge | `frontend-build/public/icons/persona-visitor.svg` 等 | 角色识别徽章 |

## 10. 文件与交付
- Figma：《Web Landing v1.2》《Task Center v1.1》《Compliance Console v1.0》（内部协作板）。
- 导出资源统一存入 `frontend-build/public`。
- 本文档位于 `experience-design/high-fidelity-hand-off.md`，并在 `shared/CHANGELOG.md` 记录。
