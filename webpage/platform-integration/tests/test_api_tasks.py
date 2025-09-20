
import json
import copy
import time
from datetime import timedelta
import pathlib
import sys

import pytest
from fastapi.testclient import TestClient

BASE_DIR = pathlib.Path(__file__).resolve().parents[1]
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from app.main import app  # noqa: E402
from app.core import state  # noqa: E402


@pytest.fixture()
def client():
    return TestClient(app)


@pytest.fixture(autouse=True)
def reset_state():
    snapshot = {
        "balance": copy.deepcopy(state._balance),
        "ledger": list(state._ledger),
        "pre_deducts": copy.deepcopy(state._pre_deducts),
        "task_events": {k: list(v) for k, v in state._task_events.items()},
    }
    yield
    state._balance = copy.deepcopy(snapshot["balance"])
    state._ledger = list(snapshot["ledger"])
    state._pre_deducts = copy.deepcopy(snapshot["pre_deducts"])
    state._task_events = {k: list(v) for k, v in snapshot["task_events"].items()}


def test_get_task_events_returns_payload(client):
    response = client.get('/api/v1/tasks/task_mock_001/events')
    assert response.status_code == 200
    events = response.json()
    assert events[0]['cursor']
    assert events[0]['event'] == 'task.accepted'


def test_stream_task_events_sse_yields_events(client):
    response = client.get('/api/v1/tasks/stream/sse', params={'task_id': 'task_mock_001'})
    assert response.status_code == 200
    lines = response.content.decode('utf-8').splitlines()
    ids = [line for line in lines if line.startswith('id: ')]
    data_lines = [line for line in lines if line.startswith('data: ')]
    assert ids
    payload = json.loads(data_lines[0][len('data: '):])
    assert payload['event'] == 'task.accepted'
    assert payload['cursor'] == ids[0][len('id: '):]


def test_stream_task_events_sse_filters_since(client):
    base_event = state.list_task_events('task_mock_001')[0]
    since = base_event.ts.timestamp()
    response = client.get('/api/v1/tasks/stream/sse', params={'task_id': 'task_mock_001', 'since': since})
    text = response.content.decode('utf-8')
    assert 'task.accepted' not in text
    assert 'task.running' in text


def test_stream_task_events_sse_cursor_filter(client):
    base_event = state.list_task_events('task_mock_001')[0]
    cursor = base_event.ts.isoformat().replace('+00:00', 'Z')
    response = client.get('/api/v1/tasks/stream/sse', params={'task_id': 'task_mock_001', 'cursor': cursor})
    text = response.content.decode('utf-8')
    assert 'task.accepted' not in text
    assert 'task.running' in text


def test_stream_task_events_invalid_since(client):
    response = client.get('/api/v1/tasks/stream/sse', params={'task_id': 'task_mock_001', 'since': 'invalid'})
    assert response.status_code == 400
    assert response.json()['detail']['code'] == '40002'


def test_websocket_stream_events(client):
    with client.websocket_connect('/ws/v1/tasks/stream?task_id=task_mock_001') as ws:
        first = ws.receive_json()
        assert first['event'] == 'task.accepted'
        ws.close()


def test_websocket_stream_incremental_updates(client):
    with client.websocket_connect('/ws/v1/tasks/stream?task_id=task_mock_001') as ws:
        ws.receive_json()
        new_event = state.TaskEvent(
            event='task.checkpoint',
            task_id='task_mock_001',
            status='running',
            message='checkpoint reached',
            credits_delta=None,
            ts=state.utc_now() + timedelta(seconds=1),
            stage='checkpointing',
            progress=65,
            next_eta=None,
        )
        state._task_events.setdefault('task_mock_001', []).append(new_event)
        time.sleep(1.2)
        received = None
        for _ in range(6):
            msg = ws.receive_json()
            if msg['event'] == 'task.checkpoint':
                received = msg
                break
        assert received is not None
        ws.close()


def test_websocket_stream_invalid_since(client):
    with client.websocket_connect('/ws/v1/tasks/stream?task_id=task_mock_001&since=invalid') as ws:
        error = ws.receive_json()
        assert error['event'] == 'error'
        assert error['code'] == 'invalid_since_timestamp'
        ws.close()


def test_websocket_stream_replay_cursor(client):
    second_event = state.list_task_events('task_mock_001')[1]
    cursor = second_event.ts.isoformat().replace('+00:00', 'Z')
    with client.websocket_connect(f"/ws/v1/tasks/stream?task_id=task_mock_001&cursor={cursor}") as ws:
        msg = ws.receive_json()
        assert msg['event'] == 'task.completed'
        ws.close()


def test_websocket_stream_multi_task_subscribe(client):
    with client.websocket_connect('/ws/v1/tasks/stream?task_id=task_mock_001&subscribe=task_mock_002') as ws:
        messages = [ws.receive_json() for _ in range(3)]
        task_ids = {msg['task_id'] for msg in messages}
        assert 'task_mock_001' in task_ids
        ws.close()
