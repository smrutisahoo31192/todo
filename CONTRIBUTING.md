# Contributing

Thanks for helping improve the Todo app. This document covers local setup, branch naming, and the pull request workflow.

## Local setup

### Prerequisites

- **Python 3.11+** (`pyproject.toml` currently declares `>=3.10`)
- **Node.js 18+** and npm
- **Git**

### Backend

```bash
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -e ".[dev]"
cp .env.example .env
uvicorn app.main:app --reload
```

The API runs at `http://localhost:8000`, with interactive docs at `http://localhost:8000/docs`. `DATABASE_URL` defaults to `sqlite:///./todo.db`; both `.env` and `todo.db` are gitignored, so do not commit them.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

The dev server runs at `http://localhost:5173`. `VITE_API_BASE_URL` defaults to `/api` and `VITE_API_PROXY_TARGET` to `http://localhost:8000`. The generated `.env.local`, `node_modules/`, and `dist/` files are gitignored.

There are no Docker assets in this checkout, so run the two processes locally as above.

### Tests and checks

Run the backend suite from the repository root and the frontend suite/build from `frontend/`:

```bash
pytest
cd frontend
npm test -- --run
npm run build
```

## Branch naming

Start each change from an up-to-date `main` and use a dedicated branch:

```
<type>/KAN-<ticket>
```

- `feature/` for new functionality (for example, `feature/KAN-9`)
- `fix/` for bug fixes
- `docs/`, `chore/`, or `refactor/` for non-feature work
- Include the tracker ticket when one exists; use lowercase and hyphens for any extra description
- Avoid committing directly to `main`

```bash
git switch main
git pull --ff-only
git switch -c feature/KAN-9
```

## Opening a pull request

1. Keep the branch focused on one change and commit with clear, descriptive messages.
2. Run `pytest`, `npm test -- --run`, and `npm run build` before pushing.
3. Push the branch to `origin`:
   ```bash
   git push -u origin feature/KAN-9
   ```
4. Open a pull request against `main` on GitHub using the "Compare & pull request" prompt or the repository's PR page.
5. Use a title such as `KAN-9: Add todo filtering`, and describe what changed, why, how you tested it, and any related ticket or issue. Include screenshots for UI changes.
6. Make sure the checks pass, respond to review feedback with additional commits, and keep the PR up to date with `main` until it is merged.
