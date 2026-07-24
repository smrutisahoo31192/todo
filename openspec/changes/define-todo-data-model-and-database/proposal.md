## Why

The todo application requires a persistent storage layer to save and retrieve todo items across application restarts. Currently, there is no database schema or model defined, blocking the ability to implement API endpoints that durably store user data.

## What Changes

- Add SQLAlchemy ORM model for todo items with required fields: `id`, `title`, `completed`, `created_at`
- Configure SQLite database for local development
- Implement database initialization (Alembic migrations or auto-create tables on startup)
- Create FastAPI database session dependency for route handlers

## Capabilities

### New Capabilities
- `todo-data-model`: SQLAlchemy model defining todo entity structure with id, title, completed, and created_at fields
- `todo-persistence`: SQLite database setup, initialization, and migration strategy for local development
- `database-session-dependency`: FastAPI dependency injection for managing database sessions in route handlers

### Modified Capabilities
<!-- No existing capabilities are being modified at the spec level -->

## Impact

- **Code**: New files in `app/models/`, `app/db/`, and migrations directory
- **APIs**: Database session dependency will be injected into all future todo routes
- **Dependencies**: SQLAlchemy, Alembic (or equivalent migration tool)
- **Systems**: Application startup will include database initialization logic
