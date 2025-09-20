import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
PHASE1_BASELINE = ROOT / "product-planning" / "phase1-baseline.md"
DELIVERABLES = ROOT / "product-planning" / "phase1-deliverables-tracker.md"


def test_phase1_baseline_references_instrumentation_artifacts():
    content = PHASE1_BASELINE.read_text(encoding="utf-8")
    for keyword in (
        "shared/metrics/implementation-plan.md",
        "shared/metrics/meetings/2025-09-21-metrics-sync.md",
        "shared/metrics/artifacts/2025-09-21/verify_phase1_events.sql",
        "experience-design/tracking-handshake-plan.md",
    ):
        assert keyword in content, f"phase1-baseline 缺少 {keyword} 引用"


def test_deliverables_tracker_updates_status():
    content = DELIVERABLES.read_text(encoding="utf-8")
    assert "埋点落地计划确认" in content
    assert "已准备" in content or "已完成" in content, "deliverables tracker 需标记埋点计划状态"
