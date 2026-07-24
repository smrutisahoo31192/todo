## 1. Project Structure & Dependencies

- [x] 1.1 Create `app/models/` directory for ORM models
- [x] 1.2 Create `app/db/` directory for database configuration
- [x] 1.3 Add SQLAlchemy and Alembic dependencies to `pyproject.toml`
- [x] 1.4 Verify dependencies install without conflicts

## 2. Database Configuration

- [x] 2.1 Create `app/db/config.py` with database URL configuration (SQLite path)
- [x] 2.2 Create SQLAlchemy engine and session factory in `app/db/session.py`
- [x] 2.3 Create declarative base in `app/db/base.py` for ORM models to inherit from

## 3. Todo Model Definition

- [x] 3.1 Create `app/models/todo.py` with SQLAlchemy Todo model
- [x] 3.2 Define fields: id (Integer, primary key), title (String, not null), completed (Boolean, default false), created_at (DateTime, auto-set to current time)
- [x] 3.3 Ensure model uses the declarative base from `app/db/base.py`
- [x] 3.4 Verify model is importable and has no syntax errors

## 4. Database Initialization & Migration

- [x] 4.1 Initialize Alembic in the project (or implement auto-create via metadata)
- [x] 4.2 Create initial migration or auto-create logic for todos table
- [x] 4.3 Ensure migrations/auto-create runs on application startup
- [x] 4.4 Verify todos table is created with correct schema

## 5. FastAPI Integration

- [x] 5.1 Create `app/db/dependencies.py` with `get_db()` dependency function
- [x] 5.2 Wire `get_db()` dependency into FastAPI app for use in route handlers
- [x] 5.3 Ensure database session is properly closed after each request
- [x] 5.4 Test that session dependency can be injected into a test route

## 6. Testing & Verification

- [x] 6.1 Write unit test for Todo model instantiation and field defaults
- [x] 6.2 Write integration test for database table creation on startup
- [x] 6.3 Write integration test for session dependency injection in a FastAPI route
- [x] 6.4 Run all tests to verify database layer works as expected
- [x] 6.5 Verify no type errors in the codebase (run type checker if configured)
