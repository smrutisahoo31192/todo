import os
from collections.abc import Iterator
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.database import get_session
from app.main import app
from app.models import Base

TEST_DB_PATH = Path("/tmp") / f"test_todo_{os.getpid()}.db"
TEST_DATABASE_URL = f"sqlite:///{TEST_DB_PATH}"

# Clean up before each test session
if TEST_DB_PATH.exists():
    TEST_DB_PATH.unlink()

test_engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
Base.metadata.create_all(bind=test_engine)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


def override_get_session() -> Iterator[Session]:
    """Override the get_session dependency for testing."""
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


# Apply the override
app.dependency_overrides[get_session] = override_get_session


@pytest.fixture(autouse=True)
def reset_database() -> Iterator[None]:
    """Clear all data before each test."""
    session = TestingSessionLocal()
    try:
        for table in reversed(Base.metadata.sorted_tables):
            session.execute(table.delete())
        session.commit()
        yield
    finally:
        session.close()


@pytest.fixture()
def db_session() -> Iterator[Session]:
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture()
def client() -> Iterator[TestClient]:
    test_client = TestClient(app)
    try:
        yield test_client
    finally:
        test_client.close()


@pytest.fixture(scope="session", autouse=True)
def cleanup_test_db() -> Iterator[None]:
    """Clean up test database after all tests."""
    yield
    app.dependency_overrides.pop(get_session, None)
    if TEST_DB_PATH.exists():
        TEST_DB_PATH.unlink()
