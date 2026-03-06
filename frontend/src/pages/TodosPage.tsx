import TodoList from "../components/TodoList";
import TodoSkeleton from "../components/TodoSkeleton";
import { useTodos } from "../hooks/useTodos";

function TodosPage() {

    const { todos, loading, error, retry} = useTodos();

    if (loading) return <TodoSkeleton />;
    if (error) return (
        <div>
            <p>Error: {error}</p>
            <button onClick={retry}>Retry</button>
        </div>
    );

    if(todos.length === 0) {
        return <p>No todos yet.</p>;
    }
    
    return (
        <div>
            <h1>Todos Page</h1>
            <TodoList todos={todos} />
        </div>
    )
}

export default TodosPage;