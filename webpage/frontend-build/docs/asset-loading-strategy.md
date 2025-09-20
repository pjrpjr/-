# Asset Loading Strategy

依据 `shared/assets-manifest.md` 列表，前端静态资源加载策略如下：

## 1. Logo / 品牌资源
- `public/logo.svg`：在 `TopNavigation` 中使用 `<img>`（或 `<Image>`）直接引用。交付前使用文字占位，待设计提供最终版后替换。
- `public/favicon.ico`：放置于 `public/` 根目录，Next.js 自动引用；提交前确认尺寸 32×32。
- 渐变背景 `public/gradients/hero-default.png`：载入 `HeroSection` 的背景图，建议通过 `style` 背景或 `<Image priority>`，确保首屏加载。默认使用我们创建的 README 占位等待设计交付。

## 2. 模板案例图片
- 目录：`public/images/cases/`
- 命名：`case-{scene}-{yyyymmdd}.jpg`
- 加载：`CaseStudies` 组件中使用 `<Image loading="lazy">`，为首屏首张可设置 `priority`。所有图片需提供宽高 metadata 以避免 CLS。

## 3. 插画与图标
- 快速上手插画：`public/illustrations/quickstart-step{1-3}.svg`
  - 使用 `<Image loading="lazy">` 或直接嵌入 inline SVG；默认占位为 README。
- 任务/合规状态图标：`public/icons/task-status-{state}.svg`、`public/icons/compliance/...`
  - 在 `TaskCenterPanel`、审核/举报面板中通过 `<Image width={48} height={48}>` 引用；提供 alt 文案（成功、警告等）。

## 4. 缓存与懒加载策略
- Next.js 静态资源默认使用长期缓存，更新素材时需改文件名或添加 hash 以触发刷新。
- 图像资源优先采用 Next.js `<Image>` 以获得自动懒加载与优化；SVG 图标可 inline 以便着色。
- 对于可能较大的 Demo 视频或 Lottie 文件（manifest 中的待定项），建议按需加载：
  - 使用动态 `import()` 或 IntersectionObserver 控制播放。
  - 提供静态 Poster 或 Skeleton，防止首屏阻塞。

## 5. 合规要求
- 所有素材需通过 operations-compliance 审核后上传；在提交 PR 时附带来源/许可证说明。
- 若涉及多语言，content-ops 需提供翻译文件，路径与主图一致（如 `public/images/cases/en/...`）。

版本：v0.1（2025-09-17）。
