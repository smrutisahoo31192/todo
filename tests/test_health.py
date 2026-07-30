from fastapi.testclient import TestClient
from app.main import app, create_app

client = TestClient(app)


def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


def test_health_allows_browser_requests_from_local_frontend_origin() -> None:
    response = client.get(
        "/health",
        headers={"Origin": "http://localhost:5173"},
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://localhost:5173"


def test_cors_preflight_allows_local_frontend_origin() -> None:
    response = client.options(
        "/todos",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://localhost:5173"
    assert "POST" in response.headers["access-control-allow-methods"]


def test_create_app_reads_cors_allow_origins_from_env(monkeypatch) -> None:
    monkeypatch.setenv(
        "CORS_ALLOW_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:4173",
    )
    custom_client = TestClient(create_app())

    response = custom_client.get(
        "/health",
        headers={"Origin": "http://127.0.0.1:4173"},
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://127.0.0.1:4173"
