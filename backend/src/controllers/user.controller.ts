import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/user.model.js'; 
import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken } from '../utils/token.js';
import { AppError } from '../errors/AppError.js';
import { asyncHandler } from '../middlewares/asyncHandler.middleware.js';

const registerUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // res.send('User registration endpoint');

    const { username, password, email } = req.body;

    // find existing user
    const existingUser = await User.findOne({ email }); // here User is a mongoose model;
    const existingUsername = await User.findOne({ username });
    if(existingUser || existingUsername) {
      throw new AppError("User already exists", 409);
    }
    const newUser = new User({ username, password, email });
    await newUser.save();
    
    res.status(201).json({ message: 'User registered successfully' });

});

const loginUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // find existing user
    const existingUser = await User.findOne({ email }); 
    if(!existingUser) {
      throw new AppError("User not found", 404);
    }
    
    const isPasswordValid = await existingUser.comparePassword(password);   
    if(!isPasswordValid) {
      throw new AppError("Invalid credentials", 401);
    }

    //Generate JWT token
    // const token: any = jwt.sign(
    //   { userId: existingUser._id, email: existingUser.email },
    //   process.env.JWT_SECRET || "your_jwt_secret_key",
    //   { expiresIn: '1h'},
    // );

    const accessToken: any = generateAccessToken({ userId: existingUser._id, email: existingUser.email });
    const refreshToken: any = generateRefreshToken({ userId: existingUser._id, email: existingUser.email });

    existingUser.refreshToken = refreshToken;
    await existingUser.save();   // Ensure it is saved to the database

    res.status(200).json({ message: 'Login successful', accessToken: accessToken, refreshToken: refreshToken, user: { username: existingUser.username, email: existingUser.email } });
 
});

const refreshToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError("Refresh token is required", 400);
    }

    const existingUser = await User.findOne({ refreshToken });
    if (!existingUser) {
      throw new AppError("Invalid or expired refresh token", 403);
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || "your_refresh_token_secret_key") as { userId: string, email: string };
      const newAccessToken = generateAccessToken({ userId: decoded.userId, email: decoded.email });
      res.status(200).json({ success: true, accessToken: newAccessToken });
    } catch (error) {
      throw new AppError("Invalid refresh token", 403);
    }
 
});

export { registerUser, loginUser, refreshToken }; 