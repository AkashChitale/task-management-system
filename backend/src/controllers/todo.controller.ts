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

const createTodo = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId; // Assuming req.user is set by auth middleware
    if(!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { title, description } = req.body;
    if(!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    const newTodo = new Todo({ title, description, userId });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: "Failed to create todo", error });
  }
};

export { getTodos, createTodo };