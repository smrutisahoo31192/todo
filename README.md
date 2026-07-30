# todo

A simple Todo application with a FastAPI backend, SQLite persistence, and a Vite + React frontend workspace.

## Local development overview

KAN-15 documents the intended full Todo application as a React frontend calling a FastAPI backend backed by SQLite. This checkout now includes the FastAPI backend plus a dedicated `frontend/` Vite React workspace for future Todo UI work. Docker assets are still not present in this repository.

## Prerequisites

- **Python 3.11+** for the KAN-15 local development baseline. The current package metadata in `pyproject.toml` still declares `requires-python = ">=3.10"`.
- **Node.js 18+** for the checked-in Vite React frontend workspace under `frontend/`.
- **Docker** is optional for teams that run the stack in containers, but this repository does not include Docker assets.

## Architecture

The intended local application flow is:

`React frontend -> FastAPI backend -> SQLite database`

- **React frontend**: the user interface for creating and updating todos.
- **FastAPI backend**: serves the Todo API from `app.main:app`, exposes `/health`, and mounts the `/todos` routes.
- **SQLite database**: stores Todo records and is configured through `DATABASE_URL`, which defaults to `sqlite:///./todo.db`.

On backend startup, the application creates its SQLAlchemy tables automatically.

## Backend setup and run

### Install dependencies

Install the application package:

```bash
pip install -e .
```

If you also want to run the pytest suite locally, install the development extras:

```bash
pip install -e ".[dev]"
```

### Configure environment variables

Create a local `.env` file from the checked-in example:

```bash
cp .env.example .env
```

#### Environment variables

- **`DATABASE_URL`** (optional): SQLite database location
  - Default: `sqlite:///./todo.db` (in the project root)
  - Example: `DATABASE_URL=sqlite:////tmp/todo.db` (absolute path)
  - The `.env` file is not tracked by git and will not be committed

### Start the FastAPI server

```bash
uvicorn app.main:app --reload
```

The backend will be available at `http://localhost:8000`.

### Interactive API documentation

FastAPI serves the interactive API docs at:

- `http://localhost:8000/docs`

## Frontend setup and run

### Install frontend dependencies

```bash
cd frontend
npm install
```

### Configure frontend environment

Create a local frontend environment file from the checked-in example:

```bash
cp frontend/.env.example frontend/.env.local
```

#### Frontend environment variables

- **`VITE_API_BASE_URL`**: base URL used by the browser app for API requests
  - Default: `/api`
  - Use `/api` together with the Vite dev proxy for local development
- **`VITE_API_PROXY_TARGET`**: backend origin that the Vite development server proxies `/api/*` requests to
  - Default: `http://localhost:8000`
  - Change this when pointing the frontend at a different local FastAPI server

### Start the frontend development server

```bash
cd frontend
npm run dev
```

The frontend dev server will be available at `http://localhost:5173` by default.

### Build and preview the frontend

```bash
cd frontend
npm run build
npm run preview
```

The starter shell performs a backend health check through the shared frontend API client so developers can confirm the React app is wired to FastAPI.

## Docker status for this checkout

Docker support is optional in KAN-15, but no Docker workflow files are present in this repository snapshot.

## API Endpoints

- `GET /health` - Health check
- `GET /todos` - List all todos
- `POST /todos` - Create a new todo
- `GET /todos/{id}` - Get a specific todo
- `PUT /todos/{id}` - Update a todo (full replacement)
- `PATCH /todos/{id}` - Partially update a todo
- `DELETE /todos/{id}` - Delete a todo

## Testing

```bash
pytest
```
