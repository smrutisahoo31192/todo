## Proposal

Build a minimal Python 3.10+ command-line Todo application with local JSON persistence. The CLI will support adding, listing, completing, and deleting todos. The goal is a small, well-structured, testable project with clear UX and robust error handling.

### Scope
- CLI commands: `add`, `list`, `complete`, `delete`
- JSON file storage (`todos.json`) in project root (configurable via env)
- Todo fields: id (int), title (str), completed (bool), created_at (ISO 8601)
- Graceful handling of invalid commands and IDs
- Unit tests with pytest for core logic
- README with setup, usage, structure, and manual test steps

### Non-Goals
- No GUI or web interface
- No multi-user sync or remote storage
- No advanced filtering beyond basic list

### Success Criteria
- All acceptance criteria met
- Clean project structure, PEP 8, type hints
- Passing tests and simple manual verification
