import pytest
from pydantic import ValidationError

from app.schemas import TodoCreate, TodoPatch, TodoUpdate


def test_todo_create_accepts_valid_payload() -> None:
    todo = TodoCreate(title="Buy milk")

    assert todo.model_dump() == {"title": "Buy milk"}


@pytest.mark.parametrize("title", ["", "   "])
def test_todo_create_rejects_blank_title(title: str) -> None:
    with pytest.raises(ValidationError, match="title must not be empty"):
        TodoCreate(title=title)


def test_todo_update_accepts_valid_payload() -> None:
    todo = TodoUpdate(title="Buy milk", completed=True)

    assert todo.model_dump() == {"title": "Buy milk", "completed": True}


@pytest.mark.parametrize("title", ["", "   "])
def test_todo_update_rejects_blank_title(title: str) -> None:
    with pytest.raises(ValidationError, match="title must not be empty"):
        TodoUpdate(title=title, completed=False)


def test_todo_patch_accepts_valid_payload() -> None:
    todo = TodoPatch(title="Buy milk", completed=True)

    assert todo.model_dump() == {"title": "Buy milk", "completed": True}


def test_todo_patch_accepts_partial_payload() -> None:
    todo = TodoPatch(completed=True)

    assert todo.model_dump(exclude_unset=True) == {"completed": True}


@pytest.mark.parametrize("title", ["", "   "])
def test_todo_patch_rejects_blank_title(title: str) -> None:
    with pytest.raises(ValidationError, match="title must not be empty"):
        TodoPatch(title=title)
