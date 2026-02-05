import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
    userId?: string; 
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    // res.send('authHeader ' + authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized 1" });
    }
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized 2" });
    }

    try {
        const secret = process.env.JWT_SECRET || "your_jwt_secret_key";
        const decoded = jwt.verify(token, secret) as { userId: string };
        // res.send(decoded.userId);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Forbidden" });
    }  
}

export { authMiddleware, AuthRequest };
