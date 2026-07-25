# todo

A simple Todo API built with FastAPI and SQLite.

## Setup

### Installation

```bash
pip install -e .
```

### Configuration

The application uses environment variables for configuration. Create a `.env` file in the project root:

```bash
cp .env.example .env
```

#### Environment Variables

- **`DATABASE_URL`** (optional): SQLite database location
  - Default: `sqlite:///./todo.db` (in project root)
  - Example: `DATABASE_URL=sqlite:////tmp/todo.db` (absolute path)
  - The `.env` file is not tracked by git and will not be committed

### Running the Server

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`.

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
