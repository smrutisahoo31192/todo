from sqlalchemy.orm import Session

from app.models import Todo


def get_all(session: Session) -> list[dict]:
    """Return all todos as dictionaries.

    Args:
        session: Database session used for the query.

    Returns:
        A list of dictionaries with ``id``, ``title``, and ``completed`` keys.
    """
    todos = session.query(Todo).all()
    return [
        {"id": todo.id, "title": todo.title, "completed": todo.completed}
        for todo in todos
    ]


def get_by_id(session: Session, todo_id: int) -> dict | None:
    """Return a single todo by ID.

    Args:
        session: Database session used for the query.
        todo_id: ID of the todo to retrieve.

    Returns:
        A dictionary with ``id``, ``title``, and ``completed`` keys, or None
        if no todo has that ID.
    """
    todo = session.query(Todo).filter_by(id=todo_id).first()
    if todo is None:
        return None
    return {"id": todo.id, "title": todo.title, "completed": todo.completed}


def create(session: Session, title: str) -> dict:
    """Create and persist a new, incomplete todo.

    Args:
        session: Database session used to add and commit the todo.
        title: Title of the new todo.

    Returns:
        A dictionary with ``id``, ``title``, and ``completed`` keys.
    """
    todo = Todo(title=title, completed=False)
    session.add(todo)
    session.commit()
    session.refresh(todo)
    return {"id": todo.id, "title": todo.title, "completed": todo.completed}


def update(session: Session, todo_id: int, title: str, completed: bool) -> dict | None:
    """Replace the title and completion state of a todo.

    Args:
        session: Database session used to commit the changes.
        todo_id: ID of the todo to update.
        title: New title for the todo.
        completed: New completion state for the todo.

    Returns:
        A dictionary with ``id``, ``title``, and ``completed`` keys, or None
        if no todo has that ID.
    """
    todo = session.query(Todo).filter_by(id=todo_id).first()
    if todo is None:
        return None
    todo.title = title
    todo.completed = completed
    session.commit()
    session.refresh(todo)
    return {"id": todo.id, "title": todo.title, "completed": todo.completed}


def patch(session: Session, todo_id: int, **fields: object) -> dict | None:
    """Apply a partial update to a todo, skipping None values.

    Args:
        session: Database session used to commit the changes.
        todo_id: ID of the todo to update.
        **fields: Attribute names and values to set on the todo. Values that
            are None are ignored.

    Returns:
        A dictionary with ``id``, ``title``, and ``completed`` keys, or None
        if no todo has that ID.
    """
    todo = session.query(Todo).filter_by(id=todo_id).first()
    if todo is None:
        return None
    for key, value in fields.items():
        if value is not None:
            setattr(todo, key, value)
    session.commit()
    session.refresh(todo)
    return {"id": todo.id, "title": todo.title, "completed": todo.completed}


def delete(session: Session, todo_id: int) -> bool:
    """Delete a todo by ID.

    Args:
        session: Database session used to delete and commit the todo.
        todo_id: ID of the todo to delete.

    Returns:
        True if a todo was deleted, False if no todo has that ID.
    """
    todo = session.query(Todo).filter_by(id=todo_id).first()
    if todo is None:
        return False
    session.delete(todo)
    session.commit()
    return True


def reset(session: Session) -> None:
    """Delete all todos; intended for use in tests.

    Args:
        session: Database session used to delete and commit the todos.
    """
    session.query(Todo).delete()
    session.commit()
