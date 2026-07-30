import os
from collections.abc import Iterator
from typing import Final

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

load_dotenv()

DEFAULT_DATABASE_URL: Final = "sqlite:///./todo.db"
DEFAULT_CORS_ALLOW_ORIGINS: Final = "http://localhost:5173"


def get_database_url() -> str:
    return os.getenv("DATABASE_URL", DEFAULT_DATABASE_URL)


def get_cors_allow_origins() -> list[str]:
    configured_origins = os.getenv("CORS_ALLOW_ORIGINS", DEFAULT_CORS_ALLOW_ORIGINS)
    return [origin.strip() for origin in configured_origins.split(",") if origin.strip()]


DATABASE_URL = get_database_url()

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_session() -> Iterator[Session]:
    """FastAPI dependency that provides a database session.

    Yields:
        Session: An active SQLAlchemy session.
    """
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
