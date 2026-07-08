## Architecture
Single-page application (SPA) using:
- index.html
- app.js
- styles.css

## Data Model
Todo:
- id: string
- text: string
- completed: boolean

Stored in localStorage under key `todos`.

## Behavior
- Add todo via input + button
- Toggle complete via checkbox
- Delete via button
- Persist changes to localStorage

## Rationale
Plain JS keeps setup minimal and suitable for quick agent testing.
