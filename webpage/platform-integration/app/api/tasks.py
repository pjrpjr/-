
import json
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.core import state
from app.core.state import utc_now

router = APIRouter(prefix="/api/v1/tasks", tags=["tasks"])


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


class TaskEvent(BaseModel):
    event: str
    task_id: str
    status: str
    message: str | None = None
    credits_delta: int | None = None
    ts: str
    stage: str
    progress: int
    next_eta: str | None = None
    cursor: str


class TaskResponse(BaseModel):
    task_id: str
    status: str
    template_id: str
    tenant_id: str
    user_id: str
    result_url: str | None = None
    created_at: str
    updated_at: str
    metadata: dict[str, str] | None = None


@router.get("/{task_id}", response_model=TaskResponse, summary="查询任务详情")
async def get_task(task_id: str) -> TaskResponse:
    try:
        task = state.get_task(task_id)
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "40401", "message": "task_not_found"},
        ) from None
    return TaskResponse(
        task_id=task.task_id,
        status=task.status,
        template_id=task.template_id,
        tenant_id=task.tenant_id,
        user_id=task.user_id,
        result_url=task.result_url,
        created_at=task.created_at.isoformat().replace('+00:00', 'Z'),
        updated_at=task.updated_at.isoformat().replace('+00:00', 'Z'),
        metadata=task.metadata,
    )


@router.get("/{task_id}/events", response_model=list[TaskEvent], summary="查询任务事件流")
async def get_task_events(task_id: str) -> list[TaskEvent]:
    try:
        events = state.list_task_events(task_id)
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "40401", "message": "task_not_found"},
        ) from None
    return [TaskEvent(**_serialize_event(event)) for event in events]


@router.get("/stream/sse", summary="任务事件 SSE")
async def stream_task_events(task_id: str, since: str | None = None, cursor: str | None = None):
    try:
        events = state.list_task_events(task_id)
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "40401", "message": "task_not_found"},
        ) from None

    since_dt: Optional[datetime] = None
    if cursor is not None:
        try:
            since_dt = _parse_cursor(cursor)
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"code": "40003", "message": "invalid_cursor"},
            ) from exc
    elif since is not None:
        try:
            since_dt = datetime.fromtimestamp(float(since), tz=timezone.utc)
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"code": "40002", "message": "invalid_since_timestamp"},
            ) from exc

    if since_dt is not None:
        events = [evt for evt in events if evt.ts > since_dt]

    async def iterator():
        last_cursor = None
        for evt in events:
            payload = _serialize_event(evt)
            last_cursor = payload["cursor"]
            data_line = json.dumps(payload, ensure_ascii=False)
            yield f"id: {last_cursor}\n"
            yield f"event: {payload['event']}\n"
            yield f"data: {data_line}\n\n"
        heartbeat_payload = json.dumps(
            {
                "event": "system.heartbeat",
                "server_time": utc_now().isoformat().replace('+00:00', 'Z'),
                "cursor": last_cursor,
            },
            ensure_ascii=False,
        )
        yield "event: system.heartbeat\n"
        yield f"data: {heartbeat_payload}\n\n"
    return StreamingResponse(iterator(), media_type="text/event-stream")


@router.get("/stream/mock", summary="返回 WebSocket/SSE 模拟配置")
async def task_stream_mock() -> dict[str, object]:
    return {
        "ws_url": "wss://mock.platform-integration/ws/v1/tasks/stream",
        "sse_url": "https://mock.platform-integration/sse/v1/tasks/stream",
        "token": "mock-jwt-token",
        "cadence": [
            {"event": "task.accepted", "delay_seconds": 0, "stage": "ingest"},
            {"event": "task.running", "delay_seconds": 180, "stage": "processing"},
            {"event": "task.completed", "delay_seconds": 360, "stage": "delivery"},
        ],
        "retry_backoff_seconds": [1, 2, 5],
    }
