import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import Todo from "../models/todo.model.js";
import mongoose from "mongoose";
import { reminderQueue } from "../queues/reminder.queue.js";
import User from "../models/user.model.js";

const getTodos = async (req: AuthRequest, res: Response, next: NextFunction) => {
  // res.send('List of todos');
  try{
    const userId = req.userId!; // Assuming req.user is set by auth middleware (guaranteed by the auth middleware)
    const pages = parseInt((req as any).validatedQuery?.page) || 1;
    const limit = parseInt((req as any).validatedQuery?.limit) || 5;
    const skip = (pages - 1) * limit;

    const todos = await Todo.find({ userId })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 }); // Sort by creation date, newest first

    const total = await Todo.countDocuments({ userId });

    res.status(200).json({pages, limit, total, todos });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch todos", error });
  }
};

const createTodo = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!; // Assuming req.user is set by auth middleware (guaranteed by the auth middleware)
    const user = await User.findById(userId);
    const newTodo = new Todo({ ...req.body, userId });
    await newTodo.save();
    if(req.body.dueDate) {
      // const delay = new Date(req.body.dueDate).getTime() - Date.now();
      console.log("Scheduling reminder for todo:", newTodo.title, "at", req.body.dueDate);
      const delay = 5000; // 5 seconds for testing purpose

      if (delay > 0) {
        await reminderQueue.add(
          "todo-reminder",
          {
            email: user!.email,
            title: newTodo.title,
            todoId: newTodo._id.toString()
          },
          {
            delay
          }
        );
      }
    }
    res.status(201).json(newTodo);
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
    
  }
};

// delete (/:id) 
const deleteTodo = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    const todoId = req.params.id as string;


    const todo = await Todo.findOne({ _id: todoId, userId }); 
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    
    await Todo.deleteOne({ _id: todoId, userId });

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// update (/:id) 
const updateTodo = async (req: AuthRequest, res: Response, next: NextFunction) =>{
  try {
    const userId = req.userId;
    const todoId = req.params.id as string;
    if(!mongoose.Types.ObjectId.isValid(todoId)) {
      return res.status(400).json({ message: "Todo ID is required" });
    }
    
    const todo = await Todo.findOne({ _id: todoId, userId }); 

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    const { title, description, dueDate } = req.body;

    todo.title = title; // This . operator is used to update the title of the todo. It updated directly on the todo object which is an instance of the Todo model. After updating the properties, we call save() to persist the changes to the database.
    if(description !== undefined) todo.description = description; 
    if(dueDate !== undefined) todo.dueDate = dueDate;
    await todo.save();  // Save the updated todo
    res.status(200).json(todo);
} catch (error) {
    next(error); 
  }
};

export { getTodos, createTodo, deleteTodo, updateTodo };