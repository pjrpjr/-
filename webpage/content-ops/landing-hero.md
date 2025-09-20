# 首屏 Hero 文案（高保真对齐版）

## 文案与结构
- **主标题（H1 32/44，600）**：3 步开启 AI 模板变现
- **副标题（Body 18/30）**：算力按使用付费，模板收益与私域成交全归创作者，合规审核全程护航。
- **核心要点卡片（Card/StepHighlight，宽 280px）**：
  1. 上传灵感 — 支持上传自有素材或选用平台爆款模板。
  2. 提交授权 — 一键补齐肖像/版权授权，平台不参与模板抽成。
  3. 上线出图 — 充值算力后 2 分钟内批量出图，实时同步收益。
  卡片底色 `var(--color-surface)`，阴影 `var(--shadow-soft)`，标题色 `var(--color-accent)`。
- **信任背书条（TagGroup/Inline，高 44px）**：`平台红线清单`｜`授权模板下载`｜`近 30 天成功复刻 268,520 张`

## CTA 与交互
- **Primary CTA（192×48，radius-md）**：`立即上传灵感素材`
  - Hover：向上浮 1px，保持 `var(--color-accent)` 背景。
  - 副文案：绑定手机号即可开通 30 分钟体验。
- **Secondary CTA（Outline Button）**：`查看盈利案例`
  - 边框与文本使用 `var(--color-accent)`，Hover 仅加下划线。

## 右侧案例卡（宽 360，高 420）
- 上半部分展示 16:9 遮罩卡片（引用 `public/images/cases/case-*.jpg`）。
- 指标分三行：
  - 近 7 天收藏 31,000+
  - 客单价 ¥168｜ROI ≈ 60x
  - 授权范围：站内使用｜违规记录：0
- 底部动作：`查看完整复盘 →`，使用 `icons/chevron-right.svg`。

## 布局说明（Desktop 1440）
- 栏宽 1280px，左右内边距 80px；Hero 背景使用 `public/gradients/hero-default.png`。
- 左右两列比例约 60/40；内部垂直间距 16px。
- 三步要点卡片间距 24px，卡片标题使用 `var(--color-fg)`。

## 移动端适配（390 宽）
- 主副标题居中，左右边距 24px。
- 三步要点改为横向滑动卡片，每张宽 280px、间距 16px，仍使用 StepHighlight 样式。
- Primary CTA 固定底部，宽 358px，文案：`立即体验 30 分钟免费算力`。

## 视觉参考
- 颜色与圆角依照 `shared/design-tokens.md`。
- 素材调用 `public/gradients/hero-default.png` 及 `public/images/cases/case-*.jpg`（当前为占位图）。
- 更多排版详见 `experience-design/high-fidelity-hand-off.md`。
