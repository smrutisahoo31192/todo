from fastapi import APIRouter, HTTPException, Response

from app import storage
from app.schemas import TodoCreate, TodoPatch, TodoResponse, TodoUpdate

router = APIRouter()


@router.get("", response_model=list[TodoResponse])
def list_todos() -> list[dict]:
    return storage.get_all()


@router.post("", response_model=TodoResponse, status_code=201)
def create_todo(body: TodoCreate) -> dict:
    return storage.create(body.title)


@router.get("/{todo_id}", response_model=TodoResponse)
def get_todo(todo_id: int) -> dict:
    todo = storage.get_by_id(todo_id)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@router.put("/{todo_id}", response_model=TodoResponse)
def update_todo(todo_id: int, body: TodoUpdate) -> dict:
    todo = storage.update(todo_id, body.title, body.completed)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@router.patch("/{todo_id}", response_model=TodoResponse)
def patch_todo(todo_id: int, body: TodoPatch) -> dict:
    fields = body.model_dump(exclude_unset=True)
    todo = storage.patch(todo_id, **fields)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@router.delete("/{todo_id}", status_code=204)
def delete_todo(todo_id: int) -> Response:
    if not storage.delete(todo_id):
        raise HTTPException(status_code=404, detail="Todo not found")
    return Response(status_code=204)
