import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
ROLE_CHECKLIST = ROOT / "experience-design" / "role-matrix-checklist.md"
ROLE_SPEC = ROOT / "experience-design" / "experience-design-spec.md"
ROLE_MATRIX = ROOT / "shared" / "role-matrix.md"
BX_TODO = ROOT / "business-experience" / "TODO.md"


def test_role_checklist_has_review_conclusion_and_scopes():
    content = ROLE_CHECKLIST.read_text(encoding="utf-8")
    assert "9/19 角色权限评审结论" in content
    lower = content.lower()
    for phrase in ("viewer", "reviewer", "compliance ops", "review.approve", "compliance.policy", "policy_tag"):
        assert phrase in lower, f"缺少 {phrase} 对齐信息"


def test_experience_spec_updates_role_prompts():
    content = ROLE_SPEC.read_text(encoding="utf-8")
    lower = content.lower()
    assert "reviewer" in lower, "需在规格中标注 Reviewer 提示"
    assert "compliance" in lower, "需在规格中标注 Compliance 提示"
    assert "scope" in lower, "应提及 scope/权限映射"


def test_shared_role_matrix_lists_new_scopes():
    content = ROLE_MATRIX.read_text(encoding="utf-8")
    for phrase in ("credits.estimate", "licenses.check", "review.approve", "compliance.policy"):
        assert phrase in content, f"shared/role-matrix.md 缺少 {phrase}"


def test_business_experience_todo_marked_complete():
    content = BX_TODO.read_text(encoding="utf-8")
    assert "- [x] 2025-09-19 完成角色/权限文档与文案统一交付" in content
