import { useState, useEffect } from "react";
import { fetchTodos } from "../api/todos.api";
import type { Todo } from "../types/todo";

export function useTodos() {

  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTodos = async () => {
        try {
            const data = await fetchTodos();
            setTodos(data);
            setLoading(false);
        } catch (error: unknown) {
            setError((error as Error).message);
            setLoading(false);
        }
    };
    loadTodos();
  },[]);

  return { todos, loading, error };
}
