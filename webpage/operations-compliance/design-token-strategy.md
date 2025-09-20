# 运营合规界面设计令牌与素材调用策略

## 1. 设计令牌对照
- 色彩：沿用 `shared/design-tokens.md` 现有令牌，不新增自定义值。
  - 审核通过状态使用 `--color-positive`。
  - 审核挂起/复核提醒使用 `--color-warning`，配合 `--color-accent-soft` 作为背景。
  - 异常/违规提示使用现有 `--color-accent` 辅助强调，文案保持主色 `--color-fg`。
  - Creator 视图下保持 `data-role="creator"`，由前端自动切换 accent。
- 字体：所有审核/举报面板标题、表格头使用 H3 (20/28)，正文说明 16/24，符合令牌定义。
- 间距与圆角：卡片组件使用 `--radius-md`，列表行间距遵循 16px。
- 阴影：审核弹窗使用 `--shadow-soft`，保持与全站一致。

## 2. 素材与图标交付
- 图标/插画列表见 `assets-delivery-plan.md`，并已在 `shared/assets-manifest.md` 的“合规审核与风控素材”区块登记。
- 统一 SVG 规范：描边 1.5px，转角圆角 2px，颜色遵循 `--color-muted` 与状态色令牌。
- PNG 插画（风控 KPI 背景）保持 1200×400，采用线性渐变 #2563EB → #9333EA（使用现有 accent 色阶）。
- 素材上传后统一命名：`{category}-{name}-v{n}.svg/png`。

## 3. 调用策略
- 前端调用图标时，通过 `import` 或静态路径 `public/icons/compliance/*`，结合 `aria-label` 提升可访问性。
- 风控看板 KPI 底图按需懒加载，避免首屏性能问题；建议通过 CSS `background-image` 引入。
- 所有状态色在深色背景上需满足对比度 4.5:1；如需反白文本，使用 `--color-surface`。

## 4. 后续动作
1. 9/17 与体验设计确认 SVG 线条与阴影规范。
2. 9/18 上传并在 `shared/CHANGELOG.md` 更新状态为“已完成”。
3. 如需新增令牌，提前提审并更新 `shared/design-tokens.md`。
