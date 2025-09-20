from __future__ import annotations

from typing import Dict

from app.core import state


def check_license(
    *,
    tenant_id: str,
    template_id: str,
    user_id: str,
    channel: str,
    session_id: str | None,
) -> Dict[str, object]:
    """Perform license verification via core state module."""
    return state.check_license(
        tenant_id=tenant_id,
        template_id=template_id,
        user_id=user_id,
        channel=channel,
        session_id=session_id or "",
    )
