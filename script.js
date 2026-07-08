const listEl = document.getElementById('todo-list');
const inputEl = document.getElementById('todo-input');

let todos = [];

function render() {
  listEl.innerHTML = '';
  todos.forEach((todo, index) => {
    const li = document.createElement('li');

    const span = document.createElement('span');
    span.textContent = todo.text;
    if (todo.done) span.classList.add('done');
    span.onclick = () => toggleTodo(index);

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.onclick = () => deleteTodo(index);

    li.appendChild(span);
    li.appendChild(delBtn);
    listEl.appendChild(li);
  });
}

function addTodo() {
  const text = inputEl.value.trim();
  if (!text) return;
  todos.push({ text, done: false });
  inputEl.value = '';
  render();
}

function toggleTodo(index) {
  todos[index].done = !todos[index].done;
  render();
}

function deleteTodo(index) {
  todos.splice(index, 1);
  render();
}

// initial render
render();
