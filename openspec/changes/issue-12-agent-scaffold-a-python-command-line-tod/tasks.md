## Tasks

1. Project scaffold
- Create `todo/` with `__init__.py`, `__main__.py`, `cli.py`, `models.py`, `store.py`, `service.py`
- Add minimal `pyproject.toml` and `README.md`

2. Model
- Implement `Todo` dataclass
- Add `to_dict` / `from_dict`

3. Storage
- Implement load/save JSON
- Handle missing file and corruption backup
- Atomic writes

4. Service layer
- `add_todo(title) -> Todo`
- `list_todos() -> list[Todo]`
- `complete_todo(id) -> Todo`
- `delete_todo(id) -> None`
- ID generation (max+1)

5. CLI
- Argparse commands: add, list, complete, delete
- Map to service
- Implement delete confirmation prompt and `--force` flag
- Proper exit codes and messages

6. Tests
- Setup pytest
- Tests using temp file fixtures
- Edge cases: invalid ID, empty list, persistence, delete confirm/force

7. Documentation
- README: overview, install, usage, structure
- Manual test steps

8. Verification
- Run tests
- Manual CLI runs for all commands
