from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

DATABASE_URL = "sqlite:///./todo.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_session() -> Session:
    """FastAPI dependency that provides a database session.
    
    Yields:
        Session: An active SQLAlchemy session.
    """
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
