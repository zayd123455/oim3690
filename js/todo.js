const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const count = document.getElementById('todo-count');
const filters = document.getElementById('filters');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let filter = 'all';

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
  list.innerHTML = '';

  const shown = todos.filter((t) => {
    if (filter === 'open') return !t.done;
    if (filter === 'done') return t.done;
    return true;
  });

  shown.forEach((todo) => {
    const li = document.createElement('li');
    if (todo.done) {
      li.classList.add('done');
    }

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.done;
    checkbox.addEventListener('change', () => {
      todo.done = !todo.done;
      saveTodos();
      renderTodos();
    });

    const text = document.createElement('span');
    text.textContent = todo.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '✕';
    deleteBtn.className = 'delete-btn';
    deleteBtn.setAttribute('aria-label', `Delete ${todo.text}`);
    deleteBtn.addEventListener('click', () => {
      todos = todos.filter((t) => t.id !== todo.id);
      saveTodos();
      renderTodos();
    });

    li.append(checkbox, text, deleteBtn);
    list.appendChild(li);
  });

  const remaining = todos.filter((t) => !t.done).length;
  count.textContent = `${remaining} item${remaining === 1 ? '' : 's'} left`;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  todos.push({ id: Date.now(), text: text, done: false });
  input.value = '';
  saveTodos();
  renderTodos();
});

filters.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  filter = btn.dataset.filter;
  filters.querySelectorAll('button').forEach((b) => {
    b.classList.toggle('active', b === btn);
  });
  renderTodos();
});

renderTodos();
