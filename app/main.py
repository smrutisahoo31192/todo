from fastapi import FastAPI

from app.database import engine
from app.models import Base
from app.routers import todos
Base.metadata.create_all(bind=engine)
app = FastAPI()

app.include_router(todos.router, prefix="/todos", tags=["todos"])


@app.get("/health")
def health():
    return {"status": "ok"}
