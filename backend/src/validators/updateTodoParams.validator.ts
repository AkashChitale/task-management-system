import { z } from "zod";

export const updateTodoParamsSchema = z.object({
    id: z.string().min(1, "To do ID is required")  // zod only validates strings, so we validate that it's a non-empty string. 
    // The controller will handle converting it to ObjectId and validating that.
});