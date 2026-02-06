import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import Todo from "../models/todo.model.js";
import mongoose from "mongoose";

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

// delete (/:id) 
const deleteTodo = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const todoId = req.params.id as string;
    if(!todoId || !mongoose.Types.ObjectId.isValid(todoId)) {
      return res.status(400).json({ message: "Todo ID is required" });
    }
    const todo = await Todo.findOne({ _id: todoId, userId }); 

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    await Todo.deleteOne({ _id: todoId, userId });

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete todo", error });
  }
};

export { getTodos, createTodo, deleteTodo };