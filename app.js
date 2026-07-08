const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');

let todos = JSON.parse(localStorage.getItem('todos') || '[]');

function save() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function render() {
  list.innerHTML = '';
  todos.forEach((t, i) => {
    const li = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = t.completed;
    checkbox.onchange = () => {
      t.completed = !t.completed;
      save();
      render();
    };

    const span = document.createElement('span');
    span.textContent = t.text;
    if (t.completed) span.style.textDecoration = 'line-through';

    const del = document.createElement('button');
    del.textContent = 'x';
    del.onclick = () => {
      todos.splice(i, 1);
      save();
      render();
    };

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(del);
    list.appendChild(li);
  });
}

addBtn.onclick = () => {
  if (!input.value.trim()) return;
  todos.push({ id: Date.now().toString(), text: input.value, completed: false });
  input.value = '';
  save();
  render();
};

render();
