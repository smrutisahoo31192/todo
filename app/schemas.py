from pydantic import BaseModel, field_validator


class TodoCreate(BaseModel):
    title: str

    @field_validator("title")
    @classmethod
    def title_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("title must not be empty")
        return v


class TodoUpdate(BaseModel):
    title: str
    completed: bool

    @field_validator("title")
    @classmethod
    def title_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("title must not be empty")
        return v


class TodoPatch(BaseModel):
    title: str | None = None
    completed: bool | None = None

    @field_validator("title")
    @classmethod
    def title_not_empty(cls, v: str | None) -> str | None:
        if v is not None and not v.strip():
            raise ValueError("title must not be empty")
        return v


class TodoResponse(BaseModel):
    id: int
    title: str
    completed: bool
