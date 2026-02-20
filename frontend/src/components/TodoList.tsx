import { useState, useEffect } from "react";
import { fetchTodos } from "../api/todos.api";
import type { Todo } from "../types/todo";
import TodoItem from "./TodoItem";

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
        {todos.map((todo: Todo) => (
          <TodoItem key={todo._id} todo={todo} />
        )) }
      </ul>
    </div>
  );
}

export default TodoList;