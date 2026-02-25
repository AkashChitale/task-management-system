import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { asyncHandler } from "./asyncHandler.middleware.js";
import { AppError } from "../errors/AppError.js";
import User from "../models/user.model.js";

interface AuthRequest extends Request {
    userId?: string; 
}

const authMiddleware = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    // res.send('authHeader ' + authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError("Unauthorized", 401);
    }
    const token = authHeader.split(' ')[1];

    if (!token) {
        throw new AppError("Unauthorized", 401);
    }

    const secret = process.env.ACCESS_TOKEN_SECRET! || "your_access_token_secret_key";
    try {
        const decoded = jwt.verify(token, secret) as { userId: string };
        req.userId = decoded.userId;
    } catch (err) {
        throw new AppError("Invalid token from auth", 401);
    }
    

    const user = await User.findById(req.userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }
    // console.log("Authenticated user:", user.email);
    next();
});

export { authMiddleware, AuthRequest };
