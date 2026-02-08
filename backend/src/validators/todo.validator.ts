import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(new Date(val).getTime()),
      { message: "Invalid due date format" }
    )
    .refine(
      (val) => !val || new Date(val) > new Date(),
      { message: "Due date must be in the future" }
    )
});
