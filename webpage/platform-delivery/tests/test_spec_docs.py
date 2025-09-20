import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]

API_SPEC = ROOT / "platform-integration" / "docs" / "api-design-notes.md"
STATIC_PLAN = ROOT / "platform-integration" / "docs" / "platform-static-assets.md"
PERMISSION_MATRIX = ROOT / "platform-integration" / "docs" / "api-permission-matrix.md"
SELF_CHECK = ROOT / "operations-compliance" / "permission-matrix-selfcheck-2025-09-19.md"


def test_api_design_notes_includes_review_conclusion():
    content = API_SPEC.read_text(encoding="utf-8")
    assert "9/18 规格评审结论" in content, "缺少 9/18 评审结论章节"
    assert "产品规划" in content and "前端" in content and "合规" in content and "平台" in content, "评审结论需包含四方确认"


def test_static_asset_plan_records_cdn_and_signed_url_strategy():
    content = STATIC_PLAN.read_text(encoding="utf-8")
    assert "https://cdn.platform.prod/" in content, "需声明生产环境 CDN 前缀"
    assert "签名 URL" in content and "鉴权缓存" in content, "需说明签名 URL 与缓存策略"


def test_permission_matrix_has_review_section_and_scopes():
    content = PERMISSION_MATRIX.read_text(encoding="utf-8")
    assert "9/19 权限评审结论" in content
    for phrase in ("review.approve", "compliance.policy", "audit_trail 示例", "viewer", "reviewer"):
        assert phrase in content, f"权限矩阵缺少 {phrase}"


def test_permission_selfcheck_marked_confirmed():
    content = SELF_CHECK.read_text(encoding="utf-8")
    assert "已确认" in content, "自检表需标记已确认"
    assert "待评审" not in content, "自检表应清除待评审状态"
    assert "评审纪要已登记" in content, "需说明已登记评审纪要"
