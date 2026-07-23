from typing import List

from fastapi import APIRouter, HTTPException

from app.models import TodoCreate, TodoItem, TodoUpdate
from app import store

router = APIRouter(prefix="/todos", tags=["todos"])


@router.get("", response_model=List[TodoItem])
def list_todos():
    return store.list_todos()


@router.post("", response_model=TodoItem, status_code=201)
def create_todo(data: TodoCreate):
    return store.create_todo(data)


@router.get("/{todo_id}", response_model=TodoItem)
def get_todo(todo_id: int):
    try:
        return store.get_todo(todo_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="Todo not found")


@router.put("/{todo_id}", response_model=TodoItem)
@router.patch("/{todo_id}", response_model=TodoItem)
def update_todo(todo_id: int, data: TodoUpdate):
    try:
        return store.update_todo(todo_id, data)
    except KeyError:
        raise HTTPException(status_code=404, detail="Todo not found")


@router.delete("/{todo_id}", status_code=204)
def delete_todo(todo_id: int):
    try:
        store.delete_todo(todo_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="Todo not found")
