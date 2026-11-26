import pytest
from pydantic import ValidationError

from app.schemas import TodoCreate, TodoPatch, TodoResponse, TodoUpdate


def test_todo_create_valid_payload():
    todo = TodoCreate(title="Buy milk")
    assert todo.title == "Buy milk"


def test_todo_create_keeps_surrounding_whitespace():
    todo = TodoCreate(title="  Buy milk  ")
    assert todo.title == "  Buy milk  "


@pytest.mark.parametrize("title", ["", "   ", "\t\n"])
def test_todo_create_rejects_blank_title(title):
    with pytest.raises(ValidationError, match="title must not be empty"):
        TodoCreate(title=title)


@pytest.mark.parametrize(
    "payload",
    [
        {},
        {"title": None},
        {"title": 123},
    ],
)
def test_todo_create_rejects_invalid_payload(payload):
    with pytest.raises(ValidationError):
        TodoCreate(**payload)


def test_todo_update_valid_payload():
    todo = TodoUpdate(title="New title", completed=True)
    assert todo.title == "New title"
    assert todo.completed is True


def test_todo_update_valid_payload_with_completed_false():
    todo = TodoUpdate(title="New title", completed=False)
    assert todo.completed is False


@pytest.mark.parametrize("title", ["", "   ", "\t\n"])
def test_todo_update_rejects_blank_title(title):
    with pytest.raises(ValidationError, match="title must not be empty"):
        TodoUpdate(title=title, completed=True)


@pytest.mark.parametrize(
    "payload",
    [
        {},
        {"title": "X"},
        {"completed": True},
        {"title": 123, "completed": False},
        {"title": "X", "completed": "not-a-bool"},
    ],
)
def test_todo_update_rejects_invalid_payload(payload):
    with pytest.raises(ValidationError):
        TodoUpdate(**payload)


def test_todo_patch_empty_payload_defaults_to_none():
    todo = TodoPatch()
    assert todo.title is None
    assert todo.completed is None


@pytest.mark.parametrize(
    ("payload", "expected_title", "expected_completed"),
    [
        ({"title": "Updated"}, "Updated", None),
        ({"completed": True}, None, True),
        ({"completed": False}, None, False),
        ({"title": "Updated", "completed": True}, "Updated", True),
        ({"title": None, "completed": None}, None, None),
    ],
)
def test_todo_patch_valid_payloads(payload, expected_title, expected_completed):
    todo = TodoPatch(**payload)
    assert todo.title == expected_title
    assert todo.completed == expected_completed


@pytest.mark.parametrize("title", ["", "   ", "\t\n"])
def test_todo_patch_rejects_blank_title(title):
    with pytest.raises(ValidationError, match="title must not be empty"):
        TodoPatch(title=title)


@pytest.mark.parametrize(
    "payload",
    [
        {"title": 123},
        {"completed": "not-a-bool"},
        {"title": None, "completed": "not-a-bool"},
    ],
)
def test_todo_patch_rejects_invalid_payload(payload):
    with pytest.raises(ValidationError):
        TodoPatch(**payload)


def test_todo_response_valid_payload():
    todo = TodoResponse(id=1, title="Buy milk", completed=False)
    assert todo.id == 1
    assert todo.title == "Buy milk"
    assert todo.completed is False


def test_todo_response_accepts_blank_title():
    todo = TodoResponse(id=2, title="", completed=True)
    assert todo.title == ""


@pytest.mark.parametrize(
    "payload",
    [
        {},
        {"id": 1, "title": "X"},
        {"id": 1, "completed": False},
        {"title": "X", "completed": False},
        {"id": "one", "title": "X", "completed": False},
        {"id": 1, "title": 123, "completed": False},
        {"id": 1, "title": "X", "completed": "not-a-bool"},
    ],
)
def test_todo_response_rejects_invalid_payload(payload):
    with pytest.raises(ValidationError):
        TodoResponse(**payload)
