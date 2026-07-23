from datetime import datetime, timezone
from typing import Optional

from pydantic import BaseModel


class TodoItem(BaseModel):
    id: int
    title: str
    completed: bool = False
    created_at: datetime


class TodoCreate(BaseModel):
    title: str


class TodoUpdate(BaseModel):
    title: Optional[str] = None
    completed: Optional[bool] = None
