import { z } from 'zod';

export const getTodosQuerySchema = z.object({
    page: z
        .string()
        .optional()
        .refine((value) => {
            if (value === undefined) return true; // Allow undefined for optional
            const num = Number(value);
            return !isNaN(num) && num > 0 && Number.isInteger(num); // Check if it's a positive integer
        }, { message: "Page must be a positive integer" }),
    limit: z
        .string()
        .optional()
        .refine((value) => {
            if (value === undefined) return true; // Allow undefined for optional
            const num = Number(value);
            return !isNaN(num) && num > 0 && Number.isInteger(num) && num <= 5; // Check if it's a positive integer and not greater than 5
        }, { message: "Limit must be a positive integer and not greater than 5" }),
    search: z.string().optional(),
    sortBy: z.enum(['createdAt', 'dueDate', 'title']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional()
});