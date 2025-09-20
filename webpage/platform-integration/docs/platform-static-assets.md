# 静态素材访问策略（更新于 2025-09-18）

## 1. 目标
- 与 shared/assets-manifest.md、shared/phase2-instructions.md 保持一致，明确各类素材的本地路径与 CDN 访问策略。
- 体验设计/内容运营交付新资源 24h 内更新 manifest 与本文件，变更需同步 shared/CHANGELOG.md。

## 2. 资源清单
| 资源 | 本地路径 | 访问策略 | 当前状态 |
| ---- | -------- | -------- | -------- |
| Hero 背景 `hero-default.png` | `frontend-build/public/gradients/hero-default.png` | 本地静态资源；上线后前缀 `https://cdn.platform.prod/gradients/` | 2025-09-18 占位版已交付，等待正式稿 |
| Quickstart 插画 `quickstart-step{1-3}.svg` | `frontend-build/public/illustrations/` | 同上，保持透明背景 | 2025-09-18 占位版 |
| Persona 徽标 `persona-{role}.svg` | `frontend-build/public/icons/persona/` | 根据 `/sessions/me.theme_role` 加载 | 2025-09-18 占位版，等待品牌确认色值 |
| 任务状态图标 `task-status-{state}.svg` | `frontend-build/public/icons/task-status/` | 事件 payload `icon_key` 对应 | 2025-09-18 占位版，待 ops-compliance 正式稿 |
| 审核/风控图标 | `frontend-build/public/admin/icons/` | ops-compliance 维护，按需更新 CDN | 2025-09-17 占位版；9/20 计划替换 |

## 3. 配置说明
- 环境变量 `PUBLIC_ASSET_BASE_URL` 控制 CDN 前缀；开发环境可为空（使用相对路径）。
- 前端引用统一调用 `assetUrl(relativePath)`，避免硬编码。
- 对需要鉴权的素材（如创作者专属）预留 `/secured/` 目录，结合短期签名 URL。

## 4. 更新流程
1. 体验设计/内容运营导出资源并放入 `frontend-build/public/...`。
2. 平台集成更新 `shared/assets-manifest.md` 对应行（路径、Owner、交付时间、状态）。
3. 更新本文件 `资源清单` 状态，如已上线 CDN 需补充链接。
4. shared/CHANGELOG.md 记录“素材更新”与阻塞说明。

## 5. TODO
- [ ] 等体验设计交付高保真资源后替换占位文件。
- [ ] 与基础设施确认 CDN 上传脚本与缓存策略。
- [ ] 若新增 Lottie/GIF 动效，补充表格与访问策略。


## 测试计划
- 下载测试：构建后通过 CDN 链接验证 200 响应。
- 权限测试：对需要鉴权的资源模拟带签名/无签名请求。
- 待 experience-design 9/18 导出高保真素材后执行上述检查。

## 6. 鉴权与缓存策略
- CDN 前缀统一为 `https://cdn.platform.prod/`，通过 Terraform 管理缓存策略。
- 对 `/secured/` 目录启用 5 分钟边缘鉴权缓存（鉴权缓存），命中时校验签名 URL 的 `exp` 与 `policy_tag`。
- 过期或校验失败时回源到签名服务，由平台集成刷新签名并写入审计日志。
- 改动需在 shared/CHANGELOG.md 登记，确保前端与内容运营同步更新。

