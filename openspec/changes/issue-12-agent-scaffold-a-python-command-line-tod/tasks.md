## Tasks

1. Project scaffold
- Create package `todo/` with `__init__.py`, `__main__.py`, `cli.py`, `models.py`, `store.py`, `service.py`
- Add `pyproject.toml` (optional minimal) and `README.md`

2. Model
- Implement `Todo` dataclass with fields and serialization helpers

3. Storage
- Implement load/save JSON in `store.py`
- Handle file creation and corruption backup

4. Service layer
- Implement `add_todo(title) -> Todo`
- Implement `list_todos() -> list[Todo]`
- Implement `complete_todo(id) -> Todo`
- Implement `delete_todo(id) -> None`
- ID generation (incremental, max+1)

5. CLI
- Argparse commands: add, list, complete, delete
- Map CLI to service functions
- Human-readable output and exit codes

6. Tests
- Add pytest
- Tests for add/list/complete/delete using temp file fixtures
- Edge cases: invalid ID, empty list, persistence

7. Documentation
- README with overview, install, usage examples, structure
- Manual test steps

8. Verification
- Run tests locally
- Manual run of each command
