# Codex 执行指引（frontend-build）

## 系统指令
- 先阅读本目录 `TODO.md` 与 `..\\shared\\CHANGELOG.md`，确认最新指派与阻塞。
- 每次结束工作时，必须在 `..\\shared\\status-feed.md` 中 `platform-delivery` 行填写“完成 / 阻塞 / 下一步 / 责任人”，并把决策或阻塞同步写进 `..\\shared\\CHANGELOG.md`（附文档及行号）。
- 模块内进展需在 `TODO.md` 勾选或补充备注，确保与 `CHANGELOG` 和 status feed 保持一致。
- 如需提交草稿或存在跨组依赖，请先在 `..\\shared\\CHANGELOG.md` 标记状态（如 draft/blocked），再通知相关模块。
- 在 Codex CLI 中仅回复 `已更新文档，详见 shared/status-feed.md 与 shared/CHANGELOG.md`，避免额外长篇摘要。
- 每日 18:00 前自查当日记录是否已写入上述两份文档，缺失时立即补齐。

## 启动步骤
1. 打开 PowerShell，切换到本目录：
   ```powershell
   cd "D:\网页v2\webpage\frontend-build"
   ```
2. 校验协作信息：
   - **先阅读 `TODO.md`**，确认最新待办与其他小组留言是否有变化。
   - 查看 `..\shared\CHANGELOG.md`，核对是否存在相关计划或冲突。
3. 进入 Codex 工作环境：
   ```powershell
   codex --cd "D:\网页v2\webpage\frontend-build"
   ```
   进入后再次检查 `TODO.md` 记录的留言是否有新更新，必要时在内部对齐行动项。
4. 安装/启动本地依赖（若需运行开发服务器）：
   ```powershell
   pnpm install   # 推荐使用 pnpm，可根据团队约定改为 npm/yarn
   pnpm dev       # 启动 Next.js 开发服务
   ```
   > 依赖安装前请确认当前环境具备写入权限；若 Codex 沙箱为只读，需要申请升级权限或改成本地执行。

## 注意事项
- 目录结构：`app/` 与 `pages/` 共享同一 Landing 体验；组件与数据位于 `src/components`、`src/data`，请保持分层清晰。
- 类型与可访问性：新增组件务必同步 `src/lib/types.ts`，并确保语义化标签、ARIA、键盘导航可用。
- 数据占位：目前使用静态 JSON/占位图。接入真实接口前需取得 `platform-integration` 的 API 契约。
- 样式：全局样式集中在 `app/globals.css`，改动需评估对其他页面的影响并记录在 CHANGELOG。
- 模拟实时：`src/hooks/useRealtimeFeed.ts` 提供前端模拟链路，可根据后端协议替换。

## 跨组协作流程
- `platform-integration`
  - 在接入授权、积分、ComfyUI、训练等 API 前，先于 `shared/CHANGELOG.md` 登记联调计划（含接口名称、影响范围、时间）。
  - 联调完成后，更新双方目录的 `TODO.md`，并同步测试账号、错误码约定。
- `operations-compliance`
  - 审核后台/举报流程的 IA、状态机变更需提前评审，确保与其 SOP 保持一致。
  - 积分退款、任务回滚等流程上线前确认接口是否可用，并在 `TODO.md` 留言。
- `experience-design`
  - 高保真视觉、动效、文案更新需设计团队确认后再落地，必要时附上版本号或链接。
  - 若交互存在变更（如角色切换、任务中心异常兜底），请在 `TODO.md` 记录并与设计团队同步。
- `shared`
  - 埋点规范、设计令牌、公共函数若有更新，请先查阅 `shared` 目录文档；新增内容需在 `CHANGELOG.md` 申报并邀请相关组评审。

> 如果发现未覆盖的跨组依赖，请立即在 `TODO.md` 补充协作条目，并通过会议/IM 通知相关成员，避免阻塞。


