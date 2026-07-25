from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.database import engine
from app.models import Base
from app.routers import todos


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    Base.metadata.create_all(bind=engine)
    yield
    # Shutdown (if needed)


app = FastAPI(lifespan=lifespan)

app.include_router(todos.router, prefix="/todos", tags=["todos"])


@app.get("/health")
def health():
    return {"status": "ok"}
