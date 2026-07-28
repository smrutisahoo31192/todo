import os

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.database import get_session
from app.main import app
from app.models import Base

# Use a persistent test database file
TEST_DB_PATH = "/tmp/test_todo.db"
TEST_DATABASE_URL = f"sqlite:///{TEST_DB_PATH}"

# Clean up before each test session
if os.path.exists(TEST_DB_PATH):
    os.remove(TEST_DB_PATH)

test_engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
Base.metadata.create_all(bind=test_engine)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


def override_get_session():
    """Override the get_session dependency for testing."""
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


# Apply the override
app.dependency_overrides[get_session] = override_get_session


@pytest.fixture
def db_session() -> Session:
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture(autouse=True)
def reset_database():
    """Clear all data before each test."""
    session = TestingSessionLocal()
    for table in reversed(Base.metadata.sorted_tables):
        session.execute(table.delete())
    session.commit()
    session.close()
    yield


@pytest.fixture(scope="session", autouse=True)
def cleanup_test_db():
    """Clean up test database after all tests."""
    yield
    if os.path.exists(TEST_DB_PATH):
        os.remove(TEST_DB_PATH)
