import {
  DEFAULT_TODO_FILTER,
  isTodoFilter,
  type TodoFilter,
} from './todoFilters';

const TODO_FILTER_STORAGE_KEY = 'todo-ui-filter';
const TODO_SEARCH_STORAGE_KEY = 'todo-ui-search';

function getSessionStorage(): Storage | null {
  return typeof window === 'undefined' ? null : window.sessionStorage;
}

export function readStoredTodoFilter(storage: Storage | null = getSessionStorage()): TodoFilter {
  if (storage === null) {
    return DEFAULT_TODO_FILTER;
  }

  const storedFilter = storage.getItem(TODO_FILTER_STORAGE_KEY);

  return storedFilter !== null && isTodoFilter(storedFilter)
    ? storedFilter
    : DEFAULT_TODO_FILTER;
}

export function readStoredTodoSearchText(storage: Storage | null = getSessionStorage()): string {
  if (storage === null) {
    return '';
  }

  return storage.getItem(TODO_SEARCH_STORAGE_KEY) ?? '';
}

export function persistTodoViewState(
  filter: TodoFilter,
  searchText: string,
  storage: Storage | null = getSessionStorage(),
): void {
  if (storage === null) {
    return;
  }

  storage.setItem(TODO_FILTER_STORAGE_KEY, filter);
  storage.setItem(TODO_SEARCH_STORAGE_KEY, searchText);
}
