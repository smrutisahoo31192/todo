from typing import Generator

from sqlalchemy.orm import Session

from app.db.session import SessionLocal


def get_db() -> Generator[Session, None, None]:
    """Dependency function that provides a database session for route handlers.
    
    Yields:
        A SQLAlchemy Session instance that will be cleaned up after the request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
