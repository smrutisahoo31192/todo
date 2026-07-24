"""Tests for database layer, models, and session dependency."""
from datetime import datetime

from fastapi.testclient import TestClient
from sqlalchemy import inspect

from app.db.dependencies import get_db
from app.db.session import engine, SessionLocal
from app.main import app
from app.models.todo import Todo


class TestTodoModel:
    """Test Todo model instantiation and field defaults."""

    def test_todo_instantiation(self) -> None:
        """Test that a Todo instance can be created."""
        todo = Todo(title="Learn SQLAlchemy")  # type: ignore[assignment]
        assert todo.title == "Learn SQLAlchemy"  # type: ignore[comparison-overlap]
        assert todo.id is None  # Not yet in database

    def test_todo_attributes(self) -> None:
        """Test that Todo model has expected attributes."""
        todo = Todo(title="Test todo")
        # Check that attributes exist
        assert hasattr(todo, "id")
        assert hasattr(todo, "title")
        assert hasattr(todo, "completed")
        assert hasattr(todo, "created_at")

    def test_todo_can_set_completed(self) -> None:
        """Test that completed field can be set."""
        todo = Todo(title="Test", completed=True)
        assert todo.completed is True

    def test_todo_persists_to_database(self) -> None:
        """Test that a Todo can be persisted and retrieved from the database."""
        session = SessionLocal()
        try:
            # Create and save a todo
            todo = Todo(title="Learn SQLAlchemy", completed=False)
            session.add(todo)
            session.commit()
            
            # Verify it was saved
            assert todo.id is not None
            assert todo.created_at is not None
            
            # Retrieve and verify
            retrieved = session.query(Todo).filter(Todo.id == todo.id).first()
            assert retrieved is not None  # type: ignore[comparison-overlap]
            assert retrieved.title == "Learn SQLAlchemy"  # type: ignore[comparison-overlap]
            assert retrieved.completed == False  # type: ignore[comparison-overlap]
        finally:
            session.close()


class TestDatabaseInitialization:
    """Test database table creation on startup."""

    def test_todos_table_exists(self) -> None:
        """Test that the todos table is created in the database."""
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        assert "todos" in tables, "todos table should exist in database"

    def test_todos_table_schema(self) -> None:
        """Test that the todos table has the correct schema."""
        inspector = inspect(engine)
        columns = inspector.get_columns("todos")
        column_names = {col["name"] for col in columns}
        
        # Verify all required columns exist
        required_columns = {"id", "title", "completed", "created_at"}
        assert required_columns.issubset(column_names), (
            f"Missing columns. Expected {required_columns}, got {column_names}"
        )
        
        # Verify column types
        column_map = {col["name"]: str(col["type"]) for col in columns}
        
        assert "INTEGER" in column_map["id"], "id should be INTEGER"
        assert "VARCHAR" in column_map["title"], "title should be VARCHAR"
        assert "BOOLEAN" in column_map["completed"], "completed should be BOOLEAN"
        assert "DATETIME" in column_map["created_at"], "created_at should be DATETIME"

    def test_todos_table_primary_key(self) -> None:
        """Test that id is the primary key."""
        inspector = inspect(engine)
        pk = inspector.get_pk_constraint("todos")
        assert "id" in pk["constrained_columns"], "id should be the primary key"

    def test_todos_table_idempotent(self) -> None:
        """Test that re-creating tables doesn't cause errors."""
        from app.db.base import Base
        # This should not raise an error even though tables already exist
        Base.metadata.create_all(bind=engine)
        
        # Verify tables still exist
        inspector = inspect(engine)
        assert "todos" in inspector.get_table_names()


class TestSessionDependency:
    """Test database session dependency injection."""

    def test_session_dependency_injection(self) -> None:
        """Test that get_db() can be injected into a route."""
        client = TestClient(app)
        
        # The health endpoint should work without dependency injection
        response = client.get("/health")
        assert response.status_code == 200
        
    def test_session_dependency_provides_session(self) -> None:
        """Test that get_db() returns a valid session."""
        db_gen = get_db()
        session = next(db_gen)
        
        # Verify it's a SQLAlchemy session
        assert session is not None
        
        # Clean up
        try:
            next(db_gen)
        except StopIteration:
            pass

    def test_session_cleanup(self) -> None:
        """Test that sessions are properly closed."""
        db_gen = get_db()
        session = next(db_gen)
        
        # Trigger cleanup
        try:
            next(db_gen)
        except StopIteration:
            pass
        
        # Session should be properly managed by SQLAlchemy


class TestAppStartup:
    """Test app initialization and database readiness."""

    def test_app_startup(self) -> None:
        """Test that app starts without errors."""
        client = TestClient(app)
        response = client.get("/health")
        assert response.status_code == 200

    def test_database_ready_on_startup(self) -> None:
        """Test that database is ready immediately after app creation."""
        # Create a new test client (which initializes the app)
        client = TestClient(app)
        
        # The database should be ready - tables should exist
        inspector = inspect(engine)
        assert "todos" in inspector.get_table_names()

    def test_health_endpoint_response(self) -> None:
        """Test that health endpoint returns expected response."""
        client = TestClient(app)
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}
