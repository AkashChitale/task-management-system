import axiosInstance from "./client";
import type { Todo } from "../types/todo";
import { getUserFriendlyError } from "../utils/errorMessages";

export type TodoPayload = {
  title: string;
  description?: string;
  dueDate?: string;
};

export type fetchTodosResponse = {
  todos: Todo[];
  hasMore: boolean;
};

export const fetchTodos = async (pageNumber: number, signal?: AbortSignal): Promise<fetchTodosResponse> => {
    try {
        const response = await axiosInstance.get("/todos", { params: { page: pageNumber }, signal });
        return {
            todos: response.data.todos,
            hasMore: response.data.hasMore
        };
    } catch (error: any) {
        if (error.name === 'AbortError' || error.name === 'CanceledError') {
            throw error;
        }
        const friendlyMessage = getUserFriendlyError(error);
        throw new Error(friendlyMessage);
    }
};

export const addTodoRequest = async (payload: TodoPayload) => {
  console.log("Adding todo with payload:", payload);
  const response = await axiosInstance.post("/todos/create", payload);
  return response.data;
};

export const deleteTodoRequest = async (id: string) => {
  const response = await axiosInstance.delete(`/todos/${id}`);
  return response.data;
};

export const toggleTodoRequest = async (id: string) => {
  const response = await axiosInstance.patch(`/todos/${id}/toggle`);
  return response.data;
};