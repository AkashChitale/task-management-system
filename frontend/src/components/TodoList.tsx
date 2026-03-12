import type { Todo } from "../types/todo";
import TodoItem from "./TodoItem";
import "./TodoList.css";

interface Props {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoList = ({ todos, onToggle, onDelete }: Props) => {

  if (todos.length === 0) {
    return <p className="empty">No tasks yet</p>;
  }

  return (
    <div className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TodoList;