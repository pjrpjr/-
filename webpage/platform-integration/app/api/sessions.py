from app.core.state import utc_now

from fastapi import APIRouter

router = APIRouter(prefix="/api/v1/sessions", tags=["sessions"])


@router.get("/me", summary="获取当前会话信息")
async def get_me() -> dict[str, object]:
    now = utc_now().isoformat().replace("+00:00", "Z")
    return {
        "user_id": "user_7788",
        "tenant_id": "creator_001",
        "role": "viewer",
        "theme": "viewer",
        "scopes": ["task.read", "credits.write", "tasks.push"],
        "balance": 400,
        "frozen": 35,
        "unread_notifications": 2,
        "last_login": now,
    }
