import pathlib
import sys
import copy

import pytest
from fastapi.testclient import TestClient

BASE_DIR = pathlib.Path(__file__).resolve().parents[1]
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from app.main import app  # noqa: E402
import app.api.credits as credits_api  # noqa: E402
from app.core import state  # noqa: E402


ORIGINAL_BALANCE = copy.deepcopy(state._balance)
ORIGINAL_LEDGER = list(state._ledger)
ORIGINAL_PRE_DEDUCTS = copy.deepcopy(state._pre_deducts)
ORIGINAL_TASK_EVENTS = copy.deepcopy(state._task_events)
ORIGINAL_BALANCE_ASSERTED = ORIGINAL_BALANCE[('creator_001', 'user_001')]['balance'] == 400
assert ORIGINAL_BALANCE_ASSERTED


@pytest.fixture()
def client():
    return TestClient(app)


@pytest.fixture(autouse=True)
def reset_state():
    state._balance = copy.deepcopy(ORIGINAL_BALANCE)
    assert state._balance[('creator_001', 'user_001')]['balance'] == 400
    state._ledger = list(ORIGINAL_LEDGER)
    state._pre_deducts = copy.deepcopy(ORIGINAL_PRE_DEDUCTS)
    state._task_events = copy.deepcopy(ORIGINAL_TASK_EVENTS)
    yield
    state._balance = copy.deepcopy(ORIGINAL_BALANCE)
    state._ledger = list(ORIGINAL_LEDGER)
    state._pre_deducts = copy.deepcopy(ORIGINAL_PRE_DEDUCTS)
    state._task_events = copy.deepcopy(ORIGINAL_TASK_EVENTS)


@pytest.fixture(autouse=True)
def stub_authorization(monkeypatch):
    class Entry:
        usage_limit = 10
        used = 1

    monkeypatch.setattr(credits_api, "_authorization_or_error", lambda *args, **kwargs: Entry())


def test_estimate_returns_payload(monkeypatch, client):
    expected = {
        "currency": "point",
        "template_id": "tmpl_mock_001",
        "scene": "image.generate",
        "resolution": "hd",
        "priority": "standard",
        "current_balance": 100,
        "selected_cost": 50,
        "estimated_cost": 50,
        "min_cost": 40,
        "max_cost": 60,
        "calculation_basis": "pricing_v20250918",
        "policy_tag": None,
        "audit_id": "calc_mock",
        "suggest_topup": 0,
        "extras": {"super_resolution": 10},
        "options": [{"priority": "standard", "total_cost": 50, "eta_minutes": 8}],
    }

    def fake_estimate(**kwargs):
        assert kwargs == {
            "tenant_id": "creator_001",
            "user_id": "user_001",
            "template_id": "tmpl_mock_001",
            "scene": "image.generate",
            "resolution": "hd",
            "priority": "standard",
            "extras": {"super_resolution": 10},
        }
        return expected

    monkeypatch.setattr(credits_api.credits_service, "estimate", fake_estimate)

    payload = {
        "tenant_id": "creator_001",
        "user_id": "user_001",
        "template_id": "tmpl_mock_001",
        "scene": "image.generate",
        "resolution": "hd",
        "priority": "standard",
        "extras": {"super_resolution": 10},
    }
    response = client.post("/api/v1/credits/estimate", json=payload)
    assert response.status_code == 200
    assert response.json() == expected


def test_charge_handles_insufficient_balance(monkeypatch, client):
    def fake_charge(**kwargs):
        raise ValueError("insufficient_balance")

    monkeypatch.setattr(credits_api.credits_service, "charge", fake_charge)

    payload = {
        "tenant_id": "creator_001",
        "user_id": "user_001",
        "template_id": "tmpl_mock_001",
        "task_id": "task_mock_001",
        "amount": 500,
        "priority": "standard",
        "reason": "charge",
    }
    response = client.post("/api/v1/credits/charge", json=payload)
    assert response.status_code == 403
    assert response.json()["detail"]["message"] == "insufficient_balance"


def test_charge_success(monkeypatch, client):
    class DummyLedger:
        ledger_id = "ledger_mock"
        tenant_id = "creator_001"
        user_id = "user_001"
        task_id = "task_mock_001"
        balance_after = 360
        change = -40
        reason = "charge:standard"
        created_at = state.utc_now()

    monkeypatch.setattr(credits_api.credits_service, "charge", lambda **kwargs: DummyLedger())

    payload = {
        "tenant_id": "creator_001",
        "user_id": "user_001",
        "template_id": "tmpl_mock_001",
        "task_id": "task_mock_001",
        "amount": 40,
        "priority": "standard",
        "reason": "charge",
    }
    response = client.post("/api/v1/credits/charge", json=payload)
    assert response.status_code == 200
    assert response.json()["balance_after"] == 360


def test_pre_deduct_calls_service(monkeypatch, client):
    class DummyRecord:
        pre_deduct_id = "pre123"
        frozen_amount = 40
        amount = 40
        tenant_id = "creator_001"
        user_id = "user_001"
        expires_at = "2025-09-19T10:00:00Z"

    monkeypatch.setattr(credits_api.credits_service, "pre_deduct", lambda **kwargs: DummyRecord())
    monkeypatch.setattr(credits_api.credits_service, "get_balance", lambda tenant_id, user_id: {"balance": 360, "frozen": 40})

    payload = {
        "task_id": "task_mock_001",
        "template_id": "tmpl_mock_001",
        "tenant_id": "creator_001",
        "user_id": "user_001",
        "scene": "image.generate",
        "estimated_cost": 40,
        "currency": "point",
        "expire_in": 600,
    }
    response = client.post("/api/v1/credits/pre-deduct", json=payload)
    assert response.status_code == 200
    assert response.json()["pre_deduct_id"] == "pre123"


def test_charge_amount_limit(monkeypatch, client):
    def fake_charge(**kwargs):
        raise ValueError("amount_limit_exceeded")

    monkeypatch.setattr(credits_api.credits_service, "charge", fake_charge)

    payload = {
        "tenant_id": "creator_001",
        "user_id": "user_001",
        "template_id": "tmpl_mock_001",
        "task_id": "task_mock_001",
        "amount": 5000,
        "priority": "fast",
        "reason": "charge",
    }
    response = client.post("/api/v1/credits/charge", json=payload)
    assert response.status_code == 422
    body = response.json()
    assert body["detail"]["code"] == "42201"


def test_commit_hold_insufficient(monkeypatch, client):
    def fake_commit(pre_deduct_id, actual_cost):
        raise ValueError("hold_insufficient")

    monkeypatch.setattr(credits_api.credits_service, "commit_pre_deduct", fake_commit)

    payload = {
        "pre_deduct_id": "pd_mock_001",
        "actual_cost": 220,
        "task_id": "task_mock_001",
        "tenant_id": "creator_001",
        "template_id": "tmpl_mock_001",
        "user_id": "user_001",
    }
    response = client.post("/api/v1/credits/commit", json=payload)
    assert response.status_code == 409
    body = response.json()
    assert body["detail"]["code"] == "40902"


def test_pre_deduct_commit_flow(client):
    balance_before = state.get_balance("creator_001", "user_001")
    assert balance_before["balance"] == 400
    pre_payload = {
        "task_id": "task_flow_001",
        "template_id": "tmpl_mock_001",
        "tenant_id": "creator_001",
        "user_id": "user_001",
        "scene": "image.generate",
        "estimated_cost": 30,
        "currency": "point",
        "expire_in": 600,
    }
    pre_response = client.post("/api/v1/credits/pre-deduct", json=pre_payload)
    assert pre_response.status_code == 200
    body = pre_response.json()
    pre_id = body["pre_deduct_id"]
    assert body["frozen_amount"] == 30
    balance_after_pre = state.get_balance("creator_001", "user_001")
    assert balance_after_pre["balance"] == 370

    commit_payload = {
        "pre_deduct_id": pre_id,
        "actual_cost": 28,
        "task_id": "task_flow_001",
        "tenant_id": "creator_001",
        "template_id": "tmpl_mock_001",
        "user_id": "user_001",
    }
    commit_response = client.post("/api/v1/credits/commit", json=commit_payload)
    assert commit_response.status_code == 200
    commit_body = commit_response.json()
    balance_after_state = state.get_balance("creator_001", "user_001")
    assert balance_after_state["balance"] == commit_body["balance_after"]
    assert commit_body["balance_after"] == 372
    assert commit_body["frozen_amount"] == 28

    history = client.get("/api/v1/credits/ledger", params={"tenant_id": "creator_001", "user_id": "user_001"})
    assert history.status_code == 200
    entries = history.json()["entries"]
    assert any(entry["reason"] == "commit" and entry["change"] == -28 for entry in entries)


def test_cancel_pre_deduct_restores_balance(client):
    pre_payload = {
        "task_id": "task_flow_002",
        "template_id": "tmpl_mock_001",
        "tenant_id": "creator_001",
        "user_id": "user_001",
        "scene": "image.generate",
        "estimated_cost": 25,
        "currency": "point",
        "expire_in": 600,
    }
    pre_response = client.post("/api/v1/credits/pre-deduct", json=pre_payload)
    assert pre_response.status_code == 200
    pre_id = pre_response.json()["pre_deduct_id"]

    cancel_payload = {
        "pre_deduct_id": pre_id,
        "tenant_id": "creator_001",
        "user_id": "user_001",
        "reason": "user_cancelled",
    }
    cancel_response = client.post("/api/v1/credits/cancel", json=cancel_payload)
    assert cancel_response.status_code == 200
    cancel_body = cancel_response.json()
    assert cancel_body["status"] == "cancelled"
    assert cancel_body["balance_after"] == "400"
