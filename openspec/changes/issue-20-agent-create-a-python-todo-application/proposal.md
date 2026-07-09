## Proposal: Python CLI Todo Application

### Summary
Build a minimal Python 3.10+ command-line todo app with JSON persistence. Users can add, list, complete, and delete todos.

### Goals
- Simple CLI with clear commands
- Local persistence via `todos.json`
- Clean layered design (model, storage, service, CLI)
- Type hints and PEP 8 compliance

### Non-Goals
- No GUI or web interface
- No multi-user sync

### Acceptance Criteria
- Commands: `add`, `list`, `complete`, `delete`
- Each todo has id, title, completed, created_at
- Graceful handling of invalid IDs and empty states
- Unit tests for service layer
- README with usage and manual testing
