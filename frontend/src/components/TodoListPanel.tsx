import type { Todo } from '../lib/api';

type TodoListPanelProps = {
  readonly isLoadingTodos: boolean;
  readonly loadError: string | null;
  readonly todos: readonly Todo[];
  readonly onRefresh: () => void;
  readonly onEdit: (todo: Todo) => void;
};

export function TodoListPanel({
  isLoadingTodos,
  loadError,
  todos,
  onRefresh,
  onEdit,
}: TodoListPanelProps) {
  return (
    <section className="panel-card" aria-labelledby="todo-list-heading">
      <div className="panel-header">
        <div>
          <p className="section-label">Current list</p>
          <h2 id="todo-list-heading">Todos</h2>
        </div>
        <button
          className="secondary-button"
          type="button"
          onClick={onRefresh}
          disabled={isLoadingTodos}
        >
          Refresh
        </button>
      </div>

      {loadError !== null ? <p className="feedback-banner error-banner">{loadError}</p> : null}

      {isLoadingTodos ? <p className="empty-state">Loading todos…</p> : null}

      {!isLoadingTodos && todos.length === 0 ? (
        <p className="empty-state">No todos yet. Add one from the form to get started.</p>
      ) : null}

      {!isLoadingTodos && todos.length > 0 ? (
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className="todo-item">
              <div className="todo-copy">
                <span className={todo.completed ? 'status-chip done' : 'status-chip pending'}>
                  {todo.completed ? 'Completed' : 'In progress'}
                </span>
                <h3 className={todo.completed ? 'todo-title completed' : 'todo-title'}>
                  {todo.title}
                </h3>
              </div>
              <button
                className="secondary-button"
                type="button"
                onClick={() => {
                  onEdit(todo);
                }}
              >
                Edit {todo.title}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
