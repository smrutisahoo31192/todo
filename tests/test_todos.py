import pytest
from fastapi.testclient import TestClient

from app.main import app
from app import store


@pytest.fixture(autouse=True)
def reset_store():
    """Reset the in-memory store before each test."""
    store._reset_store()
    yield
    store._reset_store()


client = TestClient(app)


# --- list ---

def test_list_todos_empty():
    r = client.get("/todos")
    assert r.status_code == 200
    assert r.json() == []


def test_list_todos_populated():
    client.post("/todos", json={"title": "First"})
    client.post("/todos", json={"title": "Second"})
    r = client.get("/todos")
    assert r.status_code == 200
    items = r.json()
    assert len(items) == 2
    assert items[0]["title"] == "First"
    assert items[1]["title"] == "Second"


# --- create ---

def test_create_todo():
    r = client.post("/todos", json={"title": "Buy milk"})
    assert r.status_code == 201
    data = r.json()
    assert data["title"] == "Buy milk"
    assert data["completed"] is False
    assert "id" in data
    assert "created_at" in data


def test_create_todo_missing_title_returns_422():
    r = client.post("/todos", json={})
    assert r.status_code == 422


def test_create_todo_bad_payload_returns_422():
    r = client.post("/todos", content="not-json", headers={"Content-Type": "application/json"})
    assert r.status_code == 422


# --- get by id ---

def test_get_todo():
    created = client.post("/todos", json={"title": "Read book"}).json()
    r = client.get(f"/todos/{created['id']}")
    assert r.status_code == 200
    assert r.json()["title"] == "Read book"


def test_get_todo_not_found():
    r = client.get("/todos/9999")
    assert r.status_code == 404


# --- update (PUT) ---

def test_put_todo_update_title():
    created = client.post("/todos", json={"title": "Old title"}).json()
    r = client.put(f"/todos/{created['id']}", json={"title": "New title"})
    assert r.status_code == 200
    assert r.json()["title"] == "New title"


def test_put_todo_update_completed():
    created = client.post("/todos", json={"title": "Task"}).json()
    r = client.put(f"/todos/{created['id']}", json={"completed": True})
    assert r.status_code == 200
    assert r.json()["completed"] is True


def test_put_todo_not_found():
    r = client.put("/todos/9999", json={"title": "Ghost"})
    assert r.status_code == 404


# --- update (PATCH) ---

def test_patch_todo_update_title():
    created = client.post("/todos", json={"title": "Original"}).json()
    r = client.patch(f"/todos/{created['id']}", json={"title": "Patched"})
    assert r.status_code == 200
    assert r.json()["title"] == "Patched"


def test_patch_todo_update_completed():
    created = client.post("/todos", json={"title": "Task"}).json()
    r = client.patch(f"/todos/{created['id']}", json={"completed": True})
    assert r.status_code == 200
    assert r.json()["completed"] is True


def test_patch_todo_not_found():
    r = client.patch("/todos/9999", json={"completed": True})
    assert r.status_code == 404


# --- delete ---

def test_delete_todo():
    created = client.post("/todos", json={"title": "To delete"}).json()
    r = client.delete(f"/todos/{created['id']}")
    assert r.status_code == 204
    # confirm it's gone
    r2 = client.get(f"/todos/{created['id']}")
    assert r2.status_code == 404


def test_delete_todo_not_found():
    r = client.delete("/todos/9999")
    assert r.status_code == 404
