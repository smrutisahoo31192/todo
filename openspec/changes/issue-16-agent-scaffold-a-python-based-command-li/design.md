## Architecture Overview

The application will follow a simple layered structure:

- CLI Layer: Parses user input and invokes application logic
- Service Layer: Handles todo operations (add, list, complete, delete)
- Persistence Layer: Reads/writes todos from/to a JSON file

## Project Structure

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

## Data Model

Todo object fields:

- id: string (UUID)
- title: string
- completed: boolean
- created_at: ISO timestamp

## CLI Design

Commands:

- add <title>
- list
- complete <id>
- delete <id>

Use argparse for command parsing.

## Persistence

- File: todos.json in project root
- Format: list of todo objects
- Read on startup, write after each mutation

## Error Handling

- Invalid command: show help message
- Missing ID: user-friendly error
- File errors: handled gracefully with fallback to empty list

## Testing Strategy

- Unit tests for service layer
- Mock or isolate file I/O where appropriate
- Use pytest
