## 1. Backend CORS and config

- [x] 1.1 Wire FastAPI CORSMiddleware in the backend startup path to allow the documented local frontend origin - expect browser requests from `http://localhost:5173` to succeed
- [x] 1.2 Add backend `.env.example` entries for `DATABASE_URL` and the CORS origin allowlist - expect local backend config to be copyable without guessing variable names

## 2. Frontend environment contract

- [x] 2.1 Add frontend `.env.example` with `VITE_API_URL` - expect the Vite app to know the backend base URL from a single documented variable
- [x] 2.2 Update frontend configuration usage to read `VITE_API_URL` - expect browser API calls to target the documented backend URL

## 3. Documentation and verification

- [x] 3.1 Update README environment setup sections for backend and frontend - expect the local setup flow and env vars to be discoverable from the repository
- [x] 3.2 Add or update tests covering CORS origin handling and env-driven configuration - expect regressions in the new contract to be caught automatically
