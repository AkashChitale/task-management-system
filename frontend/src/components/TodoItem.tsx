import type { Todo } from "../types/todo";

function TodoItem({ todo }: { todo: Todo }) {     // { todo : Todo } is the type annotation for the props object.
    return (
        <li>
            <h3>{todo.title}</h3>
            {todo.description && <p>{todo.description}</p>}
            <p>Status: {todo.completed ? "Completed" : "Pending"}</p>
            {todo.dueDate && <p>Due: {new Date(todo.dueDate).toLocaleDateString()}</p>}
        </li>
    );
}

export default TodoItem;