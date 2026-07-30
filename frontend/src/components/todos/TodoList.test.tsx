import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TodoList } from './TodoList';
import type { TodoViewModel } from './types';

const todos: readonly TodoViewModel[] = [
  {
    id: 1,
    title: 'Plan the list component API',
    completed: false,
  },
  {
    id: 2,
    title: 'Render each item in order',
    completed: true,
  },
];

describe('TodoList', () => {
  it('renders one visible item for each todo in the same order', () => {
    render(<TodoList onDelete={vi.fn()} onToggle={vi.fn()} todos={todos} />);

    const listItems = screen.getAllByRole('listitem');

    expect(listItems).toHaveLength(2);
    expect(listItems[0]).toHaveTextContent('Plan the list component API');
    expect(listItems[1]).toHaveTextContent('Render each item in order');
  });

  it('shows an empty-state message instead of item rows when there are no todos', () => {
    render(<TodoList onDelete={vi.fn()} onToggle={vi.fn()} todos={[]} />);

    expect(screen.getByText(/no todos yet\./i)).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});
