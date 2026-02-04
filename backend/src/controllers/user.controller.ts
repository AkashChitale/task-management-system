import { Request, Response } from 'express';
import User, { IUser } from '../models/user.model.js'; 
import jwt from 'jsonwebtoken';


const registerUser = async (req: Request, res: Response) => {
  // res.send('User registration endpoint');

  try{
    const { username, password, email } = req.body;

    if(!username || !password || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }

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
    res.status(500).json({ message: 'Server error', error });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try{
    const { email, password } = req.body;

    if(!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

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
    const token: any = jwt.sign(
      { userId: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET || "your_jwt_secret_key",
      { expiresIn: '1h'},
    );

    res.status(200).json({ message: 'Login successful', token: token, user: { username: existingUser.username, email: existingUser.email } });
  }
  catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}

export { registerUser, loginUser }; 