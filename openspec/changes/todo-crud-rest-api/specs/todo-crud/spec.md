## ADDED Requirements

### Requirement: List all todos
The system SHALL return all stored todo items as a JSON array when the client sends `GET /todos`. The response status SHALL be 200 OK. When no todos exist, the response SHALL be an empty array.

#### Scenario: Empty store
- **WHEN** a `GET /todos` request is made and no todos exist
- **THEN** the system responds with `200 OK` and body `[]`

#### Scenario: Store has items
- **WHEN** a `GET /todos` request is made and one or more todos exist
- **THEN** the system responds with `200 OK` and a JSON array containing all todos, each with `id`, `title`, and `completed` fields

---

### Requirement: Create a todo
The system SHALL create a new todo item when the client sends `POST /todos` with a valid JSON body containing `title` (non-empty string). The system SHALL assign a unique integer `id` and default `completed` to `false`. The response status SHALL be 201 Created and the body SHALL contain the created item.

#### Scenario: Valid creation
- **WHEN** a `POST /todos` request is made with body `{"title": "Buy milk"}`
- **THEN** the system responds with `201 Created` and body `{"id": <int>, "title": "Buy milk", "completed": false}`

#### Scenario: Missing title
- **WHEN** a `POST /todos` request is made with body `{}`
- **THEN** the system responds with `422 Unprocessable Entity`

#### Scenario: Empty title string
- **WHEN** a `POST /todos` request is made with body `{"title": ""}`
- **THEN** the system responds with `422 Unprocessable Entity`

---

### Requirement: Get a single todo
The system SHALL return the todo item with the given `id` when the client sends `GET /todos/{id}`. The response status SHALL be 200 OK. If no todo with that `id` exists, the system SHALL respond with 404 Not Found.

#### Scenario: Existing todo
- **WHEN** a `GET /todos/{id}` request is made and a todo with that `id` exists
- **THEN** the system responds with `200 OK` and the matching todo object

#### Scenario: Non-existent todo
- **WHEN** a `GET /todos/{id}` request is made and no todo with that `id` exists
- **THEN** the system responds with `404 Not Found`

---

### Requirement: Update a todo (full replacement)
The system SHALL fully replace the todo item with the given `id` when the client sends `PUT /todos/{id}` with a valid JSON body containing both `title` and `completed`. The response status SHALL be 200 OK and the body SHALL contain the updated item. If no todo with that `id` exists, the system SHALL respond with 404 Not Found.

#### Scenario: Valid full update
- **WHEN** a `PUT /todos/{id}` request is made with body `{"title": "Read book", "completed": true}` and the todo exists
- **THEN** the system responds with `200 OK` and the todo now has `title="Read book"` and `completed=true`

#### Scenario: Full update on non-existent todo
- **WHEN** a `PUT /todos/{id}` request is made and no todo with that `id` exists
- **THEN** the system responds with `404 Not Found`

#### Scenario: Missing required field in PUT
- **WHEN** a `PUT /todos/{id}` request is made with body `{"title": "Read book"}` (missing `completed`)
- **THEN** the system responds with `422 Unprocessable Entity`

---

### Requirement: Partially update a todo
The system SHALL apply partial updates to a todo item when the client sends `PATCH /todos/{id}` with a JSON body containing one or more of `title` and `completed`. Only the provided fields SHALL be modified; unprovided fields SHALL retain their current values. The response status SHALL be 200 OK. If no todo with that `id` exists, the system SHALL respond with 404 Not Found.

#### Scenario: Partial update title only
- **WHEN** a `PATCH /todos/{id}` request is made with body `{"title": "New title"}` and the todo exists
- **THEN** the system responds with `200 OK`, `title` is updated, and `completed` retains its previous value

#### Scenario: Partial update completed only
- **WHEN** a `PATCH /todos/{id}` request is made with body `{"completed": true}` and the todo exists
- **THEN** the system responds with `200 OK`, `completed` is `true`, and `title` retains its previous value

#### Scenario: Partial update on non-existent todo
- **WHEN** a `PATCH /todos/{id}` request is made and no todo with that `id` exists
- **THEN** the system responds with `404 Not Found`

---

### Requirement: Delete a todo
The system SHALL remove the todo item with the given `id` when the client sends `DELETE /todos/{id}`. The response status SHALL be 204 No Content with an empty body. If no todo with that `id` exists, the system SHALL respond with 404 Not Found.

#### Scenario: Delete existing todo
- **WHEN** a `DELETE /todos/{id}` request is made and the todo exists
- **THEN** the system responds with `204 No Content` and the todo is no longer retrievable

#### Scenario: Delete non-existent todo
- **WHEN** a `DELETE /todos/{id}` request is made and no todo with that `id` exists
- **THEN** the system responds with `404 Not Found`
