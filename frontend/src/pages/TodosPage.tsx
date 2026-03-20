import TodoList from "../components/TodoList";
import TodoSkeleton from "../components/TodoSkeleton";
import AddTodo from "../components/AddTodo";
import { useTodos } from "../hooks/useTodos";
import FilterBar, { type FilterType } from "../components/FilterBar";
import "./TodosPage.css";
import { useState } from "react";

function TodosPage() {
const { todos, loading, error, retry, addTodo, deleteTodo, toggleTodo } = useTodos();

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

      <FilterBar activeFilter={activeFilter} onChange={setActiveFilter} />

      <div className="task-content">
        {loading ? 
        <TodoSkeleton /> :
        <TodoList
          todos={filteredTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />}
      </div>

    </div>
  );
};

export default TodosPage;