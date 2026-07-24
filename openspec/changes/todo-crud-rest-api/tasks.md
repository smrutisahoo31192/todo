## 1. Pydantic Schemas

- [x] 1.1 Create `app/schemas.py` with `TodoCreate` (title: non-empty str), `TodoUpdate` (title: str, completed: bool), `TodoPatch` (title: str | None, completed: bool | None), and `TodoResponse` (id: int, title: str, completed: bool)

## 2. In-Memory Storage

- [x] 2.1 Create `app/storage.py` with module-level `_todos: list[dict]` and `_next_id: int` counter, plus functions: `get_all()`, `get_by_id(id)`, `create(title)`, `update(id, title, completed)`, `patch(id, **fields)`, `delete(id)`, and `reset()` for test isolation

## 3. Router

- [x] 3.1 Create `app/routers/__init__.py` (empty)
- [x] 3.2 Create `app/routers/todos.py` with an `APIRouter` and implement all five endpoint handlers: `GET /todos`, `POST /todos` (201), `GET /todos/{id}` (404), `PUT /todos/{id}` (404), `PATCH /todos/{id}` (404), `DELETE /todos/{id}` (204/404)

## 4. Wire Router into App

- [x] 4.1 Update `app/main.py` to import and include the todos router with prefix `/todos`

## 5. Tests

- [x] 5.1 Create `tests/test_todos.py` covering: list empty, create valid, create missing title, create empty title, get existing, get missing, put valid, put missing, put bad payload, patch title only, patch completed only, patch missing, delete existing, delete missing
