## 1. Compose and container setup

- [x] 1.1 `docker-compose.yml`: define api/frontend services to start the full stack - expect `docker compose up` to launch both containers
- [x] 1.2 `backend/Dockerfile` or project-root backend Dockerfile: install Python dependencies and run FastAPI in reload mode - expect the API container to boot without host Python installed
- [x] 1.3 `frontend/Dockerfile` or frontend dev service config: install Node dependencies and run Vite dev server - expect the frontend container to boot without host Node installed

## 2. Development mounts and service wiring

- [x] 2.1 `docker-compose.yml`: add bind mounts for backend and frontend source code - expect hot reload on file changes
- [x] 2.2 `docker-compose.yml`: configure ports and Compose networking for API 8000 and frontend 5173 - expect both services reachable from the host
- [x] 2.3 `docker-compose.yml` or service env config: set frontend API target to the backend service name - expect browser requests to reach the API inside Compose

## 3. Documentation and validation

- [x] 3.1 `README.md`: document the Docker Compose local development workflow - expect developers to have one clear `docker compose up` command
- [x] 3.2 Verify the Compose configuration starts both services successfully - expect local dev startup to match the new spec
