from sqlalchemy.orm import Session

from app import storage


def test_get_all_returns_created_todos(db_session: Session) -> None:
    created_a = storage.create(db_session, "Task A")
    created_b = storage.create(db_session, "Task B")

    todos = sorted(storage.get_all(db_session), key=lambda todo: todo["id"])

    assert todos == [created_a, created_b]


def test_get_by_id_returns_none_for_missing_todo(db_session: Session) -> None:
    assert storage.get_by_id(db_session, 9999) is None


def test_get_by_id_returns_created_todo(db_session: Session) -> None:
    created = storage.create(db_session, "Read book")

    assert storage.get_by_id(db_session, created["id"]) == created


def test_create_persists_default_completed_false(db_session: Session) -> None:
    created = storage.create(db_session, "Buy milk")

    assert created["completed"] is False
    assert storage.get_by_id(db_session, created["id"]) == created


def test_update_returns_updated_todo(db_session: Session) -> None:
    created = storage.create(db_session, "Old title")

    updated = storage.update(db_session, created["id"], "New title", True)

    assert updated == {
        "id": created["id"],
        "title": "New title",
        "completed": True,
    }
    assert storage.get_by_id(db_session, created["id"]) == updated


def test_update_returns_none_for_missing_todo(db_session: Session) -> None:
    assert storage.update(db_session, 9999, "Missing", True) is None


def test_patch_updates_only_provided_fields(db_session: Session) -> None:
    created = storage.create(db_session, "Initial")

    updated_title = storage.patch(db_session, created["id"], title="Updated", completed=None)
    updated_completed = storage.patch(db_session, created["id"], completed=True)

    assert updated_title == {
        "id": created["id"],
        "title": "Updated",
        "completed": False,
    }
    assert updated_completed == {
        "id": created["id"],
        "title": "Updated",
        "completed": True,
    }
    assert storage.get_by_id(db_session, created["id"]) == updated_completed


def test_patch_returns_none_for_missing_todo(db_session: Session) -> None:
    assert storage.patch(db_session, 9999, title="Missing") is None


def test_delete_returns_true_and_removes_existing_todo(db_session: Session) -> None:
    created = storage.create(db_session, "To delete")

    deleted = storage.delete(db_session, created["id"])

    assert deleted is True
    assert storage.get_by_id(db_session, created["id"]) is None


def test_delete_returns_false_for_missing_todo(db_session: Session) -> None:
    assert storage.delete(db_session, 9999) is False


def test_reset_clears_all_todos(db_session: Session) -> None:
    storage.create(db_session, "Task A")
    storage.create(db_session, "Task B")

    storage.reset(db_session)

    assert storage.get_all(db_session) == []
