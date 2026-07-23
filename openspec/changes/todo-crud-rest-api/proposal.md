## Why

The application currently exposes only a health-check endpoint. Users and downstream clients need a full todo lifecycle API so they can create, read, update, and delete todo items through a well-defined REST interface with validated request/response contracts.

## What Changes

- Add `GET /todos` — returns all todos as a JSON array
- Add `POST /todos` — creates a new todo, returns the created item with its assigned ID
- Add `GET /todos/{id}` — returns a single todo by ID, 404 if not found
- Add `PUT /todos/{id}` — replaces a todo's fields (title, completed), 404 if not found
- Add `PATCH /todos/{id}` — partially updates a todo (title and/or completed), 404 if not found
- Add `DELETE /todos/{id}` — removes a todo, 404 if not found
- Add Pydantic request/response schemas (`TodoCreate`, `TodoUpdate`, `TodoPatch`, `TodoResponse`)
- In-memory data store (list + auto-increment ID counter) — no database dependency for this iteration

## Capabilities

### New Capabilities

- `todo-crud`: Full CRUD REST API for todo items, including Pydantic schemas, in-memory storage, and proper HTTP error responses (404, 422)

### Modified Capabilities

*(none — no existing capability requirements are changing)*

## Impact

- **Code**: New module `app/routers/todos.py` (router), `app/schemas.py` (Pydantic models), `app/storage.py` (in-memory store); `app/main.py` updated to include the new router
- **APIs**: Five new REST endpoints under `/todos`
- **Dependencies**: No new runtime dependencies (`fastapi` already ships Pydantic v2)
- **Tests**: New test file `tests/test_todos.py` covering all endpoints and edge cases
