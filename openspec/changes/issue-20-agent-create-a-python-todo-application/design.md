## Design

### Overview

The application will be a CLI-based Python program structured into small modules for clarity and testability.

### Project Structure

- `todo/`
  - `__init__.py`
  - `models.py` (Todo data model)
  - `storage.py` (JSON persistence)
  - `service.py` (business logic)
  - `cli.py` (command-line interface)
- `tests/`
  - `test_service.py`

### Data Model

Each todo will contain:

- `id`: unique integer
- `title`: string
- `completed`: boolean
- `created_at`: ISO timestamp string

### Storage

- File: `todos.json` in project root
- Read/write handled via `storage.py`
- If file does not exist, initialize with empty list

### CLI

Use `argparse` to support commands:

- `add <title>`
- `list`
- `complete <id>`
- `delete <id>`

### Error Handling

- Invalid commands handled by argparse
- Missing or invalid IDs return user-friendly messages

### Testing

- Use `pytest`
- Focus on service layer logic (add, complete, delete)
- Use temporary files or mocks for storage
