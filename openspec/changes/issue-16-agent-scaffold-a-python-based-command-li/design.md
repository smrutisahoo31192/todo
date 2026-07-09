## Design

### Architecture

The application follows a simple layered design:

- CLI layer: Parses user input via `argparse`
- Service layer: Implements business logic
- Storage layer: Handles JSON persistence

### Data Model

Todo fields:

- id: string (UUID)
- title: string
- completed: bool
- created_at: ISO timestamp

### Validation Rules

- Todo title must not be empty or whitespace-only
- Commands must validate required arguments
- Operations on missing IDs should return clear errors

### Storage

- File: `todos.json`
- If file does not exist, initialize with empty list
- Read/write entire file per operation

### CLI Commands

#### add command

- Input: title
- Behavior:
  - Reject empty or whitespace-only titles
  - Create todo with UUID and timestamp
  - Persist to file

#### list command

- Output all todos
- Display:
  - ID
  - Title
  - Status (completed/pending)

#### complete command

- Input: id
- Behavior:
  - Mark matching todo as completed
  - Error if ID not found

#### delete command

- Input: id
- Behavior:
  - Remove todo
  - Error if ID not found

### Error Handling

- Graceful CLI messages
- No stack traces for user errors

### Testing Strategy

- Unit tests for service layer
- Mock or isolate file operations where needed
