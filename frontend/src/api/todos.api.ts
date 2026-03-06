import axiosInstance from "./client";
import type { Todo } from "../types/todo";
import { getUserFriendlyError } from "../utils/errorMessages";

export const fetchTodos = async (signal?: AbortSignal): Promise<Todo[]> => {
    try {
        const response = await axiosInstance.get("/todos", { signal });
        return response.data.todos;
    } catch (error: any) {
        if (error.name === 'AbortError' || error.name === 'CanceledError') {
            throw error;
        }
        const friendlyMessage = getUserFriendlyError(error);
        throw new Error(friendlyMessage);
    }
};