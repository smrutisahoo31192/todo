from fastapi import FastAPI

from app.db.base import Base
from app.db.session import engine
from app.routers import todos

# Import all models to ensure they are registered with the Base
from app.models.todo import Todo  # noqa: F401

# Create database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(todos.router, prefix="/todos", tags=["todos"])


@app.get("/health")
def health():
    return {"status": "ok"}
