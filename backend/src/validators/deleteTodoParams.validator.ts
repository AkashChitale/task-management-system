import mongoose from "mongoose";
import { z } from "zod";

export const deleteTodoParamsSchema = z.object({
    id: z
    .string()
    .min(1, "To do Id is required")
    .refine(
        (id) =>{
            if(!mongoose.Types.ObjectId.isValid(id)) return false; // Check if it's a valid ObjectId string
            return true;
        },
        { message: "Invalid To do ID format" }
    )
});