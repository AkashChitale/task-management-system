import TodoList from "../components/TodoList";
import TodoSkeleton from "../components/TodoSkeleton";
import { useTodos } from "../hooks/useTodos";
import "./TodosPage.css";

function TodosPage() {
const { todos, loading, error, retry } = useTodos();

  const toggleTodo = (id: string) => {
    console.log("toggle", id);
  };

  const deleteTodo = (id: string) => {
    console.log("delete", id);
  };

  if (loading) return <TodoSkeleton />;

  if (error)
    return (
      <div>
        <p>{error}</p>
        <button onClick={retry}>Retry</button>
      </div>
    );

  return (
    <div className="todo-page">

      <h2>My Tasks</h2>

      <TodoList
        todos={todos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />

    </div>
  );
};

export default TodosPage;