# Use the shared venv when available, fall back to PATH python
PYTHON ?= $(or $(wildcard /home/node/.venv-opencode/bin/python),python3)

.PHONY: serve install test

install:
	$(PYTHON) -m pip install -e ".[dev]"

serve:
	$(PYTHON) -m uvicorn app.main:app --host 0.0.0.0 --port 8000

test:
	$(PYTHON) -m pytest
