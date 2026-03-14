import { useState, useEffect, useCallback } from "react";
import { 
    fetchTodos,
    addTodoRequest,
    deleteTodoRequest,
    toggleTodoRequest 
 } from "../api/todos.api";
import type { Todo } from "../types/todo";

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
    } catch (err) {
      console.error("Add todo failed", err);
    }
  };

  // DELETE TODO
  const deleteTodo = async (id: string) => {
    try {
      await deleteTodoRequest(id);
      setTodos(prev => prev.filter(todo => todo._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // TOGGLE TODO
  const toggleTodo = async (id: string) => {
    try {
      const updatedTodo = await toggleTodoRequest(id);
      setTodos(prev =>
        prev.map(todo =>
          todo._id === id ? updatedTodo : todo
        )
      );
    } catch (err) {
      console.error("Toggle failed", err);
    }
  };
  return { todos, loading, error, retry: () => loadTodos(), addTodo, deleteTodo, toggleTodo };
}
