## 1. Component contracts

- [x] 1.1 Define shared todo component types in `frontend/src/components/todos/` so `TodoList` and `TodoItem` use the same `id`, `title`, and `completed` shape - expect consistent prop handling
- [x] 1.2 Add a local stylesheet entry point for the todo components in `frontend/src/components/todos/` so completed-state styling can be applied without affecting the rest of the app - expect scoped todo UI styles

## 2. TodoItem component

- [x] 2.1 Implement `frontend/src/components/todos/TodoItem.tsx` to render the title, checkbox, and delete button from props - expect the item UI to satisfy the component contract
- [x] 2.2 Apply completed and incomplete visual states in `frontend/src/components/todos/TodoItem.tsx` and its stylesheet - expect checked todos to look distinct

## 3. TodoList component

- [x] 3.1 Implement `frontend/src/components/todos/TodoList.tsx` to map todos into `TodoItem` rows in list order - expect one rendered item per todo
- [x] 3.2 Add empty-state rendering in `frontend/src/components/todos/TodoList.tsx` - expect a message when the todo array is empty

## 4. Tests

- [x] 4.1 Add `frontend/src/components/todos/TodoItem.test.tsx` to verify title rendering, checkbox state, toggle callback, and delete callback - expect the item acceptance criteria to pass
- [x] 4.2 Add `frontend/src/components/todos/TodoList.test.tsx` to verify list rendering and empty-state behavior - expect the list acceptance criteria to pass
