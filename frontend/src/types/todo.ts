export type Todo = {
    _id: string;
    title: string;
    description?: string;
    completed: boolean;
    dueDate?: string; // ISO string format
    createdAt: string;
}