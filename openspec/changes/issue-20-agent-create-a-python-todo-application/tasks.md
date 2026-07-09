## Tasks

### 1. Project Setup

- Create Python package structure (`todo/`)
- Add entry point script
- Ensure Python 3.10+ compatibility

### 2. Data Model

- Implement Todo model with type hints
- Include ID, title, completed flag, and timestamp

### 3. Storage Layer

- Implement JSON read/write logic
- Handle missing file initialization

### 4. Service Layer

- Implement functions:
  - add_todo
  - list_todos
  - complete_todo
  - delete_todo
- Ensure unique ID generation

### 5. CLI Layer

- Implement argparse-based CLI
- Map commands to service functions
- Add helpful output formatting

### 6. Error Handling

- Handle invalid IDs
- Handle empty list scenarios

### 7. Tests

- Add pytest setup
- Write unit tests for service layer

### 8. Documentation

- Write README with:
  - Overview
  - Installation
  - Usage examples
  - Manual testing steps
