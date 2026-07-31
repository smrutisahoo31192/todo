import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { ApiError, getApiBaseUrl, todoApi, type Todo } from './lib/api';
import './App.css';
import { TodoListSection } from './components/TodoListSection';

type TodosState =
  | { kind: 'loading' }
  | { kind: 'ready' }
  | { kind: 'error'; message: string };

type MutationState =
  | { kind: 'idle' }
  | { kind: 'creating' }
  | { kind: 'updating'; todoId: number }
  | { kind: 'deleting'; todoId: number };

const formatApiError = (error: unknown, actionLabel: string): string => {
  if (error instanceof ApiError) {
    return `${actionLabel} failed (${error.status}). Check the FastAPI backend and try again.`;
  }

  return `${actionLabel} failed. Check the backend connection and try again.`;
};

const buildDraftTitles = (nextTodos: readonly Todo[]): Record<number, string> =>
  nextTodos.reduce<Record<number, string>>((draftMap, todo) => {
    draftMap[todo.id] = todo.title;
    return draftMap;
  }, {});

function App() {
  const [todos, setTodos] = useState<readonly Todo[]>([]);
  const [draftTitles, setDraftTitles] = useState<Record<number, string>>({});
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [todosState, setTodosState] = useState<TodosState>({ kind: 'loading' });
  const [mutationState, setMutationState] = useState<MutationState>({ kind: 'idle' });
  const [mutationMessage, setMutationMessage] = useState<string | null>(null);

  const isMutating = mutationState.kind !== 'idle';

  const mutationStatusLabel = useMemo(() => {
    switch (mutationState.kind) {
      case 'idle':
        return null;
      case 'creating':
        return 'Creating todo…';
      case 'updating':
        return 'Saving todo…';
      case 'deleting':
        return 'Deleting todo…';
    }
  }, [mutationState]);

  const syncDrafts = (nextTodos: readonly Todo[]): void => {
    setDraftTitles(buildDraftTitles(nextTodos));
  };

  const replaceTodo = (nextTodo: Todo): void => {
    const nextTodos = todos.map((currentTodo) => (currentTodo.id === nextTodo.id ? nextTodo : currentTodo));

    setTodos(nextTodos);
    syncDrafts(nextTodos);
  };

  const loadTodos = async (signal?: AbortSignal): Promise<void> => {
    setTodosState({ kind: 'loading' });

    try {
      const nextTodos = await todoApi.list(signal);

      if (signal?.aborted) {
        return;
      }

      setTodos(nextTodos);
      syncDrafts(nextTodos);
      setTodosState({ kind: 'ready' });
    } catch (error) {
      if (signal?.aborted) {
        return;
      }

      setTodosState({ kind: 'error', message: formatApiError(error, 'Loading todos') });
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    void loadTodos(controller.signal);

    return () => {
      controller.abort();
    };
  }, []);

  const handleCreateTodo = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const trimmedTitle = newTodoTitle.trim();

    if (trimmedTitle.length === 0) {
      setMutationMessage('Enter a todo title before creating a task.');
      return;
    }

    setMutationState({ kind: 'creating' });
    setMutationMessage(null);

    try {
      const createdTodo = await todoApi.create({ title: trimmedTitle });
      const nextTodos = [...todos, createdTodo];

      setTodos(nextTodos);
      syncDrafts(nextTodos);
      setNewTodoTitle('');
    } catch (error) {
      setMutationMessage(formatApiError(error, 'Creating todo'));
    } finally {
      setMutationState({ kind: 'idle' });
    }
  };

  const handleToggleTodo = async (todo: Todo, completed: boolean): Promise<void> => {
    setMutationState({ kind: 'updating', todoId: todo.id });
    setMutationMessage(null);

    try {
      const updatedTodo = await todoApi.update(todo.id, {
        title: draftTitles[todo.id] ?? todo.title,
        completed,
      });
      replaceTodo(updatedTodo);
    } catch (error) {
      setMutationMessage(formatApiError(error, 'Updating todo'));
    } finally {
      setMutationState({ kind: 'idle' });
    }
  };

  const handleSaveTitle = async (todo: Todo): Promise<void> => {
    const nextTitle = (draftTitles[todo.id] ?? todo.title).trim();

    if (nextTitle.length === 0) {
      setMutationMessage('Todo titles cannot be empty.');
      return;
    }

    setMutationState({ kind: 'updating', todoId: todo.id });
    setMutationMessage(null);

    try {
      const updatedTodo = await todoApi.update(todo.id, {
        title: nextTitle,
        completed: todo.completed,
      });
      replaceTodo(updatedTodo);
    } catch (error) {
      setMutationMessage(formatApiError(error, 'Saving todo'));
    } finally {
      setMutationState({ kind: 'idle' });
    }
  };

  const handleDeleteTodo = async (todoId: number): Promise<void> => {
    setMutationState({ kind: 'deleting', todoId });
    setMutationMessage(null);

    try {
      await todoApi.remove(todoId);
      const nextTodos = todos.filter((todo) => todo.id !== todoId);

      setTodos(nextTodos);
      syncDrafts(nextTodos);
    } catch (error) {
      setMutationMessage(formatApiError(error, 'Deleting todo'));
    } finally {
      setMutationState({ kind: 'idle' });
    }
  };

  return (
    <main className="app-shell">
      <section className="hero-card">
        <p className="eyebrow">Todo API integration</p>
        <h1>Manage your live backend tasks from one workspace</h1>
        <p className="lead">
          The React app now reads and updates the FastAPI Todo service directly, using
          <code> {getApiBaseUrl()}</code> as its browser API base.
        </p>

        <form className="todo-create-form" onSubmit={(event) => void handleCreateTodo(event)}>
          <label className="field-label" htmlFor="new-todo-title">
            Add a new todo
          </label>
          <div className="field-row">
            <input
              id="new-todo-title"
              className="todo-input"
              placeholder="What needs to get done?"
              value={newTodoTitle}
              onChange={(event) => setNewTodoTitle(event.target.value)}
              disabled={isMutating}
            />
            <button className="primary-button" type="submit" disabled={isMutating}>
              Add todo
            </button>
          </div>
        </form>

        {todosState.kind === 'loading' ? (
          <p className="status-message" role="status">
            Loading todos…
          </p>
        ) : null}

        {todosState.kind === 'error' ? (
          <div className="status-panel error-panel" role="alert">
            <p>{todosState.message}</p>
            <button className="secondary-button" type="button" onClick={() => void loadTodos()}>
              Retry load
            </button>
          </div>
        ) : null}

        {mutationStatusLabel ? (
          <p className="status-message" role="status">
            {mutationStatusLabel}
          </p>
        ) : null}

        {mutationMessage ? (
          <p className="status-message error-text" role="alert">
            {mutationMessage}
          </p>
        ) : null}

        {todosState.kind === 'ready' ? (
          <TodoListSection
            todos={todos}
            draftTitles={draftTitles}
            mutationState={mutationState}
            onDraftTitleChange={(todoId, nextTitle) =>
              setDraftTitles((currentDraftTitles) => ({
                ...currentDraftTitles,
                [todoId]: nextTitle,
              }))
            }
            onSaveTitle={(todo) => void handleSaveTitle(todo)}
            onToggleTodo={(todo, completed) => void handleToggleTodo(todo, completed)}
            onDeleteTodo={(todoId) => void handleDeleteTodo(todoId)}
          />
        ) : null}
      </section>
    </main>
  );
}

export default App;
