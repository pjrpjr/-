import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
TRACKING_INPUTS = ROOT / "operations-compliance" / "compliance-tracking-inputs.md"
METRICS_README = ROOT / "shared" / "metrics" / "README.md"
HANDSHAKE_PLAN = ROOT / "experience-design" / "tracking-handshake-plan.md"
ROLE_MESSAGING = ROOT / "content-ops" / "role-messaging-guide.md"
IMPLEMENTATION_PLAN = ROOT / "shared" / "metrics" / "implementation-plan.md"
MEETING_TEMPLATE = ROOT / "shared" / "metrics" / "meetings" / "2025-09-21-metrics-sync.md"
METRICS_SQL = ROOT / "shared" / "metrics" / "artifacts" / "2025-09-21" / "verify_phase1_events.sql"


def test_compliance_tracking_includes_policy_tag_enum():
    content = TRACKING_INPUTS.read_text(encoding="utf-8")
    for tag in ("A1", "A2", "B1", "B2", "C1", "C2", "D1", "D2", "D3"):
        assert f"| {tag} " in content, f"缺少 {tag} 枚举"
    assert "- [ ]" not in content, "待执行项应在 9/21 前标记完成"


def test_metrics_policy_tag_documented():
    content = METRICS_README.read_text(encoding="utf-8")
    assert "policy_tag" in content
    assert "A1/A2/B1/B2/C1/C2/D1/D2/D3" in content, "shared/metrics 中需记录完整 policy_tag 枚举"
    assert "action_required" in content and "risk_level" in content and "escalation_level" in content


def test_metrics_readme_mentions_artifact_sql():
    content = METRICS_README.read_text(encoding="utf-8")
    assert "verify_phase1_events.sql" in content, "README 需引用 SQL 校验脚本"


def test_tracking_handshake_mentions_policy_and_action():
    content = HANDSHAKE_PLAN.read_text(encoding="utf-8")
    assert "policy_tag" in content
    assert "action_required" in content


def test_role_messaging_mentions_policy_and_action():
    content = ROLE_MESSAGING.read_text(encoding="utf-8")
    assert "policy_tag" in content
    assert "action_required" in content


def test_implementation_plan_sections():
    content = IMPLEMENTATION_PLAN.read_text(encoding="utf-8")
    for phrase in ("负责人", "环境依赖", "测试策略", "联调步骤"):
        assert phrase in content, f"implementation-plan 缺少 {phrase}"


def test_meeting_template_exists_with_agenda():
    content = MEETING_TEMPLATE.read_text(encoding="utf-8")
    for heading in ("## 会议目标", "## 与会人", "## 讨论要点", "## 决策与行动项"):
        assert heading in content, f"会议模板缺少 {heading}"


def test_metrics_sql_contains_required_fields():
    sql = METRICS_SQL.read_text(encoding="utf-8")
    for keyword in ("policy_tag", "action_required", "escalation_level"):
        assert keyword in sql, f"verify_phase1_events.sql 缺少 {keyword} 字段校验"
