from sqlalchemy.orm import Session

from app.models import Todo


def get_all(session: Session) -> list[dict]:
    """Get all todos."""
    todos = session.query(Todo).all()
    return [
        {"id": todo.id, "title": todo.title, "completed": todo.completed}
        for todo in todos
    ]


def get_by_id(session: Session, todo_id: int) -> dict | None:
    """Get a todo by ID."""
    todo = session.query(Todo).filter_by(id=todo_id).first()
    if todo is None:
        return None
    return {"id": todo.id, "title": todo.title, "completed": todo.completed}


def create(session: Session, title: str) -> dict:
    """Create a new todo."""
    todo = Todo(title=title, completed=False)
    session.add(todo)
    session.commit()
    session.refresh(todo)
    return {"id": todo.id, "title": todo.title, "completed": todo.completed}


def update(session: Session, todo_id: int, title: str, completed: bool) -> dict | None:
    """Update a todo (full update)."""
    todo = session.query(Todo).filter_by(id=todo_id).first()
    if todo is None:
        return None
    todo.title = title
    todo.completed = completed
    session.commit()
    session.refresh(todo)
    return {"id": todo.id, "title": todo.title, "completed": todo.completed}


def patch(session: Session, todo_id: int, **fields) -> dict | None:
    """Partial update a todo."""
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
    """Delete a todo by ID."""
    todo = session.query(Todo).filter_by(id=todo_id).first()
    if todo is None:
        return False
    session.delete(todo)
    session.commit()
    return True


def reset(session: Session) -> None:
    """Clear all todos (used in tests)."""
    session.query(Todo).delete()
    session.commit()
