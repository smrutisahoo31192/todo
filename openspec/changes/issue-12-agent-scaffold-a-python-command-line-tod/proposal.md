## Summary

Scaffold a minimal Python CLI Todo application with JSON persistence and a clean layered structure (CLI, service, store, models).

## Goals

- Simple, reliable command-line workflow
- Clear separation of concerns
- Deterministic local JSON persistence
- Testable core logic

## Non-Goals

- No GUI or network sync
- No multi-user concurrency

## Acceptance Criteria

- Python 3.10+ project with package `todo/`
- CLI commands: `add`, `list`, `complete`, `delete`
- Data persisted to `todos.json`
- Todo fields: id, title, completed, created_at
- Graceful handling of invalid commands and IDs
- PEP 8 + type hints
- README with usage and structure
- Pytest tests for core flows
- Manual testing steps in README
- Delete confirmation behavior:
  - By default, `delete <id>` MUST prompt for confirmation: `Are you sure you want to delete todo <id>? [y/N]`
  - Deletion proceeds only on explicit `y`/`yes` (case-insensitive); any other input cancels with exit code 1
  - A `--force` flag bypasses the prompt and deletes immediately

## Risks

- JSON corruption; mitigated with backup on read failure

## Milestones

1. Scaffold + models
2. Store + service
3. CLI
4. Tests + docs
