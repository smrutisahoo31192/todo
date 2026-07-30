import json
import subprocess
from pathlib import Path

import pytest


REPO_ROOT = Path(__file__).resolve().parents[1]
FRONTEND_DIR = REPO_ROOT / "frontend"


def run_frontend_command(frontend_dir: Path, *args: str) -> str:
    completed = subprocess.run(
        [*args],
        cwd=frontend_dir,
        check=False,
        capture_output=True,
        text=True,
    )

    if completed.returncode != 0:
        raise AssertionError(
            f"frontend command failed: {' '.join(args)}\n"
            f"stdout:\n{completed.stdout}\n"
            f"stderr:\n{completed.stderr}"
        )

    return completed.stdout + completed.stderr


@pytest.fixture(scope="session")
def frontend_dir() -> Path:
    assert FRONTEND_DIR.is_dir()
    return FRONTEND_DIR


@pytest.fixture(scope="session")
def frontend_dependencies(frontend_dir: Path) -> Path:
    if not (frontend_dir / "node_modules").exists():
        run_frontend_command(frontend_dir, "npm", "ci")

    return frontend_dir


def test_frontend_package_manifest_exposes_expected_workflows(frontend_dir: Path) -> None:
    package_json = json.loads((frontend_dir / "package.json").read_text())

    assert package_json["name"] == "todo-frontend"
    assert package_json["scripts"] == {
        "dev": "vite",
        "test": "vitest",
        "build": "tsc -b && vite build",
        "preview": "vite preview",
    }
    assert package_json["dependencies"] == {
        "react": "^18.3.1",
        "react-dom": "^18.3.1",
    }


def test_backend_env_example_documents_local_database_and_cors_settings() -> None:
    backend_env_example = (REPO_ROOT / ".env.example").read_text()

    assert "DATABASE_URL=sqlite:///./todo.db" in backend_env_example
    assert "CORS_ALLOW_ORIGINS=http://localhost:5173" in backend_env_example


def test_frontend_env_example_documents_local_api_url(frontend_dir: Path) -> None:
    frontend_env_example = (frontend_dir / ".env.example").read_text()

    assert "VITE_API_URL=http://localhost:8000" in frontend_env_example


def test_frontend_vitest_suite_passes(frontend_dependencies: Path) -> None:
    output = run_frontend_command(frontend_dependencies, "npm", "test", "--", "--run")

    assert "Test Files" in output
    assert "passed" in output


def test_frontend_build_succeeds(frontend_dependencies: Path) -> None:
    output = run_frontend_command(frontend_dependencies, "npm", "run", "build")

    assert "vite build" in output
    assert "dist/index.html" in output
