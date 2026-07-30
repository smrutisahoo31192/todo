from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
COMPOSE_FILE = REPO_ROOT / "docker-compose.yml"
API_DOCKERFILE = REPO_ROOT / "Dockerfile.api"
FRONTEND_DOCKERFILE = REPO_ROOT / "frontend" / "Dockerfile"
FRONTEND_VITE_CONFIG = REPO_ROOT / "frontend" / "vite.config.ts"
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
    vite_config_text = FRONTEND_VITE_CONFIG.read_text(encoding="utf-8")

    assert "      DATABASE_URL: sqlite:////workspace/todo.db" in compose_text
    assert '      WATCHFILES_FORCE_POLLING: "true"' in compose_text
    assert '      CHOKIDAR_USEPOLLING: "true"' in compose_text
    assert "      VITE_API_BASE_URL: /api" in compose_text
    assert "      VITE_API_PROXY_TARGET: http://api:8000" in compose_text
    assert "const proxyTarget = env.VITE_API_PROXY_TARGET || 'http://localhost:8000';" in vite_config_text
    assert "'/api': {" in vite_config_text
    assert "target: proxyTarget" in vite_config_text
    assert "rewrite: (path) => path.replace(/^\\/api/, '')" in vite_config_text


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
