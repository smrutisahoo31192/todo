## Tasks

### 1. Project Setup
- Create Python package `todo/`
- Add entry point script (`__main__.py` or `cli.py`)
- Ensure Python 3.10+ compatibility

### 2. Data Model
- Implement Todo model with type hints
- Fields: id, title, completed, created_at
- Enforce non-empty title

### 3. Storage Layer
- Implement JSON read/write
- Initialize file if missing

### 4. Service Layer
- Implement functions:
  - add_todo
  - list_todos
  - complete_todo
  - delete_todo
- Ensure unique ID generation (UUID4)

### 5. CLI Layer
- Implement argparse CLI
- Map commands to service functions
- Add readable output formatting

### 6. Error Handling
- Handle invalid IDs
- Handle empty list
- Handle empty title

### 7. Tests
- Setup pytest
- Unit tests for service layer

### 8. Documentation
- Write README:
  - Overview
  - Installation
  - Usage examples
  - Manual testing steps
