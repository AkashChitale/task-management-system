import "./TodoSkeleton.css";
import "./TodoList.css"

const TodoSkeletonItem = () => {
  return (
    <div className="todo-item skeleton">

      <div className="skeleton-checkbox" />

      <div className="todo-text" style={{ borderRadius: "4px" }}>
        <div className="skeleton-title" />
        <div className="skeleton-desc" />
        <div className="skeleton-date" />
      </div>


    </div>
  );
};

const TodoSkeleton = () => {
  return (
    <div className="todo-list">
      {Array.from({ length: 8 }).map((_, i) => (
        <TodoSkeletonItem key={i} />
      ))}
    </div>
  );
};

export default TodoSkeleton;