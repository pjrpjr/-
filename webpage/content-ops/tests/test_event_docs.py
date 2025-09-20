from __future__ import annotations

from pathlib import Path
import re

CONTENT_OPS_DIR = Path(__file__).resolve().parents[1]
SHARED_DIR = CONTENT_OPS_DIR.parent / "shared"

CODE_PATTERN = re.compile(r"`([^`]+)`")

REQUIRED_EVENTS = {
    "license_apply",
    "license_approved",
    "license_rejected",
    "task_start",
    "task_completed",
    "task_failed",
    "risk_alert",
}


def _extract_codes(cell: str) -> set[str]:
    codes = set(CODE_PATTERN.findall(cell))
    if codes:
        return codes
    stripped = cell.strip()
    if stripped and not any(ch.isspace() for ch in stripped):
        return {stripped}
    return set()


def _parse_table_events(path: Path, *, column: int = 0) -> set[str]:
    events: set[str] = set()
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line.startswith("|"):
            continue
        if set(line) <= {"|", "-", " "}:
            continue
        cells = [cell.strip() for cell in line.strip("|").split("|")]
        if not cells:
            continue
        header_cell = cells[column]
        if header_cell in {"事件 ID", "事件 ID / 接口", "Event ID", "Event"}:
            continue
        events.update(_extract_codes(header_cell))
    return events


def _metrics_events() -> set[str]:
    return _parse_table_events(SHARED_DIR / "metrics" / "README.md")


def test_required_events_are_defined_in_metrics():
    metrics_events = _metrics_events()
    missing = REQUIRED_EVENTS - metrics_events
    assert not missing, f"Expected events missing from shared/metrics/README.md: {sorted(missing)}"


def test_event_copy_matrix_covers_required_events():
    events = _parse_table_events(CONTENT_OPS_DIR / "event-copy-matrix.md")
    missing = REQUIRED_EVENTS - events
    assert not missing, f"event-copy-matrix.md lacks mappings for: {sorted(missing)}"


def test_role_messaging_guide_covers_required_events():
    events = _parse_table_events(CONTENT_OPS_DIR / "role-messaging-guide.md", column=1)
    missing = REQUIRED_EVENTS - events
    assert not missing, f"role-messaging-guide.md lacks messaging for: {sorted(missing)}"
