import { Request, Response } from 'express';
import User, { IUser } from '../models/user.model.js'; 


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

export { registerUser }; 