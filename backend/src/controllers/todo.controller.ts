import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import Todo from "../models/todo.model.js";

const getTodos = async (req: AuthRequest, res: Response) => {
  // res.send('List of todos');
  try{
    const userId = req.userId // Assuming req.user is set by auth middleware
    const todos = await Todo.find({ userId });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch todos", error });
  }
};

export { getTodos };