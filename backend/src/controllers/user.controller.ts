import { Request, Response } from 'express';

const registerUser = (req: Request, res: Response) => {
  res.send('User registration endpoint');
}

export { registerUser }; 