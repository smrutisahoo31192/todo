import type { Todo } from '../lib/api';

type MutationState =
  | { kind: 'idle' }
  | { kind: 'creating' }
  | { kind: 'updating'; todoId: number }
  | { kind: 'deleting'; todoId: number };

type TodoListSectionProps = Readonly<{
  todos: readonly Todo[];
  draftTitles: Readonly<Record<number, string>>;
  mutationState: MutationState;
  onDraftTitleChange: (todoId: number, nextTitle: string) => void;
  onSaveTitle: (todo: Todo) => void;
  onToggleTodo: (todo: Todo, completed: boolean) => void;
  onDeleteTodo: (todoId: number) => void;
}>;

export function TodoListSection({
  todos,
  draftTitles,
  mutationState,
  onDraftTitleChange,
  onSaveTitle,
  onToggleTodo,
  onDeleteTodo,
}: TodoListSectionProps) {
  const isMutating = mutationState.kind !== 'idle';

  return (
    <section className="todo-section" aria-label="Todo list">
      <header className="todo-section-header">
        <h2>Current todos</h2>
        <p>{todos.length} tasks synced with the backend.</p>
      </header>

      {todos.length === 0 ? (
        <p className="empty-state">No todos yet. Create the first one to get started.</p>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => {
            const draftTitle = draftTitles[todo.id] ?? todo.title;
            const isUpdatingTodo = mutationState.kind === 'updating' && mutationState.todoId === todo.id;
            const isDeletingTodo = mutationState.kind === 'deleting' && mutationState.todoId === todo.id;

            return (
              <li key={todo.id} className="todo-item">
                <div className="todo-item-main">
                  <label className="todo-toggle">
                    <input
                      type="checkbox"
                      aria-label={`Toggle completion for ${todo.title}`}
                      checked={todo.completed}
                      onChange={(event) => onToggleTodo(todo, event.target.checked)}
                      disabled={isMutating}
                    />
                    <span>{todo.completed ? 'Completed' : 'Active'}</span>
                  </label>
                  <input
                    className="todo-input"
                    aria-label={`Todo title for ${todo.title}`}
                    value={draftTitle}
                    onChange={(event) => onDraftTitleChange(todo.id, event.target.value)}
                    disabled={isMutating}
                  />
                </div>

                <div className="todo-item-actions">
                  <button
                    className="secondary-button"
                    type="button"
                    aria-label={`Save ${todo.title}`}
                    onClick={() => onSaveTitle(todo)}
                    disabled={isMutating}
                  >
                    {isUpdatingTodo ? 'Saving…' : 'Save'}
                  </button>
                  <button
                    className="ghost-button"
                    type="button"
                    aria-label={`Delete ${todo.title}`}
                    onClick={() => onDeleteTodo(todo.id)}
                    disabled={isMutating}
                  >
                    {isDeletingTodo ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
