from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app import storage
from app.database import get_session
from app.schemas import TodoCreate, TodoPatch, TodoResponse, TodoUpdate

router = APIRouter()


@router.get("", response_model=list[TodoResponse])
def list_todos(session: Session = Depends(get_session)) -> list[dict]:
    return storage.get_all(session)


@router.post("", response_model=TodoResponse, status_code=201)
def create_todo(body: TodoCreate, session: Session = Depends(get_session)) -> dict:
    return storage.create(session, body.title)


@router.get("/{todo_id}", response_model=TodoResponse)
def get_todo(todo_id: int, session: Session = Depends(get_session)) -> dict:
    todo = storage.get_by_id(session, todo_id)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@router.put("/{todo_id}", response_model=TodoResponse)
def update_todo(
    todo_id: int, body: TodoUpdate, session: Session = Depends(get_session)
) -> dict:
    todo = storage.update(session, todo_id, body.title, body.completed)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@router.patch("/{todo_id}", response_model=TodoResponse)
def patch_todo(
    todo_id: int, body: TodoPatch, session: Session = Depends(get_session)
) -> dict:
    fields = body.model_dump(exclude_unset=True)
    todo = storage.patch(session, todo_id, **fields)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@router.delete("/{todo_id}", status_code=204)
def delete_todo(todo_id: int, session: Session = Depends(get_session)) -> Response:
    if not storage.delete(session, todo_id):
        raise HTTPException(status_code=404, detail="Todo not found")
    return Response(status_code=204)
