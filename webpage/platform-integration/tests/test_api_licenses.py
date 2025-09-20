import pathlib
import sys

import pytest
from fastapi.testclient import TestClient

BASE_DIR = pathlib.Path(__file__).resolve().parents[1]
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from app.main import app  # noqa: E402
import app.api.licenses as licenses_api  # noqa: E402


@pytest.fixture()
def client():
    return TestClient(app)


def test_check_license_success(monkeypatch, client):
    expected = {
        "is_authorized": True,
        "reason_code": "valid",
        "remaining_quota": -1,
        "daily_remaining": 8,
        "valid_until": "2025-09-30T00:00:00Z",
        "policy_tag": None,
        "requirements": [],
    }

    def fake_check(**kwargs):
        assert kwargs == {
            "tenant_id": "creator_001",
            "template_id": "tmpl_mock_001",
            "user_id": "user_001",
            "channel": "viewer",
            "session_id": "",
        }
        return expected

    monkeypatch.setattr(licenses_api.licenses_service, "check_license", fake_check)

    payload = {
        "tenant_id": "creator_001",
        "template_id": "tmpl_mock_001",
        "user_id": "user_001",
        "channel": "viewer",
    }

    response = client.post("/api/v1/licenses/check", json=payload)
    assert response.status_code == 200
    assert response.json() == expected


def test_check_license_template_missing(monkeypatch, client):
    def fake_check(**kwargs):
        raise KeyError("template_not_found")

    monkeypatch.setattr(licenses_api.licenses_service, "check_license", fake_check)

    payload = {
        "tenant_id": "creator_001",
        "template_id": "missing",
        "user_id": "user_999",
        "channel": "creator",
        "session_id": "sess-123",
    }

    response = client.post("/api/v1/licenses/check", json=payload)
    assert response.status_code == 404
    body = response.json()
    assert body["detail"]["code"] == "0401"


def test_check_license_service_unavailable(monkeypatch, client):
    def fake_check(**kwargs):
        raise ValueError("service_unavailable")

    monkeypatch.setattr(licenses_api.licenses_service, "check_license", fake_check)

    payload = {
        "tenant_id": "creator_001",
        "template_id": "tmpl_mock_001",
        "user_id": "user_001",
        "channel": "external",
        "session_id": "sess-999",
    }

    response = client.post("/api/v1/licenses/check", json=payload)
    assert response.status_code == 503
    body = response.json()
    assert body["detail"]["code"] == "0304"


def test_check_license_revoked_returns_200(monkeypatch, client):
    payload = {
        "tenant_id": "creator_001",
        "template_id": "tmpl_mock_001",
        "user_id": "user_001",
        "channel": "viewer",
    }
    expected = {
        "is_authorized": False,
        "reason_code": "revoked",
        "remaining_quota": 0,
        "daily_remaining": 0,
        "valid_until": None,
        "policy_tag": "A2",
        "requirements": [],
    }
    def fake_check(**kwargs):
        return expected
    monkeypatch.setattr(licenses_api.licenses_service, "check_license", fake_check)
    response = client.post("/api/v1/licenses/check", json=payload)
    assert response.status_code == 200
    assert response.json() == expected


def test_check_license_missing_documents_returns_200(monkeypatch, client):
    payload = {
        "tenant_id": "creator_001",
        "template_id": "tmpl_mock_001",
        "user_id": "user_001",
        "channel": "viewer",
    }
    expected = {
        "is_authorized": False,
        "reason_code": "missing_documents",
        "remaining_quota": -1,
        "daily_remaining": 5,
        "valid_until": "2025-09-20T00:00:00Z",
        "policy_tag": "A3",
        "requirements": ["upload_contract"],
    }
    def fake_check(**kwargs):
        return expected
    monkeypatch.setattr(licenses_api.licenses_service, "check_license", fake_check)
    response = client.post("/api/v1/licenses/check", json=payload)
    assert response.status_code == 200
    assert response.json() == expected
