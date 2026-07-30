from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, get_cors_allow_origins
from app.models import Base
from app.routers import todos


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    # Startup
    Base.metadata.create_all(bind=engine)
    yield
    # Shutdown (if needed)


def create_app() -> FastAPI:
    app = FastAPI(lifespan=lifespan)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=get_cors_allow_origins(),
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(todos.router, prefix="/todos", tags=["todos"])

    @app.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok"}

    return app


app = create_app()
