import { Request, Response, NextFunction } from 'express';

// A utility function to wrap async route handlers and pass errors to the error handling middleware

type AsyncFn = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>;

export const asyncHandler = (fn: AsyncFn) => { 
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

