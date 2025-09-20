# 平台集成设计令牌与素材调用计划

## 1. 设计令牌对齐
| 场景 | 使用 Token | 来自 `shared/design-tokens.md` | 说明 |
| --- | --- | --- | --- |
| 默认平台视图 | `--color-bg`, `--color-surface`, `--color-accent` | 统一背景/卡片/CTA 主色 |
| 创作者后台视图 | Creator 视图 `--color-accent`, `--color-accent-soft` | 切换 `data-role="creator"` 时应用 |
| 审核/运营面板 | `--color-warning`, `--color-positive` | 区分审核结果、扣费成功状态 |
| 任务状态徽标 | `--color-muted`, `--color-fg` | 任务列表与推送详情的文本配色 |
| 按钮与模态 | `--radius-md`, `--shadow-soft` | 对齐前端组件圆角与阴影 |

> 待办：输出 API 返回中关于角色视图的 `accentTheme` 字段，指向上述令牌。目标日期 D2 下午随前端联调。

## 2. 素材需求与交付
| 资产 | 依赖 `shared/assets-manifest.md` | 平台集成责任 | 状态 | 下一步 |
| --- | --- | --- | --- | --- |
| 平台 Logo (`public/logo.svg`) | 需要静态资源上线 | 提供 CDN 桥接/缓存策略 | 等设计确认 | D1 结束前确认是否走 CDN Mock |
| 任务状态图标 (`public/icons/task-status-{state}.svg`) | 供任务中心前端使用 | 在任务推送 API 中返回 icon 名称 | 进行中 | 与 experience-design 对齐 icon 命名，D2 上午联调 |
| 3 步流程插画 | Quickstart 插画 | 提供静态资源地址给前端 | 待设计交付 | content-ops 回传路径后写入配置 |
| 品牌渐变背景 | hero 背景 | 确认 CDN/静态部署策略 | 待体验设计提供 | 预计 9/18 获取文件后更新 README |
| 模板演示短视频 | `public/videos/template-demo.mp4` | 确定是否需要流式分发或提供下载接口 | 待产品确认 | 产品决定是否登首屏后补充 API |

## 3. 调用策略
1. 所有静态资源优先引用 `frontend-build/public` 下的路径；若需 CDN，加前缀 `https://cdn.platform.local/` 并通过配置项 `PUBLIC_ASSET_BASE_URL` 控制。
2. Mock 阶段统一使用本地路径，联调时在 `GET /api/v1/tasks/{id}` 返回 `asset_manifest_version`，便于前端确认版本。
3. 任务状态响应中新增 `icon_key`（如 `task-status-success`），由前端映射到 `public/icons/task-status-{state}.svg`。
4. 若引入视频/大文件，需在接口文档补充 `signed_url` 生成策略，目前暂留 TODO（等待产品规划）。

## 4. 协作清单
- experience-design：9/18 前提供流程插画、品牌渐变背景的最终稿。
- content-ops：9/18 前更新案例图路径后通知平台团队。
- frontend-build：联调时确认 `accentTheme` 与 `icon_key` 字段映射；若缺少令牌/素材，及时回传。

