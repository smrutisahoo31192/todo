from sqlalchemy.orm import Session

from app import storage


def test_create_and_get_by_id_returns_persisted_todo(db_session: Session) -> None:
    created = storage.create(db_session, "Write tests")

    fetched = storage.get_by_id(db_session, created["id"])

    assert created["title"] == "Write tests"
    assert created["completed"] is False
    assert isinstance(created["id"], int)
    assert fetched == created


def test_get_all_returns_created_todos(db_session: Session) -> None:
    storage.create(db_session, "Task A")
    storage.create(db_session, "Task B")

    todos = storage.get_all(db_session)

    assert todos == [
        {"id": todos[0]["id"], "title": "Task A", "completed": False},
        {"id": todos[1]["id"], "title": "Task B", "completed": False},
    ]


def test_update_replaces_title_and_completed_state(db_session: Session) -> None:
    created = storage.create(db_session, "Old title")

    updated = storage.update(db_session, created["id"], "New title", True)

    assert updated == {
        "id": created["id"],
        "title": "New title",
        "completed": True,
    }


def test_patch_updates_title_without_changing_completed(db_session: Session) -> None:
    created = storage.create(db_session, "Initial title")

    patched = storage.patch(db_session, created["id"], title="Updated title")

    assert patched == {
        "id": created["id"],
        "title": "Updated title",
        "completed": False,
    }


def test_patch_updates_completed_without_changing_title(db_session: Session) -> None:
    created = storage.create(db_session, "Initial title")

    patched = storage.patch(db_session, created["id"], completed=True)

    assert patched == {
        "id": created["id"],
        "title": "Initial title",
        "completed": True,
    }


def test_patch_ignores_none_values_for_unchanged_fields(db_session: Session) -> None:
    created = storage.create(db_session, "Initial title")

    patched = storage.patch(db_session, created["id"], title=None, completed=None)

    assert patched == created


def test_delete_existing_todo_returns_true_and_removes_record(db_session: Session) -> None:
    created = storage.create(db_session, "Delete me")

    deleted = storage.delete(db_session, created["id"])

    assert deleted is True
    assert storage.get_by_id(db_session, created["id"]) is None


def test_missing_todo_operations_return_empty_results(db_session: Session) -> None:
    assert storage.get_by_id(db_session, 9999) is None
    assert storage.update(db_session, 9999, "Missing", True) is None
    assert storage.patch(db_session, 9999, title="Missing") is None
    assert storage.delete(db_session, 9999) is False
