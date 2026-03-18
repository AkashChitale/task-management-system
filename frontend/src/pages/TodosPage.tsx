import TodoList from "../components/TodoList";
import TodoSkeleton from "../components/TodoSkeleton";
import AddTodo from "../components/AddTodo";
import { useTodos } from "../hooks/useTodos";
import "./TodosPage.css";

function TodosPage() {
const { todos, loading, error, retry, addTodo, deleteTodo, toggleTodo } = useTodos();

  if (error)
    return (
      <div>
        <p>{error}</p>
        <button onClick={retry}>Retry</button>
      </div>
    );

  return (
    <div className="todo-page">
      <div className="task-header">
        <h2>My Tasks</h2>

        <AddTodo onAdd={addTodo} />
      </div>

      <div className="task-content">
        {loading ? 
        <TodoSkeleton /> :
        <TodoList
          todos={todos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />}
      </div>

    </div>
  );
};

export default TodosPage;