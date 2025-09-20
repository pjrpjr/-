# `/sessions/me` 角色主题字段扩展

## 1. 新增字段
```json
{
  "user_id": "user_7788",
  "tenant_id": "creator_001",
  "role": "viewer",
  "theme": "viewer",        // 新增：viewer/creator/reviewer/compliance
  "scopes": ["task.read", "credits.write"],
  "balance": 400,
  "unread_notifications": 2,
  "last_login": "2025-09-17T09:00:00Z"
}
```

## 2. 实现计划
- 2025-09-18：更新 Mock `/sessions/me`，返回 role/theme（viewer 默认）。
- 2025-09-18：在 `/credits/charge`、`/tasks/events` 中透传 `theme` 以便前端 UI 切换。
- 2025-09-19：联调前端，确认主题切换逻辑。

## 3. 关联任务
- frontend-build：根据 theme 切换 design tokens。
- experience-design：确认 theme → token 映射。
- shared/design-tokens.md：已提供 Creator 主题颜色。

## 4. 待办
- 更新 OpenAPI（sessions/me）。
- 在 docs/api-permission-matrix.md 记录角色 → theme 映射。
