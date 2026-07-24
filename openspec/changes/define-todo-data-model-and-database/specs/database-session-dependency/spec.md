## ADDED Requirements

### Requirement: FastAPI database session dependency
The application SHALL provide a FastAPI dependency function that returns a database session for route handlers to use.

#### Scenario: Route receives session via dependency injection
- **WHEN** a route handler declares a parameter with `Depends(get_db)`
- **THEN** the system injects a valid SQLAlchemy Session instance

#### Scenario: Session is cleaned up after request
- **WHEN** a route handler finishes execution
- **THEN** the database session is closed and resources are released

### Requirement: Database session lifecycle management
The session dependency SHALL properly create, use, and close database sessions to prevent resource leaks.

#### Scenario: Multiple routes can use sessions simultaneously
- **WHEN** concurrent requests arrive and each uses the session dependency
- **THEN** each request receives its own independent session

#### Scenario: Transactions are isolated
- **WHEN** a route handler makes database changes
- **THEN** changes are scoped to that handler's session and committed or rolled back appropriately

### Requirement: Session dependency configuration
The session dependency SHALL be initialized with a database engine connected to the configured SQLite database.

#### Scenario: Dependency is wired to FastAPI app
- **WHEN** the FastAPI application starts
- **THEN** the session dependency function is available for all route handlers
