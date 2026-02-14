import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError.js";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal Server Error";

  console.error("Error:", err);

  if (err instanceof ZodError) {
    statusCode = 400;
    // Extract the first issue message or provide a default
    message = err.issues[0]?.message || "Validation Error";
  } 
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Ensure headers haven't been sent already to avoid app crashes
  if (res.headersSent) {
    return next(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
