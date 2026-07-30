import type { TodoItemProps } from './types';
import './todos.css';

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const completionLabel = todo.completed ? 'Mark todo as incomplete' : 'Mark todo as complete';
  const itemClassName = todo.completed ? 'todo-item todo-item--completed' : 'todo-item';

  return (
    <li className={itemClassName}>
      <label className="todo-item__main">
        <input
          aria-label={completionLabel}
          checked={todo.completed}
          className="todo-item__checkbox"
          onChange={() => {
            onToggle(todo.id);
          }}
          type="checkbox"
        />
        <span className="todo-item__title">{todo.title}</span>
      </label>

      <button
        className="todo-item__delete"
        onClick={() => {
          onDelete(todo.id);
        }}
        type="button"
      >
        Delete
      </button>
    </li>
  );
}
