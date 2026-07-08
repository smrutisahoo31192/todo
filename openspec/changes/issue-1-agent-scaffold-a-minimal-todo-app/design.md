## Design: Minimal Todo App

### Architecture
- Single-page application (SPA)
- Vanilla HTML, CSS, and JavaScript

### Components
- Input field for new todo
- Todo list container
- Each todo item:
  - Checkbox (complete)
  - Label (text)
  - Delete button

### State Management
- In-memory array of todo objects
- Structure:
  { id: string, text: string, completed: boolean }

### Behavior
- Add todo: append to list
- Complete todo: toggle completed state
- Delete todo: remove from list

### Persistence
- None (resets on refresh)

### Testing
- Manual interaction via browser
