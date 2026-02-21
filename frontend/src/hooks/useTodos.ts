import { useState, useEffect, useCallback } from "react";
import { fetchTodos } from "../api/todos.api";
import type { Todo } from "../types/todo";

export function useTodos() {

  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadTodos = useCallback(async (): Promise<void> => {
    try {
        setError(null);
        setLoading(true);        // ⚠️I missed writting both setState here before, when I click retry, it should change the state so that component will re-render
        const data = await fetchTodos();
        setTodos(data);
    } catch (error: unknown) {
        setError((error as Error).message);
    } finally {
        setLoading(false);
      }
  }, []);

  useEffect(() => {
    loadTodos();
  },[loadTodos]);

  return { todos, loading, error, retry: loadTodos };
}
