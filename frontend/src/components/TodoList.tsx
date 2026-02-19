import { useState, useEffect } from "react";
import { fetchTodos } from "../api/todos.api";
import type { Todo } from "../types/todo";

function TodoList() {

  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    fetchTodos()
    .then(setTodos)
    .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Todo List</h2>
      <ul>
        {todos.map((todo: any) => (
          <li key={todo._id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;