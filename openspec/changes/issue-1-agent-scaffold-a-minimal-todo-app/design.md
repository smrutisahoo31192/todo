## Overview
A minimal client-side todo app using vanilla JavaScript. Data persisted in `localStorage`. Optional Node script serves static files.

## Architecture
- `index.html`: structure and basic styles
- `app.js`: state management and DOM interactions
- `styles.css`: minimal styling
- `server.js` (optional): static file server

## Data Model
Todo:
- id: string
- text: string
- completed: boolean

## State
- In-memory array synced to `localStorage` under key `todos`

## Behaviors
- Add: create todo with unique id, append to list
- Toggle complete: flip `completed`
- Delete: remove by id

## Rendering
- Re-render list on every state change
- Use event delegation for actions

## Accessibility
- Keyboard submit for add
- Buttons with labels for actions

## Testing
- Manual steps documented in README
