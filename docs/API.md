# Todo API

Base URL: `http://localhost:8000`

The endpoints below are defined in `app/routers/todos.py` and mounted at `/todos` by `app/main.py`. Requests and responses use JSON, except `DELETE`, which returns an empty body on success.

A todo object has the following shape:

```json
{
  "id": 1,
  "title": "Buy milk",
  "completed": false
}
```

Titles must be non-empty. A title containing only whitespace is rejected with `422 Unprocessable Entity`.

## `GET /todos`

List all todos.

```bash
curl -i http://localhost:8000/todos
```

Example `200 OK` response:

```json
[
  {
    "id": 1,
    "title": "Buy milk",
    "completed": false
  },
  {
    "id": 2,
    "title": "Read book",
    "completed": true
  }
]
```

An empty database returns `[]`.

## `POST /todos`

Create a todo. New todos start with `completed: false`.

Request body: `title` (string, required, non-empty).

```bash
curl -i -X POST http://localhost:8000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy milk"}'
```

Example `201 Created` response:

```json
{
  "id": 1,
  "title": "Buy milk",
  "completed": false
}
```

A missing or empty `title` returns `422 Unprocessable Entity`.

## `GET /todos/{todo_id}`

Get a todo by its integer ID.

```bash
curl -i http://localhost:8000/todos/1
```

Example `200 OK` response:

```json
{
  "id": 1,
  "title": "Buy milk",
  "completed": false
}
```

If no todo has that ID, the response is `404 Not Found`:

```json
{
  "detail": "Todo not found"
}
```

## `PUT /todos/{todo_id}`

Replace a todo. Both fields are required: `title` (string, non-empty) and `completed` (boolean).

```bash
curl -i -X PUT http://localhost:8000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy oat milk", "completed": true}'
```

Example `200 OK` response:

```json
{
  "id": 1,
  "title": "Buy oat milk",
  "completed": true
}
```

A missing field or empty `title` returns `422 Unprocessable Entity`. An unknown `todo_id` returns `404 Not Found`.

## `PATCH /todos/{todo_id}`

Partially update a todo. Both fields are optional: `title` (string, non-empty) and `completed` (boolean). Omitted or `null` fields are left unchanged.

```bash
curl -i -X PATCH http://localhost:8000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

Example `200 OK` response:

```json
{
  "id": 1,
  "title": "Buy milk",
  "completed": true
}
```

Patching only the title:

```bash
curl -i -X PATCH http://localhost:8000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy oat milk"}'
```

An empty `title` returns `422 Unprocessable Entity`. An unknown `todo_id` returns `404 Not Found`.

## `DELETE /todos/{todo_id}`

Delete a todo by its integer ID.

```bash
curl -i -X DELETE http://localhost:8000/todos/1
```

Success returns `204 No Content` with an empty body. An unknown `todo_id` returns `404 Not Found`:

```json
{
  "detail": "Todo not found"
}
```
