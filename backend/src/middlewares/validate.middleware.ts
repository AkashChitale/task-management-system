import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";
import { asyncHandler } from "./asyncHandler.middleware.js";

type validateTarget = "body" | "query" | "params";



export const validate =
  (schema: z.ZodSchema, target: validateTarget = "body") =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.parse(req[target]);

    if (target === "body") req.body = parsed;
    if (target === "query") (req as any).validatedQuery = parsed;
    if (target === "params") req.params = parsed as any;

    // Proceed to the next middleware
    next();
  });
