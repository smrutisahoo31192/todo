import pytest
from fastapi.testclient import TestClient

from app import storage
from app.main import app

client = TestClient(app)


def setup_function():
    storage.reset()


# ---------------------------------------------------------------------------
# GET /todos
# ---------------------------------------------------------------------------


def test_list_todos_empty():
    r = client.get("/todos")
    assert r.status_code == 200
    assert r.json() == []


def test_list_todos_returns_all():
    storage.create("Task A")
    storage.create("Task B")
    r = client.get("/todos")
    assert r.status_code == 200
    data = r.json()
    assert len(data) == 2
    assert data[0]["title"] == "Task A"
    assert data[1]["title"] == "Task B"


# ---------------------------------------------------------------------------
# POST /todos
# ---------------------------------------------------------------------------


def test_create_todo_valid():
    r = client.post("/todos", json={"title": "Buy milk"})
    assert r.status_code == 201
    body = r.json()
    assert body["title"] == "Buy milk"
    assert body["completed"] is False
    assert isinstance(body["id"], int)


def test_create_todo_missing_title():
    r = client.post("/todos", json={})
    assert r.status_code == 422


def test_create_todo_empty_title():
    r = client.post("/todos", json={"title": ""})
    assert r.status_code == 422


def test_create_todo_whitespace_title():
    r = client.post("/todos", json={"title": "   "})
    assert r.status_code == 422


# ---------------------------------------------------------------------------
# GET /todos/{id}
# ---------------------------------------------------------------------------


def test_get_todo_existing():
    created = storage.create("Read book")
    r = client.get(f"/todos/{created['id']}")
    assert r.status_code == 200
    body = r.json()
    assert body["id"] == created["id"]
    assert body["title"] == "Read book"
    assert body["completed"] is False


def test_get_todo_missing():
    r = client.get("/todos/9999")
    assert r.status_code == 404


# ---------------------------------------------------------------------------
# PUT /todos/{id}
# ---------------------------------------------------------------------------


def test_put_todo_valid():
    created = storage.create("Old title")
    r = client.put(f"/todos/{created['id']}", json={"title": "New title", "completed": True})
    assert r.status_code == 200
    body = r.json()
    assert body["title"] == "New title"
    assert body["completed"] is True


def test_put_todo_missing():
    r = client.put("/todos/9999", json={"title": "X", "completed": False})
    assert r.status_code == 404


def test_put_todo_missing_completed_field():
    created = storage.create("Foo")
    r = client.put(f"/todos/{created['id']}", json={"title": "Bar"})
    assert r.status_code == 422


# ---------------------------------------------------------------------------
# PATCH /todos/{id}
# ---------------------------------------------------------------------------


def test_patch_todo_title_only():
    created = storage.create("Initial")
    r = client.patch(f"/todos/{created['id']}", json={"title": "Updated"})
    assert r.status_code == 200
    body = r.json()
    assert body["title"] == "Updated"
    assert body["completed"] is False  # unchanged


def test_patch_todo_completed_only():
    created = storage.create("Task")
    r = client.patch(f"/todos/{created['id']}", json={"completed": True})
    assert r.status_code == 200
    body = r.json()
    assert body["completed"] is True
    assert body["title"] == "Task"  # unchanged


def test_patch_todo_missing():
    r = client.patch("/todos/9999", json={"title": "Nope"})
    assert r.status_code == 404


# ---------------------------------------------------------------------------
# DELETE /todos/{id}
# ---------------------------------------------------------------------------


def test_delete_todo_existing():
    created = storage.create("To delete")
    r = client.delete(f"/todos/{created['id']}")
    assert r.status_code == 204
    # Confirm it's gone
    r2 = client.get(f"/todos/{created['id']}")
    assert r2.status_code == 404


def test_delete_todo_missing():
    r = client.delete("/todos/9999")
    assert r.status_code == 404
