## Architecture

- `models.py`: `Todo` dataclass + (de)serialization
- `store.py`: JSON load/save, file path resolution, corruption backup
- `service.py`: business logic (add/list/complete/delete, ID generation)
- `cli.py`: argparse interface mapping to service
- `__main__.py`: entrypoint

## Data Model

Todo:
- id: int
- title: str
- completed: bool
- created_at: ISO 8601 string

Serialization:
- `to_dict()` and `from_dict()`

## Storage

- Default file: `todos.json` in CWD
- On load:
  - If file missing: return empty list
  - If JSON invalid: rename to `todos.json.bak.<timestamp>` and return empty list
- On save: write atomic (temp file + replace)

## Service Layer

- `add_todo(title) -> Todo`
  - id = max existing id + 1 (or 1)
- `list_todos() -> list[Todo]`
- `complete_todo(id) -> Todo`
  - error if not found
- `delete_todo(id) -> None`
  - error if not found

## CLI

Commands:
- `add <title>`
- `list`
- `complete <id>`
- `delete <id> [--force]`

Behavior:
- Human-readable output
- Non-zero exit on errors
- Delete confirmation unless `--force`

## Error Handling

- Custom exceptions or `ValueError` mapped to exit code 1 with message

## Testing

- Use temp directory for `todos.json`
- Cover add/list/complete/delete and edge cases
