from fastapi import FastAPI

from app.routers import todos

app = FastAPI()

app.include_router(todos.router)


@app.get("/health")
def health():
    return {"status": "ok"}
