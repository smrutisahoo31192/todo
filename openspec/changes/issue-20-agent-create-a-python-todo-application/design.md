## Design: Python CLI Todo Application

### Architecture Overview
Four layers:
- Model: Todo entity
- Storage: JSON persistence
- Service: Business logic
- CLI: argparse interface

### Todo Model
Fields:
- id: str (UUID4)
- title: str (non-empty)
- completed: bool
- created_at: str (ISO 8601)

Validation:
- Reject empty or whitespace-only titles

### Storage Layer
File: `todos.json`

Responsibilities:
- Read list of todos
- Write list of todos
- Initialize file if missing

Format:
Array of todo objects

### Service Layer
Functions:
- add_todo(title: str) -> dict
- list_todos() -> list[dict]
- complete_todo(todo_id: str) -> dict
- delete_todo(todo_id: str) -> None

Behavior:
- Generate UUID for new todos
- Raise error for missing IDs

### CLI Layer
Commands:
- add <title>
- list
- complete <id>
- delete <id>

Output:
- Human-readable list with status markers

### Error Handling
- Invalid ID: clear error message
- Empty list: friendly message
- Empty title: reject with message

### Testing
- Pytest for service layer
- Mock storage where appropriate
