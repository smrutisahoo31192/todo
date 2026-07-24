from __future__ import annotations

_todos: list[dict] = []
_next_id: int = 1


def get_all() -> list[dict]:
    return list(_todos)


def get_by_id(todo_id: int) -> dict | None:
    for todo in _todos:
        if todo["id"] == todo_id:
            return todo
    return None


def create(title: str) -> dict:
    global _next_id
    todo = {"id": _next_id, "title": title, "completed": False}
    _todos.append(todo)
    _next_id += 1
    return todo


def update(todo_id: int, title: str, completed: bool) -> dict | None:
    todo = get_by_id(todo_id)
    if todo is None:
        return None
    todo["title"] = title
    todo["completed"] = completed
    return todo


def patch(todo_id: int, **fields) -> dict | None:
    todo = get_by_id(todo_id)
    if todo is None:
        return None
    for key, value in fields.items():
        if value is not None:
            todo[key] = value
    return todo


def delete(todo_id: int) -> bool:
    global _todos
    before = len(_todos)
    _todos = [t for t in _todos if t["id"] != todo_id]
    return len(_todos) < before


def reset() -> None:
    global _todos, _next_id
    _todos = []
    _next_id = 1
