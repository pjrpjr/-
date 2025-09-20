from pathlib import Path

path = Path("app/core/state.py")
text = path.read_text(encoding="utf-8")
old = """_task_events: Dict[str, List[TaskEvent]] = {
    \"task_mock_001\": [
        TaskEvent(
            event=\"task.accepted\",
            task_id=\"task_mock_001\",
            status=\"queued\",
            message=\"任务已排队\",
            credits_delta=None,
            ts=datetime.utcnow() - timedelta(hours=3),
        ),
        TaskEvent(
            event=\"task.running\",
            task_id=\"task_mock_001\",
            status=\"running\",
            message=\"任务执行中\",
            credits_delta=None,
            ts=datetime.utcnow() - timedelta(hours=2, minutes=45),
        ),
        TaskEvent(
            event=\"task.completed\",
            task_id=\"task_mock_001\",
            status=\"completed\",
            message=\"任务完成\",
            credits_delta=-10,
            ts=datetime.utcnow() - timedelta(hours=2),
        ),
    ]
}
"""
new = """_task_events: Dict[str, List[TaskEvent]] = {
    \"task_mock_001\": [
        TaskEvent(
            event=\"task.accepted\",
            task_id=\"task_mock_001\",
            status=\"queued\",
            message=\"任务已排队\",
            credits_delta=None,
            ts=datetime.utcnow() - timedelta(hours=3),
            stage=\"ingest\",
            progress=10,
            next_eta=datetime.utcnow() - timedelta(hours=2, minutes=50),
        ),
        TaskEvent(
            event=\"task.running\",
            task_id=\"task_mock_001\",
            status=\"running\",
            message=\"任务执行中\",
            credits_delta=None,
            ts=datetime.utcnow() - timedelta(hours=2, minutes=45),
            stage=\"processing\",
            progress=55,
            next_eta=datetime.utcnow() - timedelta(hours=2, minutes=5),
        ),
        TaskEvent(
            event=\"task.completed\",
            task_id=\"task_mock_001\",
            status=\"completed\",
            message=\"任务完成\",
            credits_delta=-10,
            ts=datetime.utcnow() - timedelta(hours=2),
            stage=\"delivery\",
            progress=100,
            next_eta=None,
        ),
    ]
}
"""
if old not in text:
    raise SystemExit("Old block not found")
path.write_text(text.replace(old, new), encoding="utf-8")
