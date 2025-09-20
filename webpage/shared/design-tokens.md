# 设计令牌总览

> 来源：`frontend-build/app/globals.css`，后续高保真稿的色彩/排版统一在此维护。修改令牌需同步前端与体验设计。

## 色彩
| Token | 值 | 说明 |
| --- | --- | --- |
| `--color-bg` | `#fafafb` | 页面背景，默认浅灰底。 |
| `--color-surface` | `#ffffff` | 卡片与模态的主底色。 |
| `--color-border` | `rgba(15, 23, 42, 0.08)` | 卡片描边及分隔线。 |
| `--color-fg` | `#0f172a` | 主文本色。 |
| `--color-muted` | `#475569` | 次要文本、说明文字。 |
| `--color-accent` | `#2563eb` | 默认 CTA/链接主色。 |
| `--color-accent-soft` | `rgba(37, 99, 235, 0.08)` | 默认强调底纹、Tag 背景。 |
| `--color-positive` | `#047857` | 成功/完成状态。 |
| `--color-warning` | `#d97706` | 风险警告/审核提醒。 |
| Creator 视图 `--color-accent` | `#9333ea` | 创作者角色主色。 |
| Creator 视图 `--color-accent-soft` | `rgba(147, 51, 234, 0.12)` | 创作者角色强调底纹。 |

## 字体与字号
| 名称 | 定义 |
| --- | --- |
| 基础字体族 | `"Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif` |
| 标题字号 | H1 32/44, H2 24/32, H3 20/28, 正文 16/24（mobile 端标题 -2px） |
| 字重 | 标题 600，正文 400 |

## 间距与圆角
| Token | 值 | 用途 |
| --- | --- | --- |
| `--radius-lg` | `24px` | 主卡片及模态圆角 |
| `--radius-md` | `16px` | 次级卡片、按钮等 |
| `--radius-sm` | `10px` | 标签、输入框 |
| 区块间距 | Desktop 64px / Tablet 48px / Mobile 32px | 参照体验设计规范 §5 |
| 组件垂直间距 | 16px | 列表项、表单行默认间距 |

## 阴影
| Token | 值 | 场景 |
| --- | --- | --- |
| `--shadow-soft` | `0 20px 60px rgba(15, 23, 42, 0.08)` | 卡片与弹窗基础阴影 |
| CTA 按钮阴影 | `0 12px 25px rgba(37, 99, 235, 0.25)` | 主操作悬浮效果 |

## 交互状态
- Button Hover：上移 1px、保持原色，shadow 强度不变。
- 链接 Hover：保持原色，添加下划线。
- 角色切换：通过 `data-role` 属性切换 accent 令牌（详见 `frontend-build/src/components/PersonaPanel.tsx` 的用法）。

## 维护流程
1. 调整令牌前请在 `shared/CHANGELOG.md` 登记计划并通知设计/前端。
2. 体验设计更新高保真稿后，同步检查样式是否符合令牌范围。
3. 前端合并样式更改时，需同时更新 `globals.css` 与本文档。

## 版本记录
| 日期 | 更新内容 |
| ---- | -------- |
| 2025-09-18 | 记录 Content-Ops/Design 占位素材交付，保持 token 不变，提醒最终稿需要复核。 |
