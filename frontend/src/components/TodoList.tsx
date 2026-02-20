import { useTodos } from "../hooks/useTodos";
import type { Todo } from "../types/todo";
import TodoItem from "./TodoItem";


function TodoList() {

  const { todos, loading, error } = useTodos();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;


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