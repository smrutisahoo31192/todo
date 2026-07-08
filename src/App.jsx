import { useState } from 'react'

let idCounter = 1

export default function App() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')

  function addTodo() {
    if (!input.trim()) return
    setTodos([...todos, { id: idCounter++, text: input, completed: false }])
    setInput('')
  }

  function toggleTodo(id) {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  function deleteTodo(id) {
    setTodos(todos.filter(t => t.id !== id))
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>Todo List</h2>
      <div>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add a todo"
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <span
              onClick={() => toggleTodo(todo.id)}
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                cursor: 'pointer'
              }}
            >
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
