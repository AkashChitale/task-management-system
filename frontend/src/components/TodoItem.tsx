import type { Todo } from "../types/todo";
import { formatRelativeDate } from "../utils/dateFormatter";
import "./TodoItem.css";

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem = ({ todo, onToggle, onDelete }: Props) => {
  return (
    <div className="todo-item">

      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo._id)}
      />

      <div className="todo-text">

        <p className={`todo-title ${todo.completed ? "done" : ""}`}>
          {todo.title}
        </p>

        {todo.description && (
          <p className="todo-desc">{todo.description}</p>
        )}

        {todo.dueDate? (
          <span className="todo-date">
            Due {formatRelativeDate(todo.dueDate)}
          </span>
        ):
        (<span className="todo-date">
            No due date
          </span>)
        } 

      </div>

      <button className="delete-btn" onClick={() => onDelete(todo._id)}>
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-2 14H7L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M9 6V4h6v2" />
        </svg>
      </button>

    </div>
  );
};

export default TodoItem;