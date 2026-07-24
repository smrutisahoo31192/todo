## Context

The application needs a persistent data layer for todos. Currently, there is no ORM model, database configuration, or session management. We are building on FastAPI with an existing project structure in `app/`. The choice of database technology and migration strategy will affect how the team manages schema evolution.

## Goals / Non-Goals

**Goals:**
- Define a single, extensible SQLAlchemy Todo model
- Establish SQLite for local development (suitable for early-stage project)
- Implement automated database initialization on startup
- Provide a FastAPI dependency for session injection in route handlers
- Create a clear pattern for future model additions

**Non-Goals:**
- Multi-database support (e.g., PostgreSQL production builds) — out of scope for this phase
- Advanced migration features (e.g., down migrations, branching) — Alembic auto-migration is sufficient
- Connection pooling tuning or performance optimization
- Authentication or multi-tenancy support

## Decisions

### 1. SQLAlchemy with SQLite
**Decision**: Use SQLAlchemy ORM for data modeling and SQLite for local development.

**Rationale**: SQLAlchemy is the Python standard for ORMs and integrates well with FastAPI. SQLite requires no external service, ideal for local development and small-scale deployments.

**Alternatives Considered**:
- Raw SQL queries: Abandoned for type safety and maintainability
- SQLModel (SQLAlchemy v2 wrapper): Viable, but SQLAlchemy directly is more established and flexible

### 2. Alembic for migrations
**Decision**: Use Alembic for schema versioning and migrations.

**Rationale**: Alembic is the standard migration tool for SQLAlchemy, supports auto-generation, and integrates cleanly into startup workflows.

**Alternatives Considered**:
- Auto-create tables on startup (simple, but loses migration history)
- Manual migration scripts: Abandoned for maintainability

### 3. Database session as FastAPI dependency
**Decision**: Implement `SessionLocal()` as a FastAPI dependency function; inject into routes via `Depends()`.

**Rationale**: Follows FastAPI best practices, ensures proper session lifecycle management (creation, cleanup), and decouples routes from database initialization logic.

**Alternatives Considered**:
- Global session variable: Poor isolation and testing
- Manual session management in each route: Boilerplate and error-prone

### 4. Auto-create tables on startup (fallback for simplicity)
**Decision**: If Alembic proves heavyweight for this stage, implement auto-create via SQLAlchemy's `Base.metadata.create_all()` in the app startup event.

**Rationale**: Simpler for rapid iteration; no separate migration CLI needed. Can migrate to Alembic later without changing the model.

**Alternatives Considered**:
- Alembic-only approach: Requires migration files and CLI invocation; works but adds overhead early

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| SQLite file location not portable | Document expected DB file location; use env var to configure |
| No rollback path if table creation fails | Log startup errors clearly; provide manual recovery instructions |
| Alembic auto-migration misses edge cases | Reserve right to hand-edit migrations as needed |
| Future scaling to PostgreSQL may require refactoring | Design models in Alembic-compatible way; avoid SQLite-specific features |

## Migration Plan

1. Create database module structure in `app/db/`
2. Define Todo model in `app/models/`
3. Initialize Alembic or implement auto-create
4. Wire session dependency into FastAPI app
5. Test in isolation before integrating into routes

## Open Questions

- Should we commit Alembic versions directory to git, or generate on first run?
- What is the desired database file location (./data/app.db or elsewhere)?
- Do we need separate DB files for different environments (dev/test)?
