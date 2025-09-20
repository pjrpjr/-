（2025-09-18 更新）
| 资源 | 当前存放 | 访问策略 | TODO |
| ---- | -------- | -------- | ---- |
| Hero 背景 `hero-default.png` | frontend-build/public/gradients/ | 本地静态资源；上线后由 CDN 前缀 `https://cdn.platform.local/gradients/` | 正式稿交付后替换 |
| Quickstart 插画 `quickstart-step{1-3}.svg` | frontend-build/public/illustrations/ | 静态资源；需保证透明背景 | 等待高保真版本 |
| Persona 徽标 `persona-{role}.svg` | frontend-build/public/icons/persona/ | 静态资源；按角色切换 theme | 品牌终稿确认 color token |
| 任务状态图标 `task-status-{state}.svg` | frontend-build/public/icons/task-status/ | 静态资源；字段 `icon_key` -> `task-status-success` 等 | 与 ops-compliance 确认高保真版本 |
| 合规图标 `admin/icons/...` | frontend-build/public/admin/icons/ | 由 operations-compliance 维护；走本地路径 | 等待 9/20 更新 |

### 访问配置
- 开发环境默认使用相对路径。
- 测试/生产可设置 `PUBLIC_ASSET_BASE_URL` 指向 CDN。
- `/sessions/me` 返回 `theme_role`，前端根据角色加载不同素材。

### 下一步
- [ ] 等体验设计交付正式资源后替换。
- [ ] 与 shared 确认 CDN 上传流程。
- [ ] 记录在 shared/assets-manifest.md。
## 静态资源对接
## 静态资源对接（2025-09-18 更新）
| 资源 | 当前存放 | 访问策略 | TODO |
| ---- | -------- | -------- | ---- |
| Hero 背景 hero-default.png | frontend-build/public/gradients/ | 本地静态资源；上线后由 CDN 前缀 https://cdn.platform.local/gradients/ | 正式稿交付后替换 |
| Quickstart 插画 quickstart-step{1-3}.svg | frontend-build/public/illustrations/ | 静态资源；需保证透明背景 | 等待高保真版本 |
| Persona 徽标 persona-{role}.svg | frontend-build/public/icons/persona/ | 静态资源；按角色切换 theme | 品牌终稿确认 color token |
| 任务状态图标 	ask-status-{state}.svg | frontend-build/public/icons/task-status/ | 静态资源；字段 icon_key -> 	ask-status-success 等 | 与 ops-compliance 确认高保真版本 |
| 合规图标 dmin/icons/... | frontend-build/public/admin/icons/ | 由 operations-compliance 维护；走本地路径 | 等待 9/20 更新 |

### 访问配置
- 开发环境默认使用相对路径。
- 测试/生产可设置 PUBLIC_ASSET_BASE_URL 指向 CDN。
- /sessions/me 返回 	heme_role，前端根据角色加载不同素材。

### 下一步
- [ ] 等体验设计交付正式资源后替换。
- [ ] 与 shared 确认 CDN 上传流程。
- [ ] 记录在 shared/assets-manifest.md。