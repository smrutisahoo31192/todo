const STORAGE_KEY = "simple-todo-app.todos";

const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");
const emptyState = document.querySelector("#empty-state");
const remaining = document.querySelector("#remaining");
const template = document.querySelector("#todo-template");
const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));

let todos = loadTodos();
let filter = "all";

function loadTodos() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (todo) =>
        todo &&
        typeof todo === "object" &&
        typeof todo.id === "string" &&
        typeof todo.title === "string" &&
        todo.title.trim().length > 0 &&
        typeof todo.completed === "boolean",
    );
  } catch {
    return [];
  }
}

function saveTodos() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {}
}

function createId() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function activeCount() {
  return todos.filter((todo) => !todo.completed).length;
}

function visibleTodos() {
  if (filter === "active") return todos.filter((todo) => !todo.completed);
  if (filter === "completed") return todos.filter((todo) => todo.completed);
  return todos;
}

function createTodoElement(todo) {
  const item = template.content.firstElementChild.cloneNode(true);
  const checkbox = item.querySelector(".todo-checkbox");
  const title = item.querySelector(".todo-title");
  const deleteButton = item.querySelector(".todo-delete");

  checkbox.checked = todo.completed;
  checkbox.dataset.id = todo.id;
  checkbox.setAttribute("aria-label", `Mark ${todo.title} as ${todo.completed ? "active" : "completed"}`);
  title.textContent = todo.title;
  deleteButton.dataset.id = todo.id;
  deleteButton.setAttribute("aria-label", `Delete ${todo.title}`);
  item.classList.toggle("is-completed", todo.completed);

  return item;
}

function render() {
  const shown = visibleTodos();
  const count = activeCount();

  list.replaceChildren(...shown.map(createTodoElement));

  emptyState.hidden = shown.length > 0;
  emptyState.textContent =
    filter === "all" ? "No todos yet. Add one above." : `No ${filter} todos.`;

  remaining.textContent = `${count} ${count === 1 ? "todo" : "todos"} left`;

  filterButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.filter === filter));
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = input.value.trim();
  if (!title) return;

  todos.unshift({ id: createId(), title, completed: false });
  input.value = "";
  saveTodos();
  render();
  input.focus();
});

list.addEventListener("change", (event) => {
  if (!event.target.classList.contains("todo-checkbox")) return;

  const todo = todos.find((item) => item.id === event.target.dataset.id);
  if (!todo) return;

  todo.completed = event.target.checked;
  saveTodos();
  render();
});

list.addEventListener("click", (event) => {
  const button = event.target.closest(".todo-delete");
  if (!button) return;

  todos = todos.filter((todo) => todo.id !== button.dataset.id);
  saveTodos();
  render();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filter = button.dataset.filter;
    render();
  });
});

render();
