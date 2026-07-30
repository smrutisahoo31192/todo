import shutil
import socket
import subprocess
import time
import uuid
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import urlopen

import pytest


REPO_ROOT = Path(__file__).resolve().parents[1]
COMPOSE_FILE = REPO_ROOT / "docker-compose.yml"
API_DOCKERFILE = REPO_ROOT / "Dockerfile.api"
FRONTEND_DOCKERFILE = REPO_ROOT / "frontend" / "Dockerfile"
README_FILE = REPO_ROOT / "README.md"


def test_compose_stack_starts_api_and_frontend_services() -> None:
    compose_text = COMPOSE_FILE.read_text(encoding="utf-8")

    assert "services:" in compose_text
    assert "  api:\n    build:\n      context: .\n      dockerfile: Dockerfile.api" in compose_text
    assert "  frontend:\n    build:\n      context: ./frontend\n      dockerfile: Dockerfile" in compose_text
    assert "    depends_on:\n      - api" in compose_text


def test_compose_stack_exposes_expected_ports_and_hot_reload_mounts() -> None:
    compose_text = COMPOSE_FILE.read_text(encoding="utf-8")

    assert '      - "8000:8000"' in compose_text
    assert '      - "5173:5173"' in compose_text
    assert "      - .:/workspace" in compose_text
    assert "      - ./frontend:/workspace/frontend" in compose_text
    assert "      - frontend_node_modules:/workspace/frontend/node_modules" in compose_text
    assert "volumes:\n  frontend_node_modules:" in compose_text


def test_compose_stack_uses_service_name_routing_for_frontend_api_requests() -> None:
    compose_text = COMPOSE_FILE.read_text(encoding="utf-8")

    assert "      DATABASE_URL: sqlite:////workspace/todo.db" in compose_text
    assert '      WATCHFILES_FORCE_POLLING: "true"' in compose_text
    assert '      CHOKIDAR_USEPOLLING: "true"' in compose_text
    assert "      VITE_API_BASE_URL: /api" in compose_text
    assert "      VITE_API_PROXY_TARGET: http://api:8000" in compose_text


def test_api_dockerfile_runs_documented_fastapi_entrypoint_in_reload_mode() -> None:
    dockerfile_text = API_DOCKERFILE.read_text(encoding="utf-8")

    assert "FROM python:3.11-slim" in dockerfile_text
    assert "WORKDIR /workspace" in dockerfile_text
    assert "COPY pyproject.toml README.md ./" in dockerfile_text
    assert "COPY app ./app" in dockerfile_text
    assert "RUN pip install --no-cache-dir -e ." in dockerfile_text
    assert "EXPOSE 8000" in dockerfile_text
    assert 'CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]' in dockerfile_text


def test_frontend_dockerfile_runs_vite_dev_server_inside_container() -> None:
    dockerfile_text = FRONTEND_DOCKERFILE.read_text(encoding="utf-8")

    assert "FROM node:20-bookworm-slim" in dockerfile_text
    assert "WORKDIR /workspace/frontend" in dockerfile_text
    assert "COPY package.json package-lock.json ./" in dockerfile_text
    assert "RUN npm ci" in dockerfile_text
    assert "EXPOSE 5173" in dockerfile_text
    assert 'CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]' in dockerfile_text


def test_readme_documents_the_single_command_compose_workflow() -> None:
    readme_text = README_FILE.read_text(encoding="utf-8")

    assert "## Docker Compose local development" in readme_text
    assert "docker compose up" in readme_text
    assert "http://localhost:8000" in readme_text
    assert "http://localhost:5173" in readme_text
    assert "VITE_API_PROXY_TARGET=http://api:8000" in readme_text


def _docker_compose_available() -> bool:
    if shutil.which("docker") is None:
        return False

    completed = subprocess.run(
        ["docker", "compose", "version"],
        cwd=REPO_ROOT,
        check=False,
        capture_output=True,
        text=True,
    )
    return completed.returncode == 0


def _port_is_available(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            sock.bind(("127.0.0.1", port))
        except OSError:
            return False
    return True


def _wait_for_url(url: str, *, timeout_seconds: float, expected_text: str) -> None:
    deadline = time.monotonic() + timeout_seconds
    last_error: str | None = None

    while time.monotonic() < deadline:
        try:
            with urlopen(url, timeout=5) as response:
                body = response.read().decode("utf-8")
            if expected_text in body:
                return
            last_error = f"response from {url} did not contain {expected_text!r}: {body!r}"
        except (HTTPError, URLError) as error:
            last_error = str(error)

        time.sleep(1)

    raise AssertionError(last_error or f"timed out waiting for {url}")


@pytest.mark.skipif(not _docker_compose_available(), reason="docker compose is unavailable")
def test_docker_compose_up_starts_both_services_and_frontend_proxy() -> None:
    assert _port_is_available(8000), "port 8000 must be free before running docker compose"
    assert _port_is_available(5173), "port 5173 must be free before running docker compose"

    project_name = f"kan13-{uuid.uuid4().hex[:8]}"

    try:
        up_result = subprocess.run(
            ["docker", "compose", "-p", project_name, "up", "--build", "-d"],
            cwd=REPO_ROOT,
            check=False,
            capture_output=True,
            text=True,
            timeout=600,
        )
        assert up_result.returncode == 0, (
            "docker compose up failed\n"
            f"stdout:\n{up_result.stdout}\n"
            f"stderr:\n{up_result.stderr}"
        )

        _wait_for_url(
            "http://127.0.0.1:8000/health",
            timeout_seconds=120,
            expected_text='{"status":"ok"}',
        )
        _wait_for_url(
            "http://127.0.0.1:5173/",
            timeout_seconds=120,
            expected_text="Todo frontend bootstrap",
        )
        _wait_for_url(
            "http://127.0.0.1:5173/api/health",
            timeout_seconds=120,
            expected_text='{"status":"ok"}',
        )
    finally:
        logs_result = subprocess.run(
            ["docker", "compose", "-p", project_name, "logs", "--no-color"],
            cwd=REPO_ROOT,
            check=False,
            capture_output=True,
            text=True,
            timeout=120,
        )
        if logs_result.stdout:
            print(logs_result.stdout)
        if logs_result.stderr:
            print(logs_result.stderr)

        subprocess.run(
            ["docker", "compose", "-p", project_name, "down", "-v", "--remove-orphans"],
            cwd=REPO_ROOT,
            check=False,
            capture_output=True,
            text=True,
            timeout=120,
        )
