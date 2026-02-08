import { z } from "zod";

export const updateTodoBodySchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    dueDate: z
    .string()
    .optional()
    .refine(
      (date) => {
        if (!date) return true;
        const parsed = new Date(date);
        return !isNaN(parsed.getTime()) && parsed > new Date(); 
      },
      { message: "Due dates must be in the future" }
    )
});