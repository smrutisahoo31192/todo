## 1. Frontend configuration

- [x] 1.1 `frontend/.env.example`: Rename the browser API setting to `VITE_API_URL` and keep the local proxy target documented - expect frontend requests to be configurable from the environment
- [x] 1.2 `frontend/vite.config.ts`: Keep dev proxy behavior aligned with the browser API base path - expect local requests to continue reaching FastAPI

## 2. Shared API client

- [x] 2.1 `frontend/src/lib/api.ts`: Extend the shared client with Todo list and mutation helpers that use the configured base URL - expect typed requests for list, create, update, and delete
- [x] 2.2 `frontend/src/lib/api.test.ts`: Cover the new Todo client behavior and configuration handling - expect regression tests for request paths and failures

## 3. Todo UI wiring

- [x] 3.1 `frontend/src/App.tsx`: Load and render todos from the backend on page load - expect the UI to show live backend data
- [x] 3.2 `frontend/src/App.tsx`: Add create, update, and delete interactions tied to the API client - expect user actions to persist to the backend
- [x] 3.3 `frontend/src/App.tsx`: Add loading and error states for initial fetches and mutations - expect visible progress and failure feedback

## 4. UI verification

- [x] 4.1 `frontend/src/App.test.tsx`: Add coverage for Todo loading, CRUD actions, loading states, and error display - expect the UI contract to stay stable
