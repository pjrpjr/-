# Design Tokens Usage Map

> 依据 `shared/design-tokens.md` 校验，记录主要组件/页面所引用的令牌，便于设计或前端调整时快速定位。

| 组件/模块 | 相关文件 | 使用的令牌 | 说明 |
| --- | --- | --- | --- |
| 页面背景 | `app/globals.css` (`:root`, `body`) | `--color-bg`, `--color-surface` | 统一 Landing 与后台页面的浅灰背景、卡片底色。 |
| 文本颜色 | `app/globals.css`, 各组件 | `--color-fg`, `--color-muted` | 标题/正文/说明文字默认配色。 |
| 强调色（Viewer） | `app/globals.css`, `TopNavigation`, `HeroSection` | `--color-accent`, `--color-accent-soft` | 默认角色 CTA、Tag 底纹与按钮背景。 |
| 强调色（Creator） | `app/globals.css` `[data-role="creator"]` | `--color-accent`, `--color-accent-soft`（creator override） | 创作者视角切换主题色；按钮阴影同步变更。 |
| 状态色 | `app/globals.css`, `TaskCenterPanel` | `--color-positive`, `--color-warning` | 成功/警告提示、进度条配色。 |
| 圆角 | `app/globals.css` | `--radius-lg`, `--radius-md`, `--radius-sm` | 卡片、按钮、Tag 圆角；审核/举报面板复用。 |
| 阴影 | `app/globals.css` | `--shadow-soft` | Landing 卡片、后台区块默认阴影。 |
| 任务中心进度条 | `TaskCenterPanel.tsx` + CSS | `--color-accent` | 进度条填充及状态点颜色。 |
| 审核面板 & 举报面板 | `app/globals.css` (operations section) | `--color-surface`, `--color-border`, `--shadow-soft`, `--radius-lg` | 区块容器与表格样式沿用令牌，保证视觉统一。 |

## 差异/补充
- 暂未使用的令牌：Designer 计划提供的品牌渐变背景将落在 `public/gradients/hero-default.png`，一旦交付需在 `HeroSection` 中引用（背景图方案待定）。
- 若后续新增暗色主题或高亮警示色，请先更新 `shared/design-tokens.md`，并在此记录使用位置。

版本：v0.1（2025-09-17）。
