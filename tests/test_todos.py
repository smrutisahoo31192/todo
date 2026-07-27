from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import storage


# ---------------------------------------------------------------------------
# GET /todos
# ---------------------------------------------------------------------------


def test_list_todos_empty(client: TestClient) -> None:
    r = client.get("/todos")

    assert r.status_code == 200
    assert r.json() == []


def test_list_todos_returns_all(client: TestClient, db_session: Session) -> None:
    created_a = storage.create(db_session, "Task A")
    created_b = storage.create(db_session, "Task B")

    r = client.get("/todos")

    assert r.status_code == 200
    assert sorted(r.json(), key=lambda todo: todo["id"]) == [created_a, created_b]


# ---------------------------------------------------------------------------
# POST /todos
# ---------------------------------------------------------------------------


def test_create_todo_valid(client: TestClient) -> None:
    r = client.post("/todos", json={"title": "Buy milk"})

    assert r.status_code == 201
    body = r.json()
    assert set(body) == {"id", "title", "completed"}
    assert body["title"] == "Buy milk"
    assert body["completed"] is False
    assert isinstance(body["id"], int)

    get_response = client.get(f"/todos/{body['id']}")
    list_response = client.get("/todos")

    assert get_response.status_code == 200
    assert get_response.json() == body
    assert list_response.status_code == 200
    assert list_response.json() == [body]


def test_create_todo_missing_title(client: TestClient) -> None:
    r = client.post("/todos", json={})

    assert r.status_code == 422
    error = r.json()["detail"][0]
    assert error["loc"] == ["body", "title"]
    assert error["type"] == "missing"


def test_create_todo_empty_title(client: TestClient) -> None:
    r = client.post("/todos", json={"title": ""})

    assert r.status_code == 422
    error = r.json()["detail"][0]
    assert error["loc"] == ["body", "title"]
    assert "title must not be empty" in error["msg"]


def test_create_todo_whitespace_title(client: TestClient) -> None:
    r = client.post("/todos", json={"title": "   "})

    assert r.status_code == 422
    error = r.json()["detail"][0]
    assert error["loc"] == ["body", "title"]
    assert "title must not be empty" in error["msg"]


# ---------------------------------------------------------------------------
# GET /todos/{id}
# ---------------------------------------------------------------------------


def test_get_todo_existing(client: TestClient, db_session: Session) -> None:
    created = storage.create(db_session, "Read book")

    r = client.get(f"/todos/{created['id']}")

    assert r.status_code == 200
    assert r.json() == created


def test_get_todo_missing(client: TestClient) -> None:
    r = client.get("/todos/9999")

    assert r.status_code == 404
    assert r.json() == {"detail": "Todo not found"}


# ---------------------------------------------------------------------------
# PUT /todos/{id}
# ---------------------------------------------------------------------------


def test_put_todo_valid(client: TestClient, db_session: Session) -> None:
    created = storage.create(db_session, "Old title")

    r = client.put(f"/todos/{created['id']}", json={"title": "New title", "completed": True})

    assert r.status_code == 200
    body = r.json()
    assert body == {"id": created["id"], "title": "New title", "completed": True}

    get_response = client.get(f"/todos/{created['id']}")

    assert get_response.status_code == 200
    assert get_response.json() == body


def test_put_todo_missing(client: TestClient) -> None:
    r = client.put("/todos/9999", json={"title": "X", "completed": False})

    assert r.status_code == 404
    assert r.json() == {"detail": "Todo not found"}


def test_put_todo_missing_completed_field(client: TestClient, db_session: Session) -> None:
    created = storage.create(db_session, "Foo")

    r = client.put(f"/todos/{created['id']}", json={"title": "Bar"})

    assert r.status_code == 422
    error = r.json()["detail"][0]
    assert error["loc"] == ["body", "completed"]
    assert error["type"] == "missing"


# ---------------------------------------------------------------------------
# PATCH /todos/{id}
# ---------------------------------------------------------------------------


def test_patch_todo_title_only(client: TestClient, db_session: Session) -> None:
    created = storage.create(db_session, "Initial")

    r = client.patch(f"/todos/{created['id']}", json={"title": "Updated"})

    assert r.status_code == 200
    body = r.json()
    assert body == {"id": created["id"], "title": "Updated", "completed": False}

    get_response = client.get(f"/todos/{created['id']}")

    assert get_response.status_code == 200
    assert get_response.json() == body


def test_patch_todo_completed_only(client: TestClient, db_session: Session) -> None:
    created = storage.create(db_session, "Task")

    r = client.patch(f"/todos/{created['id']}", json={"completed": True})

    assert r.status_code == 200
    body = r.json()
    assert body == {"id": created["id"], "title": "Task", "completed": True}

    get_response = client.get(f"/todos/{created['id']}")

    assert get_response.status_code == 200
    assert get_response.json() == body


def test_patch_todo_missing(client: TestClient) -> None:
    r = client.patch("/todos/9999", json={"title": "Nope"})

    assert r.status_code == 404
    assert r.json() == {"detail": "Todo not found"}


# ---------------------------------------------------------------------------
# DELETE /todos/{id}
# ---------------------------------------------------------------------------


def test_delete_todo_existing(client: TestClient, db_session: Session) -> None:
    created = storage.create(db_session, "To delete")

    r = client.delete(f"/todos/{created['id']}")

    assert r.status_code == 204
    assert r.content == b""

    get_response = client.get(f"/todos/{created['id']}")

    assert get_response.status_code == 404
    assert get_response.json() == {"detail": "Todo not found"}


def test_delete_todo_missing(client: TestClient) -> None:
    r = client.delete("/todos/9999")

    assert r.status_code == 404
    assert r.json() == {"detail": "Todo not found"}
