import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TodoItem } from './TodoItem';
import type { TodoViewModel } from './types';

const incompleteTodo: TodoViewModel = {
  id: 7,
  title: 'Write the first component tests',
  completed: false,
};

const completedTodo: TodoViewModel = {
  id: 9,
  title: 'Ship the Todo list UI',
  completed: true,
};

describe('TodoItem', () => {
  it('renders the title, unchecked checkbox, and delete button for an incomplete todo', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();

    render(
      <ul>
        <TodoItem onDelete={onDelete} onToggle={onToggle} todo={incompleteTodo} />
      </ul>,
    );

    expect(screen.getByText(/write the first component tests/i)).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /mark todo as complete/i })).not.toBeChecked();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('renders a checked checkbox and completed styling for a completed todo', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();

    render(
      <ul>
        <TodoItem onDelete={onDelete} onToggle={onToggle} todo={completedTodo} />
      </ul>,
    );

    const checkbox = screen.getByRole('checkbox', { name: /mark todo as incomplete/i });
    const listItem = screen.getByRole('listitem');

    expect(checkbox).toBeChecked();
    expect(listItem).toHaveClass('todo-item--completed');
  });

  it('invokes the toggle callback with the todo id when the checkbox is activated', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();

    render(
      <ul>
        <TodoItem onDelete={onDelete} onToggle={onToggle} todo={incompleteTodo} />
      </ul>,
    );

    fireEvent.click(screen.getByRole('checkbox', { name: /mark todo as complete/i }));

    expect(onToggle).toHaveBeenCalledOnce();
    expect(onToggle).toHaveBeenCalledWith(incompleteTodo.id);
    expect(onDelete).not.toHaveBeenCalled();
  });

  it('invokes the delete callback with the todo id when the delete button is activated', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();

    render(
      <ul>
        <TodoItem onDelete={onDelete} onToggle={onToggle} todo={incompleteTodo} />
      </ul>,
    );

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    expect(onDelete).toHaveBeenCalledOnce();
    expect(onDelete).toHaveBeenCalledWith(incompleteTodo.id);
    expect(onToggle).not.toHaveBeenCalled();
  });
});
