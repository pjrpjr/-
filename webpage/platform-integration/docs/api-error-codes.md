# 平台集成 API 鉴权与错误码约定

## 鉴权方式
- 所有受保护接口需携带 `Authorization: Bearer <jwt>` 头，JWT 内需要包含 `tenant_id`、`scopes` 与 `exp` 且均有效。
- WebSocket/SSE 订阅需在连接 query string 中携带 `token`（同一 JWT），并由网关校验。

## 错误码规范
| HTTP 状态 | 错误码 | 描述 | 备注 |
| -------- | ------ | ---- | ---- |
| 401 | 40101 | missing_token | 请求未提供 Authorization 头或 token 为空 |
| 401 | 40102 | invalid_token | token 解析失败、签名错误或已过期 |
| 403 | 40301 | scope_denied | token scope 不包含访问目标接口所需权限 |
| 403 | 40302 | authorization_revoked | 用户授权被吊销、已过期或超出额度 |
| 404 | 40401 | resource_not_found | 模板/任务等资源不存在 |
| 409 | 40901 | duplicate_request | 幂等冲突，重复提交导致冲突 |
| 422 | 42201 | payload_invalid | 参数校验失败（字段缺失、格式不合法） |
| 500 | 50000 | internal_error | 服务内部错误 |

## 使用指引
- FastAPI 层统一通过 `HTTPException(status_code, detail={"code": <错误码>, "message": <描述>})` 返回。
- 前端需基于 `detail.code` 判断具体场景并映射友好提示。
- 若联合第三方（支付、消息网关）返回自定义错误，需在响应中以 `detail.meta` 附带原始错误。

## 待办
- [ ] 与安全、法务确认是否需要额外记录失败 token 与 IP 日志。
- [ ] SDK/前端错误码映射表预计在 D2 前提供草案。
