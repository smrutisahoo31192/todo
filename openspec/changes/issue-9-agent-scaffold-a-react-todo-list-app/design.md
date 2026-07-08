## Design

### Architecture
- Vite + React (latest stable)
- Functional components with hooks
- Single root component managing todos

### Data Model
- Todo
  - id: string
  - text: string
  - completed: boolean

### State Management
- useState in App component
- Array of todos

### UI Components
- App
  - Input field + Add button
  - TodoList
    - TodoItem
      - Checkbox (toggle complete)
      - Text
      - Delete button

### Behavior
- Add: append new todo with unique id
- Toggle: flip completed flag
- Delete: remove todo from list

### Testing Approach
- Manual test steps documented in README
- Optional: basic unit test for reducer-like logic (if added)

### Tradeoffs
- No persistence to keep scope minimal
- Local state instead of global store for simplicity
