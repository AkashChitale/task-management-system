import { Request, Response } from "express";
// import { AuthRequest } from "../middlewares/auth.middleware.js";

const getTodos = (req: Request, res: Response) => {
  res.send('List of todos');
};

export { getTodos };