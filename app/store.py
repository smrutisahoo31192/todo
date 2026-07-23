from datetime import datetime, timezone
from typing import Dict, List

from app.models import TodoCreate, TodoItem, TodoUpdate

_store: Dict[int, TodoItem] = {}
_next_id: int = 1


def list_todos() -> List[TodoItem]:
    return list(_store.values())


def create_todo(data: TodoCreate) -> TodoItem:
    global _next_id
    item = TodoItem(
        id=_next_id,
        title=data.title,
        completed=False,
        created_at=datetime.now(timezone.utc),
    )
    _store[_next_id] = item
    _next_id += 1
    return item


def get_todo(todo_id: int) -> TodoItem:
    if todo_id not in _store:
        raise KeyError(todo_id)
    return _store[todo_id]


def update_todo(todo_id: int, data: TodoUpdate) -> TodoItem:
    if todo_id not in _store:
        raise KeyError(todo_id)
    item = _store[todo_id]
    updated = item.model_copy(
        update={
            k: v
            for k, v in data.model_dump().items()
            if v is not None
        }
    )
    _store[todo_id] = updated
    return updated


def delete_todo(todo_id: int) -> None:
    if todo_id not in _store:
        raise KeyError(todo_id)
    del _store[todo_id]


def _reset_store() -> None:
    """Reset store to empty state (used in tests)."""
    global _next_id
    _store.clear()
    _next_id = 1
