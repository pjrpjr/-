import pathlib
import sys

BASE_DIR = pathlib.Path(__file__).resolve().parents[1]
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

import pytest

from app.core import state


def test_check_license_delegates_state(monkeypatch):
    from app.services import licenses

    expected = {
        "is_authorized": True,
        "reason_code": "valid",
        "remaining_quota": -1,
        "daily_remaining": 10,
        "valid_until": state.utc_now(),
        "policy_tag": "A1",
        "requirements": [],
    }

    def fake_check(**kwargs):
        assert kwargs == {
            "tenant_id": "creator_001",
            "template_id": "tmpl_mock_001",
            "user_id": "user_001",
            "channel": "viewer",
            "session_id": "sess-123",
        }
        return expected

    monkeypatch.setattr(state, "check_license", fake_check)

    result = licenses.check_license(
        tenant_id="creator_001",
        template_id="tmpl_mock_001",
        user_id="user_001",
        channel="viewer",
        session_id="sess-123",
    )

    assert result == expected


def test_check_license_propagates_errors(monkeypatch):
    from app.services import licenses

    def fake_check(**kwargs):
        raise KeyError("template_not_found")

    monkeypatch.setattr(state, "check_license", fake_check)

    with pytest.raises(KeyError):
        licenses.check_license(
            tenant_id="creator_001",
            template_id="missing",
            user_id="user_999",
            channel="viewer",
            session_id="sess-456",
        )



def test_check_license_revoked(monkeypatch):
    from app.core import state
    from datetime import timedelta
    from app.services import licenses

    entry = state.AuthorizationEntry(
        authorization_id='auth_revoked',
        tenant_id='creator_revoked',
        template_id='tmpl_revoked',
        user_id='user_revoked',
        status='revoked',
        usage_limit=5,
        used=1,
        valid_from=state.utc_now() - timedelta(days=1),
        valid_to=state.utc_now() + timedelta(days=5),
    )
    monkeypatch.setattr(state, '_authorizations', {('creator_revoked', 'tmpl_revoked'): [entry]})
    monkeypatch.setattr(state, '_license_profiles', {})

    result = licenses.check_license(
        tenant_id='creator_revoked',
        template_id='tmpl_revoked',
        user_id='user_revoked',
        channel='viewer',
        session_id='sess-revoked',
    )

    assert result['is_authorized'] is False
    assert result['reason_code'] == 'revoked'
    assert result['remaining_quota'] == 4


def test_check_license_missing_documents(monkeypatch):
    from app.core import state
    from datetime import timedelta
    from app.services import licenses

    entry = state.AuthorizationEntry(
        authorization_id='auth_docs',
        tenant_id='creator_docs',
        template_id='tmpl_docs',
        user_id='user_docs',
        status='active',
        usage_limit=None,
        used=0,
        valid_from=state.utc_now() - timedelta(days=1),
        valid_to=state.utc_now() + timedelta(days=5),
    )
    monkeypatch.setattr(state, '_authorizations', {('creator_docs', 'tmpl_docs'): [entry]})
    monkeypatch.setattr(
        state,
        '_license_profiles',
        {('creator_docs', 'tmpl_docs', 'user_docs'): {'daily_limit': 10, 'daily_used': 2, 'policy_tag': 'A1', 'requirements': ['upload_contract']}},
    )

    result = licenses.check_license(
        tenant_id='creator_docs',
        template_id='tmpl_docs',
        user_id='user_docs',
        channel='viewer',
        session_id='sess-docs',
    )

    assert result['is_authorized'] is False
    assert result['reason_code'] == 'missing_documents'
    assert result['policy_tag'] == 'A1'
    assert result['requirements'] == ['upload_contract']


def test_check_license_daily_quota_exceeded(monkeypatch):
    from app.core import state
    from datetime import timedelta
    from app.services import licenses

    entry = state.AuthorizationEntry(
        authorization_id='auth_quota',
        tenant_id='creator_quota',
        template_id='tmpl_quota',
        user_id='user_quota',
        status='active',
        usage_limit=3,
        used=3,
        valid_from=state.utc_now() - timedelta(days=1),
        valid_to=state.utc_now() + timedelta(days=5),
    )
    monkeypatch.setattr(state, '_authorizations', {('creator_quota', 'tmpl_quota'): [entry]})
    monkeypatch.setattr(
        state,
        '_license_profiles',
        {('creator_quota', 'tmpl_quota', 'user_quota'): {'daily_limit': 3, 'daily_used': 3, 'policy_tag': None, 'requirements': []}},
    )

    result = licenses.check_license(
        tenant_id='creator_quota',
        template_id='tmpl_quota',
        user_id='user_quota',
        channel='viewer',
        session_id='sess-quota',
    )

    assert result['is_authorized'] is False
    assert result['reason_code'] == 'daily_quota_exceeded'
    assert result['remaining_quota'] == 0
    assert result['daily_remaining'] == 0
