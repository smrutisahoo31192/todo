## Design

### Overview

The system is a simple CLI application with three main layers:

- CLI Layer: Parses commands and arguments
- Service Layer: Implements todo operations
- Persistence Layer: Reads/writes JSON file

### Project Structure

```
todo_app/
  __init__.py
  cli.py
  models.py
  service.py
  storage.py

tests/
  test_service.py

todos.json
README.md
```

### Data Model

Todo:
- id: int
- title: str
- completed: bool
- created_at: str (ISO timestamp)

### CLI Design

Commands:
- add <title>
- list
- complete <id>
- delete <id>

Implementation will use `argparse` from the standard library.

### Storage

- File: `todos.json`
- Format: List of todo objects
- If file does not exist, initialize with empty list

### Error Handling

- Invalid command: show help message
- Missing ID: clear error message
- Non-existent ID: handled gracefully

### Testing

- Use `pytest`
- Focus on service layer (business logic)
- Mock or isolate file I/O where needed

### Design Decisions

- No external dependencies to keep setup simple
- Use ISO timestamps for portability
- Keep logic centralized in service layer for testability
