import axiosInstance from "./client";
import type { Todo } from "../types/todo";

export const fetchTodos = async (): Promise<Todo[]> => {
    try {
        const response = await axiosInstance.get("/todos");
        return response.data.todos;
    } catch (error) {
        console.error("Error fetching todos:", error);
        throw error;
    }
};