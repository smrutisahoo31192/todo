import { useEffect, useMemo, useState, type FormEvent } from 'react';
import './App.css';
import './todo-panels.css';
import { TodoFormPanel } from './components/TodoFormPanel';
import { TodoListPanel } from './components/TodoListPanel';
import { ApiError, todoApi, type Todo } from './lib/api';

type TodoFormState = {
  title: string;
  completed: boolean;
};

const createEmptyFormState = (): TodoFormState => ({ title: '', completed: false });

const getRequestErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    return `Backend request failed (${error.status}). Try again after the API is available.`;
  }

  return 'Unable to reach the Todo API. Start the FastAPI app and verify the frontend proxy configuration.';
};

function App() {
  const [todos, setTodos] = useState<readonly Todo[]>([]);
  const [isLoadingTodos, setIsLoadingTodos] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [formState, setFormState] = useState<TodoFormState>(createEmptyFormState);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completedCount = useMemo(
    () => todos.filter((todo) => todo.completed).length,
    [todos],
  );

  const resetCreateForm = (): void => {
    setEditingTodo(null);
    setFormState(createEmptyFormState());
    setValidationError(null);
    setSubmitError(null);
  };

  const loadTodos = async (signal?: AbortSignal): Promise<void> => {
    try {
      setLoadError(null);
      const nextTodos = await todoApi.list(signal);

      if (signal?.aborted) {
        return;
      }

      setTodos(nextTodos);
    } catch (error) {
      if (signal?.aborted) {
        return;
      }

      setLoadError(getRequestErrorMessage(error));
    } finally {
      if (!signal?.aborted) {
        setIsLoadingTodos(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    void loadTodos(controller.signal);

    return () => {
      controller.abort();
    };
  }, []);

  const handleEditSelection = (todo: Todo): void => {
    setEditingTodo(todo);
    setFormState({ title: todo.title, completed: todo.completed });
    setValidationError(null);
    setSubmitError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const trimmedTitle = formState.title.trim();

    if (trimmedTitle.length === 0) {
      setValidationError('Title is required.');
      setSubmitError(null);
      return;
    }

    setIsSubmitting(true);
    setValidationError(null);
    setSubmitError(null);

    try {
      if (editingTodo === null) {
        const createdTodo = await todoApi.create({ title: trimmedTitle });

        if (formState.completed) {
          await todoApi.update(createdTodo.id, { title: trimmedTitle, completed: true });
        }
      } else {
        await todoApi.update(editingTodo.id, {
          title: trimmedTitle,
          completed: formState.completed,
        });
      }

      await loadTodos();
      resetCreateForm();
    } catch (error) {
      setSubmitError(getRequestErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const heading = editingTodo === null ? 'Add a todo' : 'Edit todo';
  const submitLabel = isSubmitting
    ? editingTodo === null
      ? 'Saving…'
      : 'Updating…'
    : editingTodo === null
      ? 'Add todo'
      : 'Save changes';

  return (
    <main className="app-shell">
      <section className="app-hero">
        <div>
          <p className="eyebrow">Todo workspace</p>
          <h1>Capture new tasks and fix existing ones from one shared form.</h1>
          <p className="lead">
            The React workspace now talks directly to the Todo API so you can create,
            review, and edit todos without leaving the main screen.
          </p>
        </div>

        <dl className="hero-stats" aria-label="Todo summary">
          <div className="stat-card">
            <dt>Total todos</dt>
            <dd>{todos.length}</dd>
          </div>
          <div className="stat-card">
            <dt>Completed</dt>
            <dd>{completedCount}</dd>
          </div>
          <div className="stat-card">
            <dt>In progress</dt>
            <dd>{todos.length - completedCount}</dd>
          </div>
        </dl>
      </section>

      <section className="workspace-grid">
        <TodoListPanel
          isLoadingTodos={isLoadingTodos}
          loadError={loadError}
          todos={todos}
          onRefresh={() => {
            setIsLoadingTodos(true);
            void loadTodos();
          }}
          onEdit={handleEditSelection}
        />

        <TodoFormPanel
          heading={heading}
          submitLabel={submitLabel}
          editingTodoId={editingTodo?.id ?? null}
          formState={formState}
          validationError={validationError}
          submitError={submitError}
          isSubmitting={isSubmitting}
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
          onTitleChange={(nextTitle) => {
            setFormState((currentState) => ({
              ...currentState,
              title: nextTitle,
            }));
            setValidationError(null);
            setSubmitError(null);
          }}
          onCompletedChange={(nextCompleted) => {
            setFormState((currentState) => ({
              ...currentState,
              completed: nextCompleted,
            }));
          }}
          onCancelEdit={resetCreateForm}
        />
      </section>
    </main>
  );
}

export default App;
