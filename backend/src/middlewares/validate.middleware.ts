import { z } from "zod";
import { Request, Response, NextFunction } from "express";

type validateTarget = "body" | "query" | "params";



export const validate =
  (schema: z.ZodSchema, target: validateTarget = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req[target]);

      if (target === "body") req.body = parsed;
      if (target === "query") (req as any).validatedQuery = parsed;
      if (target === "params") req.params = parsed as any;

      next();
    } catch (err) {
      next(err);
    }
};
