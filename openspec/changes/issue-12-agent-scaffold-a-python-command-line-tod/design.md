## Design

### Architecture
- `cli.py`: argparse-based command dispatcher
- `models.py`: Todo dataclass
- `store.py`: JSON persistence (load/save)
- `service.py`: core operations (add/list/complete/delete)
- `__main__.py`: entrypoint (`python -m todo`)

### Data Model
```
Todo {
  id: int
  title: str
  completed: bool
  created_at: str  # ISO 8601
}
```

### Storage
- File: `todos.json` (default). Override via `TODO_FILE` env var.
- Format: list of Todo objects.
- On first run, create file if missing.

### CLI
- `add <title>`: creates todo
- `list`: prints all todos (id, status, title, created_at)
- `complete <id>`: marks completed
- `delete <id>`: removes item

### Error Handling
- Invalid command/args: argparse help
- Missing/invalid ID: clear message, non-zero exit
- Corrupt JSON: fail with message and backup attempt (`.bak`)

### Testing
- Unit tests for `service.py` and `store.py`
- Use temp files/fixtures to avoid touching real data

### Style
- PEP 8, type hints throughout
- Minimal dependencies (stdlib only + pytest for tests)
