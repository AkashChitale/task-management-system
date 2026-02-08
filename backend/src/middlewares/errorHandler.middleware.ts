import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandler = (err : any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let message = "Internally Server Error";

  if (err instanceof ZodError) {
    statusCode = 400;
    message = err.issues[0].message; // Get the first error message from Zod validation errors;
  }

  res.status(statusCode).json({
    success: false,
    message
  });
};

export default errorHandler;