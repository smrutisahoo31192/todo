## 1. Frontend todo state

- [x] 1.1 Add filter/search state and derived visible-todo logic in the todo list view so `All / Active / Completed` and title search combine on the client - expect the list updates from one source of truth
- [x] 1.2 Persist and restore the selected filter plus search text with `sessionStorage` in the todo UI state layer - expect the same session reopens with the prior controls selected

## 2. Todo filter bar UI

- [x] 2.1 Build the todo filter bar with `All`, `Active`, and `Completed` controls plus a search input in the todo view - expect users can change status and search from the page
- [x] 2.2 Update the todo styles to make the active filter and search affordances visible - expect the selected state is clear at a glance

## 3. Verification

- [x] 3.1 Add frontend tests covering default `All`, `Active`/`Completed` switching, case-insensitive search, combined filters, and session-state restore - expect the behavior matches the spec
