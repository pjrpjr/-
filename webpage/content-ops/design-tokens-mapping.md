# Content-Ops 设计令牌协同（参考）

> 对照 `shared/design-tokens.md`，标注文案中需配合的组件、标签、强调色使用策略，方便设计/前端落地时保持一致。

## 1. Hero 区块
- 主标题、CTA 按钮使用默认 accent 色 `--color-accent`（访客/注册用户视图）。
- 若切换创作者视图（后台预览），CTA 使用 `--color-accent`（Creator 视图）= `#9333ea`。
- 背景建议使用 `--color-surface`，搭配体验设计提供的 hero 渐变图：`public/gradients/hero-default.png`。
- 标签（上传灵感/提交授权/上线出图）采用 accent-soft (`rgba(37, 99, 235, 0.08)`) 作为底色，文字色 `--color-accent`。

## 2. Stepper 流程
- Stepper 高亮步骤使用 `--color-accent`；其余步骤使用 `--color-muted`。
- 审核中状态提示条：背景 `--color-warning` 10% 透明度，字体 `--color-warning`。
- 成功 toast（如授权校验通过）使用 `--color-positive`。

## 3. 通知与提醒
- 补扣弹窗主按钮沿用 `--color-accent`；警示文案（余额不足/违规预警）使用 `--color-warning`。
- 举报复核提示中的 SLA 字样突出，可使用 `--color-warning`（文本）或添加 warning icon（参考 assets-manifest icons/compliance/alerts）。

## 4. 角色语气/样式
- 游客/注册用户：默认 accent 蓝色。
- 创作者：当进入创作者后台或展示创作者专属模块时，CTA 与标签使用 Creator accent 紫色；文案仍保持“合作伙伴”语气。
- 审核员内部通知：可使用中性灰 + warning/orange 辅助色，避免营销感。

## 5. 图片与素材调用策略
- Hero 案例卡：使用 assets-manifest 中 `public/images/cases/...` 路径，搭配统一圆角（`--radius-lg`）。
- 快速上手插画：引用 `public/illustrations/quickstart-step{1-3}.svg`，需确保背景透明以便 CTA 叠加。
- 风险/合规提示：引用 `public/icons/compliance/alerts/` 目录中的橙/红色图标。

## 6. 后续跟进
- 待 experience-design 上传实际插画/图标后，确认色值是否匹配令牌，如有偏差请在 `shared/design-tokens.md` 中更新。
- 通知模板在多语言适配时，需标注哪些文本支持富文本突出（如 bold、色彩）。
