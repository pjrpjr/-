import pathlib
import sys

import pytest
import copy

BASE_DIR = pathlib.Path(__file__).resolve().parents[1]
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from app.core import state

ORIGINAL_BALANCE = copy.deepcopy(state._balance)
ORIGINAL_LEDGER = list(state._ledger)
ORIGINAL_PRE_DEDUCTS = copy.deepcopy(state._pre_deducts)
ORIGINAL_TASK_EVENTS = copy.deepcopy(state._task_events)
ORIGINAL_BALANCE_ASSERTED = ORIGINAL_BALANCE[('creator_001', 'user_001')]['balance'] == 400
assert ORIGINAL_BALANCE_ASSERTED


@pytest.fixture(autouse=True)
def _reset_state():
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
def _stub_authorization(monkeypatch):
    monkeypatch.setattr(state, "ensure_authorization", lambda *args, **kwargs: None)


def test_estimate_delegates_to_state(monkeypatch):
    from app.services import credits

    captured = {}

    def fake_estimate(**kwargs):
        captured.update(kwargs)
        return {
            "currency": "point",
            "template_id": kwargs["template_id"],
            "scene": kwargs["scene"],
            "resolution": kwargs["resolution"],
            "priority": kwargs["priority"],
            "current_balance": 100,
            "selected_cost": 50,
            "estimated_cost": 50,
            "min_cost": 40,
            "max_cost": 60,
            "calculation_basis": "mock",
            "policy_tag": None,
            "audit_id": "calc_mock",
            "suggest_topup": 0,
            "extras": kwargs.get("extras", {}),
            "options": [],
        }

    monkeypatch.setattr(state, "estimate_credits", fake_estimate)

    result = credits.estimate(
        tenant_id="creator_001",
        user_id="user_001",
        template_id="tmpl_mock_001",
        scene="image.generate",
        resolution="hd",
        priority="standard",
        extras={"super_resolution": 10},
    )

    assert captured == {
        "tenant_id": "creator_001",
        "user_id": "user_001",
        "template_id": "tmpl_mock_001",
        "scene": "image.generate",
        "resolution": "hd",
        "priority": "standard",
        "extras": {"super_resolution": 10},
    }
    assert result["currency"] == "point"
    assert result["audit_id"] == "calc_mock"


def test_charge_propagates_value_errors(monkeypatch):
    from app.services import credits

    def fake_charge(**kwargs):
        raise ValueError("insufficient_balance")

    monkeypatch.setattr(state, "charge_credits", fake_charge)

    with pytest.raises(ValueError) as exc:
        credits.charge(
            tenant_id="creator_001",
            user_id="user_001",
            template_id="tmpl_mock_001",
            task_id="task_mock_001",
            amount=200,
            priority="standard",
            reason="test",
        )
    assert str(exc.value) == "insufficient_balance"


def test_list_ledger_wraps_state(monkeypatch):
    from app.services import credits

    sample_item = state.CreditLedgerItem(
        ledger_id="ledger_mock",
        tenant_id="creator_001",
        user_id="user_001",
        task_id="task_mock_001",
        change=-20,
        balance_after=380,
        created_at=state.utc_now(),
        reason="charge:standard",
    )

    def fake_list(tenant_id, user_id):
        assert tenant_id == "creator_001"
        assert user_id == "user_001"
        return [sample_item]

    monkeypatch.setattr(state, "list_ledger", fake_list)

    entries = credits.list_ledger("creator_001", "user_001")
    assert entries == [sample_item]


@pytest.mark.parametrize(
    "payload,expected",
    [
        ({"amount": 10, "priority": "standard", "reason": "charge"}, {"amount": 10, "priority": "standard", "reason": "charge"}),
    ],
)
def test_charge_calls_state(monkeypatch, payload, expected):
    from app.services import credits

    captured = {}

    def fake_charge(**kwargs):
        captured.update(kwargs)
        return state.CreditLedgerItem(
            ledger_id="ledger_mock",
            tenant_id=kwargs["tenant_id"],
            user_id=kwargs["user_id"],
            task_id=kwargs["task_id"],
            change=-kwargs["amount"],
            balance_after=360,
            created_at=state.utc_now(),
            reason=f"{kwargs['reason']}:{kwargs['priority']}",
        )

    monkeypatch.setattr(state, "charge_credits", fake_charge)

    ledger = credits.charge(
        tenant_id="creator_001",
        user_id="user_001",
        template_id="tmpl_mock_001",
        task_id="task_mock_001",
        **payload,
    )

    assert captured["tenant_id"] == "creator_001"
    assert captured["template_id"] == "tmpl_mock_001"
    for key, value in expected.items():
        assert captured[key] == value
    assert ledger.balance_after == 360

def test_estimate_balance_gap(monkeypatch):
    from app.services import credits

    captured = {}

    def fake_estimate(**kwargs):
        captured.update(kwargs)
        return {
            "currency": "point",
            "template_id": kwargs["template_id"],
            "scene": kwargs["scene"],
            "resolution": kwargs["resolution"],
            "priority": kwargs["priority"],
            "current_balance": 100,
            "selected_cost": 180,
            "estimated_cost": 180,
            "min_cost": 160,
            "max_cost": 200,
            "calculation_basis": "mock",
            "policy_tag": None,
            "audit_id": "calc_gap",
            "suggest_topup": 80,
            "extras": kwargs.get("extras", {}),
            "options": [],
        }

    monkeypatch.setattr(state, "estimate_credits", fake_estimate)

    result = credits.estimate(
        tenant_id="creator_001",
        user_id="user_001",
        template_id="tmpl_mock_001",
        scene="image.generate",
        resolution="uhd",
        priority="fast",
        extras={"frames": 8},
    )

    assert captured["tenant_id"] == "creator_001"
    assert captured["extras"] == {"frames": 8}
    assert result["suggest_topup"] == 80
    assert result["estimated_cost"] == 180


def test_pre_deduct_insufficient_balance(monkeypatch):
    from app.services import credits

    def fake_pre_deduct(tenant_id, user_id, template_id, task_id, amount, expire_seconds):
        assert expire_seconds == 600
        raise ValueError("insufficient_balance")

    monkeypatch.setattr(state, "pre_deduct", fake_pre_deduct)

    with pytest.raises(ValueError, match="insufficient_balance"):
        credits.pre_deduct(
            tenant_id="creator_001",
            user_id="user_001",
            template_id="tmpl_mock_001",
            task_id="task_mock_pd",
            amount=180,
            expire_seconds=600,
        )


def test_charge_authorization_revoked(monkeypatch):
    from app.services import credits

    def fake_charge(**kwargs):
        raise ValueError("authorization_revoked")

    monkeypatch.setattr(state, "charge_credits", fake_charge)

    with pytest.raises(ValueError, match="authorization_revoked"):
        credits.charge(
            tenant_id="creator_001",
            user_id="user_001",
            template_id="tmpl_mock_001",
            task_id="task_mock_charge",
            amount=50,
            priority="standard",
            reason="charge",
        )


def test_commit_exceeds_hold(monkeypatch):
    from app.services import credits

    def fake_commit(pre_deduct_id, actual_cost):
        assert pre_deduct_id == "pd_mock_001"
        assert actual_cost == 220
        raise ValueError("hold_insufficient")

    monkeypatch.setattr(state, "commit_pre_deduct", fake_commit)

    with pytest.raises(ValueError, match="hold_insufficient"):
        credits.commit_pre_deduct("pd_mock_001", 220)


def test_cancel_after_commit(monkeypatch):
    from app.services import credits

    def fake_cancel(pre_deduct_id, reason):
        raise ValueError("already_processed")

    monkeypatch.setattr(state, "cancel_pre_deduct", fake_cancel)

    with pytest.raises(ValueError, match="already_processed"):
        credits.cancel_pre_deduct("pd_mock_001", reason="commit_done")


def test_charge_amount_limit(monkeypatch):
    from app.services import credits

    def fake_charge(**kwargs):
        raise ValueError("amount_limit_exceeded")

    monkeypatch.setattr(state, "charge_credits", fake_charge)

    with pytest.raises(ValueError, match="amount_limit_exceeded"):
        credits.charge(
            tenant_id="creator_001",
            user_id="user_001",
            template_id="tmpl_mock_001",
            task_id="task_mock_charge",
            amount=5000,
            priority="fast",
            reason="charge",
        )

