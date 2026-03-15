import { useState, useEffect, useCallback } from "react";
import { 
    fetchTodos,
    addTodoRequest,
    deleteTodoRequest,
    toggleTodoRequest 
 } from "../api/todos.api";
import type { Todo } from "../types/todo";
import { toast } from "sonner";

export function useTodos() {

  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadTodos = useCallback(async (signal?: AbortSignal): Promise<void> => {
    try {
        setError(null);
        setLoading(true);
        const data = await fetchTodos(signal);
        setTodos(data);
    } catch (error: unknown) {
        // Don't set error state if request was cancelled
        if ((error as Error).name !== 'AbortError' && (error as Error).name !== 'CanceledError') {
            setError((error as Error).message);
        }
        // toast.error("Failed to load todos");
    } finally {
        setLoading(false);
      }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    
    loadTodos(abortController.signal);
    
    return () => {
        // Cancel request on unmount
        abortController.abort();
    };
  },[loadTodos]);

  // ADD TODO
  const addTodo = async (todoData: Omit<Todo, "_id" | "completed" | "createdAt">) => {
    try {
      const newTodo = await addTodoRequest(todoData);
      setTodos(prev => [newTodo, ...prev]);
      toast.success("Todo added successfully");
    } catch (err) {
      console.error("Add todo failed", err);
      toast.error("Failed to add todo");
    }
  };

  // DELETE TODO
  const deleteTodo = async (id: string) => {
    const previousTodos = todos;
    setTodos(prev => prev.filter(todo => todo._id !== id));
    try {
      await deleteTodoRequest(id);
      toast.success("Todo deleted successfully");
    } catch (err) {
      setTodos(previousTodos); // Rollback on failure
      toast.error("Failed to delete todo");
    }
  };

  // TOGGLE TODO
  const toggleTodo = async (id: string) => {
    const previousTodo = todos;
    setTodos(prev =>
      prev.map(todo =>
        todo._id === id ? { ...todo, completed: !todo.completed }
        : todo
      )
    );
    try {
      await toggleTodoRequest(id);
      toast.success("Todo updated successfully");
    } catch (err) {
      console.error("Toggle failed, rolling back", err);
      setTodos(previousTodo); // Rollback on failure
      toast.error("Failed to update todo");
    }
  };
  return { todos, loading, error, retry: () => loadTodos(), addTodo, deleteTodo, toggleTodo };
}
