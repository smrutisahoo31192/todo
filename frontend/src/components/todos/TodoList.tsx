import { TodoItem } from './TodoItem';
import type { TodoListProps } from './types';
import './todos.css';

export function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return <p className="todo-list__empty">No todos yet.</p>;
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem key={todo.id} onDelete={onDelete} onToggle={onToggle} todo={todo} />
      ))}
    </ul>
  );
}
