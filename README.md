# todo

A simple Todo backend built with FastAPI and SQLite.

## Local development overview

KAN-15 documents the intended full Todo application as a React frontend calling a FastAPI backend backed by SQLite. This checkout currently contains the FastAPI backend and SQLite configuration only. There is no checked-in React frontend source, `package.json`, Vite config, `Dockerfile`, or `docker-compose` workflow in this repository.

## Prerequisites

- **Python 3.11+** for the KAN-15 local development baseline. The current package metadata in `pyproject.toml` still declares `requires-python = ">=3.10"`.
- **Node.js 18+** for the React frontend described by KAN-15. This checkout does not include the frontend source or a Node package manifest.
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

## Frontend status for this checkout

KAN-15 assumes a React frontend that runs with Node 18+, but this checkout does not include frontend source files or a frontend package manifest. Because there is no verified frontend project in this repository, there is no truthful install command or React development server command to document from this branch alone.

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
