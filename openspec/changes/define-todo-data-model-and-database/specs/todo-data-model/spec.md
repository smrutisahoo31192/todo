## ADDED Requirements

### Requirement: Todo model has required fields
The Todo data model SHALL define the following fields: `id` (primary key), `title` (text, required), `completed` (boolean), and `created_at` (timestamp).

#### Scenario: Create todo with all fields
- **WHEN** a new todo is created with title "Learn SQLAlchemy"
- **THEN** the system assigns an auto-incrementing id, sets completed to false, and records created_at as the current timestamp

#### Scenario: Update todo completion status
- **WHEN** a todo's completed field is set to true
- **THEN** the todo record reflects the updated status in the database

### Requirement: Todo model uses SQLAlchemy
The Todo model SHALL be implemented using SQLAlchemy ORM with appropriate column types (Integer, String, Boolean, DateTime).

#### Scenario: Model inherits from declarative base
- **WHEN** the Todo model is defined
- **THEN** it inherits from SQLAlchemy's declarative base and declares a __tablename__

#### Scenario: Fields map to database columns
- **WHEN** a todo instance is created and flushed to the database
- **THEN** all fields are persisted as columns in the todos table

### Requirement: Timestamp field auto-populated
The `created_at` field SHALL be automatically populated with the current UTC time when a todo is created.

#### Scenario: Auto-set timestamp on creation
- **WHEN** a todo record is inserted without explicitly setting created_at
- **THEN** the system automatically sets created_at to the current timestamp
