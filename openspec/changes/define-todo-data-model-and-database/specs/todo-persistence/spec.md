## ADDED Requirements

### Requirement: SQLite database for local development
The application SHALL use SQLite as the database backend for local development, with the database file stored at a configurable location (e.g., `./data/app.db`).

#### Scenario: Database file is created on startup
- **WHEN** the application starts for the first time
- **THEN** the SQLite database file is created at the configured path if it does not exist

#### Scenario: Database connection succeeds
- **WHEN** the application attempts to connect to the SQLite database
- **THEN** the connection is established without errors

### Requirement: Tables auto-created or migrated on startup
The application SHALL ensure all required tables exist by either auto-creating tables via SQLAlchemy metadata or by running migrations via Alembic.

#### Scenario: Tables exist after startup
- **WHEN** the application completes startup
- **THEN** all required tables (e.g., todos) exist in the database schema

#### Scenario: Idempotent initialization
- **WHEN** the application is restarted
- **THEN** the tables remain intact and no duplicate creation errors occur

### Requirement: Database schema matches Todo model
The todos table in the database SHALL have columns for id, title, completed, and created_at, matching the Todo model definition.

#### Scenario: Table structure is correct
- **WHEN** the database schema is inspected
- **THEN** the todos table has the expected columns with appropriate types (id INTEGER PRIMARY KEY, title VARCHAR, completed BOOLEAN, created_at DATETIME)
