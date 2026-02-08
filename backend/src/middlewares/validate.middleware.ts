import { z } from "zod";
import { Request, Response, NextFunction } from "express";

type validateTarget = "body" | "query" | "params";



export const validate =
  (schema: z.ZodSchema, target: validateTarget = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req[target] = schema.parse(req[target]);
      next();
    } catch (err) {
      next(err);
    }
};
