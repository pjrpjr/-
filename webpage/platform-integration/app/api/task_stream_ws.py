
from __future__ import annotations

import asyncio
import json
from datetime import datetime, timezone
from typing import Iterable, Optional

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.core import state
from app.core.state import utc_now

router = APIRouter(prefix="/ws/v1/tasks", tags=["tasks-stream-ws"])

POLL_INTERVAL = 1.0
HEARTBEAT_INTERVAL = 25.0


def _serialize_event(event) -> dict[str, object]:
    return {
        "event": event.event,
        "task_id": event.task_id,
        "status": event.status,
        "message": event.message,
        "credits_delta": event.credits_delta,
        "ts": event.ts.isoformat().replace('+00:00', 'Z'),
        "stage": event.stage,
        "progress": event.progress,
        "next_eta": event.next_eta.isoformat().replace('+00:00', 'Z') if event.next_eta else None,
        "cursor": event.ts.isoformat().replace('+00:00', 'Z'),
    }


def _parse_cursor(value: str) -> datetime:
    if value.endswith('Z'):
        value = value[:-1] + '+00:00'
    return datetime.fromisoformat(value)


def _filter_events(events: list, since_dt: Optional[datetime]) -> list:
    if since_dt is None:
        return events
    return [evt for evt in events if evt.ts > since_dt]


async def _send_events(ws: WebSocket, events: Iterable) -> Optional[datetime]:
    last_ts = None
    for evt in events:
        await ws.send_json(_serialize_event(evt))
        last_ts = evt.ts
    return last_ts


@router.websocket('/stream')
async def websocket_stream(
    ws: WebSocket,
    task_id: str,
    since: str | None = None,
    cursor: str | None = None,
    subscribe: str | None = None,
) -> None:
    await ws.accept()

    task_ids = [task_id]
    if subscribe:
        task_ids.extend([
            tid.strip()
            for tid in subscribe.split(',')
            if tid.strip() and tid.strip() != task_id
        ])

    streams: dict[str, list] = {}
    for tid in task_ids:
        try:
            streams[tid] = state.list_task_events(tid)
        except KeyError:
            streams[tid] = []

    since_dt: Optional[datetime] = None
    if cursor is not None:
        try:
            since_dt = _parse_cursor(cursor)
        except Exception:
            await ws.send_json({"event": "error", "code": "invalid_cursor"})
    elif since is not None:
        try:
            since_dt = datetime.fromtimestamp(float(since), tz=timezone.utc)
        except Exception:
            await ws.send_json({"event": "error", "code": "invalid_since_timestamp"})

    for tid in streams:
        streams[tid] = _filter_events(streams[tid], since_dt)

    try:
        last_sent_ts = None
        for events in streams.values():
            sent_ts = await _send_events(ws, events)
            if sent_ts is not None and (last_sent_ts is None or sent_ts > last_sent_ts):
                last_sent_ts = sent_ts
        if last_sent_ts is None:
            last_sent_ts = utc_now()
        last_heartbeat = utc_now()

        while True:
            await asyncio.sleep(POLL_INTERVAL)
            for tid in task_ids:
                events = state.list_task_events(tid)
                new_events = _filter_events(events, last_sent_ts)
                if new_events:
                    sent_ts = await _send_events(ws, new_events)
                    if sent_ts is not None and sent_ts > last_sent_ts:
                        last_sent_ts = sent_ts
                    last_heartbeat = utc_now()
            if (utc_now() - last_heartbeat).total_seconds() >= HEARTBEAT_INTERVAL:
                await ws.send_json({
                    "event": "system.heartbeat",
                    "server_time": utc_now().isoformat().replace('+00:00', 'Z'),
                    "cursor": last_sent_ts.isoformat().replace('+00:00', 'Z') if last_sent_ts else None,
                })
                last_heartbeat = utc_now()
    except WebSocketDisconnect:
        return
