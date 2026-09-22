import TodoList from "../components/TodoList";
import TodoSkeleton from "../components/TodoSkeleton";
import AddTodo from "../components/AddTodo";
import { useTodos } from "../hooks/useTodos";
import FilterBar, { type FilterType } from "../components/FilterBar";
import "./TodosPage.css";
import { useRef, useState } from "react";

function TodosPage() {
const { todos, loading, error, retry, addTodo, deleteTodo, toggleTodo, hasMore , setPage} = useTodos();
const addTodoInputRef = useRef<HTMLInputElement>(null);

  const[activeFilter, setActiveFilter] = useState<FilterType>("all");

  const filteredTodos = todos.filter((todo) => {
    if (activeFilter === "active") return !todo.completed;
    if (activeFilter === "completed") return todo.completed;

    if (activeFilter === "today") {
      const today = new Date().toDateString();
      return new Date(todo.dueDate ?? new Date()).toDateString() === today;
    }

    if (activeFilter === "overdue") {
      return new Date(todo.dueDate ?? new Date()) < new Date() && !todo.completed;
    }

    return true;
  });

  const loadMore = () => {
    if (loading || !hasMore) return;
    setPage(prev => prev + 1);
  };

  const hasAnyTodos = todos.length > 0;
  const showWelcomeEmptyState = !loading && !error && !hasAnyTodos && activeFilter === "all";
  const showFilteredEmptyState = !loading && !error && hasAnyTodos && filteredTodos.length === 0;

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

        <AddTodo onAdd={addTodo} titleInputRef={addTodoInputRef} />
      </div>

      <FilterBar activeFilter={activeFilter} onChange={setActiveFilter} />

      <div className="task-content" aria-busy={loading}>
        {!loading && filteredTodos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        )}
        {loading && <TodoSkeleton />}
        {showWelcomeEmptyState && (
          <section className="empty-state-card" aria-live="polite">
            <div className="empty-state-icon" aria-hidden="true">✨</div>
            <h3>Welcome! Your tasks will show up here.</h3>
            <p>
              Start with one small step. Add your first task and we’ll keep it organized for you.
            </p>
            <button
              type="button"
              className="empty-state-cta"
              onClick={() => addTodoInputRef.current?.focus()}
              aria-label="Create your first task"
            >
              Create your first task
            </button>
          </section>
        )}
        {showFilteredEmptyState && (
          <p className="filtered-empty-state" role="status">
            No tasks match this filter yet. Try another filter or add a new task.
          </p>
        )}
        {!loading && hasMore && (
          <button className="load-more-btn" onClick={loadMore}>
            {loading ? "Loading..." : "Load More"}
          </button>
        )}
      </div>

    </div>
  );
};

export default TodosPage;