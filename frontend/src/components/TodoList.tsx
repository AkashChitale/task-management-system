import type { Todo } from "../types/todo";
import TodoItem from "./TodoItem";


function TodoList({ todos }: { todos: Todo[] }) {

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