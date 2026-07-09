## Proposal

Build a minimal Python 3.10+ command-line Todo application with JSON-based persistence. The tool will support adding, listing, completing, and deleting todos via a clean CLI interface.

### Goals

- Simple, local-first task management
- Clean architecture (CLI → service → storage)
- Typed Python code following PEP 8
- Easy to extend

### Non-Goals

- No database integration
- No GUI
- No remote sync

### Outcome

Users can manage todos using commands:

- `add`
- `list`
- `complete`
- `delete`

Data is persisted in `todos.json`.
