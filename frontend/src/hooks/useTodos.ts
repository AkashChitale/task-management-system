import { useState, useEffect, useCallback } from "react";
import { fetchTodos } from "../api/todos.api";
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

  return { todos, loading, error, retry: () => loadTodos() };
}
