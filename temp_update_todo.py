from pathlib import Path

path = Path("TODO.md")
lines = path.read_text(encoding="utf-8").splitlines()

def ensure_note(trigger: str, note: str):
    for idx, line in enumerate(lines):
        if trigger in line:
            if idx + 1 < len(lines) and note.split("：", 1)[0].strip() in lines[idx + 1]:
                return
            lines.insert(idx + 1, note)
            return

ensure_note("与 platform-integration 对接 API", "  - 阻塞：2025-09-17 等待 platform-integration 确认字段/错误码后联调（docs/platform-api-integration-plan.md）。")
ensure_note("实现“任务中心”实时推送", "  - 阻塞：2025-09-17 等待 platform-integration 提供实时推送协议（docs/realtime-push-plan.md）。")
ensure_note("搭建审核后台与举报面板", "  - 阻塞：2025-09-17 等待 operations-compliance 提供枚举字段（docs/ops-integration-plan.md）。")
ensure_note("对照 shared/design-tokens.md", "  - 完成：2025-09-17 校验完成，详见 docs/design-tokens-usage.md、docs/asset-loading-strategy.md。")
ensure_note("根据 shared/role-matrix.md", "  - 完成：2025-09-17 校准完成，详见 docs/role-integration.md。")

path.write_text("\n".join(lines) + "\n", encoding="utf-8")
