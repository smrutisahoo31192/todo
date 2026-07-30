import { useEffect, useMemo, useState } from 'react';
import { ApiError, getApiBaseUrl, healthApi, todosApi, type Todo } from './lib/api';
import {
  TODO_FILTER_OPTIONS,
  getVisibleTodos,
  type TodoFilter,
} from './lib/todoFilters';
import { persistTodoViewState, readStoredTodoFilter, readStoredTodoSearchText } from './lib/todoViewState';
import './App.css';

type HealthState =
  | { kind: 'loading' }
  | { kind: 'success'; status: string }
  | { kind: 'error'; message: string };

type TodosState =
  | { kind: 'loading' }
  | { kind: 'success'; todos: readonly Todo[] }
  | { kind: 'error'; message: string };

const FILTER_LABELS: Record<TodoFilter, string> = {
  all: 'All',
  active: 'Active',
  completed: 'Completed',
};

function getHealthErrorMessage(error: unknown): string {
  return error instanceof ApiError
    ? `Backend request failed (${error.status}). Start the FastAPI app and verify the frontend proxy target.`
    : 'Unable to reach the backend. Start the FastAPI app and verify the frontend environment configuration.';
}

function getTodosErrorMessage(error: unknown): string {
  return error instanceof ApiError
    ? `Todo loading failed (${error.status}). Start the FastAPI app and verify the Todo API is available.`
    : 'Unable to load todos. Start the FastAPI app and verify the frontend environment configuration.';
}

function getTodoStatusLabel(todo: Todo): string {
  return todo.completed ? 'Completed' : 'Active';
}

function App() {
  const [healthState, setHealthState] = useState<HealthState>({ kind: 'loading' });
  const [todosState, setTodosState] = useState<TodosState>({ kind: 'loading' });
  const [selectedFilter, setSelectedFilter] = useState<TodoFilter>(() => readStoredTodoFilter());
  const [searchText, setSearchText] = useState<string>(() => readStoredTodoSearchText());

  useEffect(() => {
    persistTodoViewState(selectedFilter, searchText);
  }, [searchText, selectedFilter]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadHealth(): Promise<void> {
      try {
        const response = await healthApi.check(controller.signal);

        if (!controller.signal.aborted) {
          setHealthState({ kind: 'success', status: response.status });
        }
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setHealthState({ kind: 'error', message: getHealthErrorMessage(error) });
      }
    }

    async function loadTodos(): Promise<void> {
      try {
        const todos = await todosApi.list(controller.signal);

        if (!controller.signal.aborted) {
          setTodosState({ kind: 'success', todos });
        }
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setTodosState({ kind: 'error', message: getTodosErrorMessage(error) });
      }
    }

    void loadHealth();
    void loadTodos();

    return () => {
      controller.abort();
    };
  }, []);

  const todos = todosState.kind === 'success' ? todosState.todos : [];
  const visibleTodos = useMemo(
    () => getVisibleTodos(todos, selectedFilter, searchText),
    [searchText, selectedFilter, todos],
  );
  const searchSummary = searchText.trim().length === 0 ? 'all titles' : `“${searchText.trim()}”`;

  return (
    <main className="app-shell">
      <section className="hero-card">
        <div className="hero-header">
          <div>
            <p className="eyebrow">Todo workspace</p>
            <h1>Filter and search your tasks from one client-side view</h1>
          </div>
          <div className="status-chip-group" aria-label="Backend status summary">
            <span className="status-chip">
              API base <code>{getApiBaseUrl()}</code>
            </span>
            {healthState.kind === 'success' ? (
              <span className="status-chip status-chip-success">Backend {healthState.status}</span>
            ) : null}
            {healthState.kind === 'error' ? (
              <span className="status-chip status-chip-error">Backend unavailable</span>
            ) : null}
          </div>
        </div>
        <p className="lead">
          Narrow the loaded Todo collection by completion status and title search without
          expanding the backend API. Your selected controls stay with this browser tab for
          the rest of the session.
        </p>

        <section className="todo-panel" aria-labelledby="todo-panel-title">
          <div className="todo-panel-header">
            <div>
              <h2 id="todo-panel-title">Browse todos</h2>
              <p className="panel-copy">
                Showing <strong>{visibleTodos.length}</strong> of <strong>{todos.length}</strong>{' '}
                todos while filtering by <strong>{FILTER_LABELS[selectedFilter]}</strong> and searching{' '}
                <strong>{searchSummary}</strong>.
              </p>
            </div>
            {healthState.kind === 'loading' ? <p className="status-copy">Checking FastAPI backend…</p> : null}
            {healthState.kind === 'error' ? <p className="status-copy error-copy">{healthState.message}</p> : null}
          </div>

          <div className="toolbar-grid">
            <div className="filter-group" role="group" aria-label="Filter todos by status">
              {TODO_FILTER_OPTIONS.map((filter) => {
                const isSelected = filter === selectedFilter;

                return (
                  <button
                    key={filter}
                    type="button"
                    className={`filter-chip${isSelected ? ' is-active' : ''}`}
                    aria-pressed={isSelected}
                    onClick={() => setSelectedFilter(filter)}
                  >
                    {FILTER_LABELS[filter]}
                  </button>
                );
              })}
            </div>

            <label className="search-field">
              <span className="search-label">Search todos</span>
              <input
                type="search"
                name="todo-search"
                placeholder="Search by title"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
              />
            </label>
          </div>

          {todosState.kind === 'loading' ? <p className="todo-state-message">Loading todos…</p> : null}
          {todosState.kind === 'error' ? <p className="todo-state-message error-copy">{todosState.message}</p> : null}

          {todosState.kind === 'success' && visibleTodos.length === 0 ? (
            <p className="todo-state-message">No todos match the current filter and search.</p>
          ) : null}

          {todosState.kind === 'success' && visibleTodos.length > 0 ? (
            <ul className="todo-list" aria-label="Visible todos">
              {visibleTodos.map((todo) => {
                const statusLabel = getTodoStatusLabel(todo);

                return (
                  <li key={todo.id} className="todo-list-item">
                    <div>
                      <h3>{todo.title}</h3>
                      <p>{statusLabel} task</p>
                    </div>
                    <span
                      className={`todo-badge${todo.completed ? ' todo-badge-completed' : ' todo-badge-active'}`}
                    >
                      {statusLabel}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </section>
      </section>
    </main>
  );
}

export default App;
