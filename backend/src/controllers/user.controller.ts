import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/user.model.js'; 
import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken } from '../utils/token.js';


const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  // res.send('User registration endpoint');

  try{
    const { username, password, email } = req.body;

    // find existing user
    const existingUser = await User.findOne({ email }); // here User is a mongoose model;
    const exitstngUsername = await User.findOne({ username });
    if(existingUser || exitstngUsername) {
      return res.status(409).json({ message: 'User already exists' });
    }
    const newUser = new User({ username, password, email });
    await newUser.save();
    
    res.status(201).json({ message: 'User registered successfully' });

  } 
  catch (error) {
    next(error);
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const { email, password } = req.body;

    // find existing user
    const existingUser = await User.findOne({ email }); 
    if(!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const isPasswordValid = await existingUser.comparePassword(password);   
    if(!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
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
  }
  catch (error) {
    next(error);
  }
};

const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    const existingUser = await User.findOne({ refreshToken });
    if (!existingUser) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || "your_refresh_token_secret_key") as { userId: string, email: string };
      const newAccessToken = generateAccessToken({ userId: decoded.userId, email: decoded.email });
      res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }
  } catch (error) {
    next(error);
  }
};

export { registerUser, loginUser, refreshToken }; 