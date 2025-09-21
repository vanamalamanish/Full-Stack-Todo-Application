import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css"; // custom styles

function App() {
  const API_URL = "";
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await axios.get(`${API_URL}/api/todos`);
    setTodos(res.data);
  };

  const addTodo = async () => {
    if (!task) return;
    await axios.post(`${API_URL}/api/todos`, { task, completed: false });
    setTask("");
    fetchTodos();
  };

  const toggleComplete = async (todo) => {
    await axios.put(`${API_URL}/api/todos/${todo.id}`, {
      ...todo,
      completed: !todo.completed,
    });
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${API_URL}/api/todos/${id}`);
    fetchTodos();
  };

  return (
    <div className="app-container">
      <h1 className="title">✅ Classic Todo App</h1>

      <div className="input-section">
        <input
          type="text"
          className="todo-input"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter your task..."
        />
        <button className="add-btn" onClick={addTodo}>
          Add
        </button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`todo-item ${todo.completed ? "completed" : ""}`}
          >
            <span>{todo.task}</span>
            <div className="actions">
              <button className="done-btn" onClick={() => toggleComplete(todo)}>
                {todo.completed ? "Undo" : "Done"}
              </button>
              <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>
                ❌
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
