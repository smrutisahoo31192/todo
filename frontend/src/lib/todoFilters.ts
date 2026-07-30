import type { Todo } from './api';

export const TODO_FILTER_OPTIONS = ['all', 'active', 'completed'] as const;

export type TodoFilter = (typeof TODO_FILTER_OPTIONS)[number];

export const DEFAULT_TODO_FILTER: TodoFilter = 'all';

export function isTodoFilter(value: string): value is TodoFilter {
  return TODO_FILTER_OPTIONS.some((option) => option === value);
}

export function getVisibleTodos(
  todos: readonly Todo[],
  filter: TodoFilter,
  searchText: string,
): readonly Todo[] {
  const normalizedSearchText = searchText.trim().toLocaleLowerCase();

  return todos.filter((todo) => {
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'active'
          ? !todo.completed
          : todo.completed;

    const matchesSearch =
      normalizedSearchText.length === 0
        ? true
        : todo.title.toLocaleLowerCase().includes(normalizedSearchText);

    return matchesFilter && matchesSearch;
  });
}
