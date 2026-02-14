import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import Todo from "../models/todo.model.js";
import mongoose from "mongoose";
import { reminderQueue } from "../queues/reminder.queue.js";
import User from "../models/user.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import { AppError } from "../errors/AppError.js";

const getTodos = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    // res.send('List of todos');

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
});

const createTodo = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
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
});

// delete (/:id) 
const deleteTodo = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const todoId = req.params.id as string;


    const todo = await Todo.findOne({ _id: todoId, userId }); 
    if (!todo) {
      throw new AppError("Todo not found", 404);
    }
    
    await Todo.deleteOne({ _id: todoId, userId });

    res.status(200).json({ message: "Todo deleted successfully" });
 
});

// update (/:id) 
const updateTodo = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const todoId = req.params.id as string;
    if(!mongoose.Types.ObjectId.isValid(todoId)) {
      throw new AppError("Todo ID is invalid", 400);
    }
    
    const todo = await Todo.findOne({ _id: todoId, userId }); 

    if (!todo) {
      throw new AppError("Todo not found", 404);
    }

    const { title, description, dueDate } = req.body;

    todo.title = title; // This . operator is used to update the title of the todo. It updated directly on the todo object which is an instance of the Todo model. After updating the properties, we call save() to persist the changes to the database.
    if(description !== undefined) todo.description = description; 
    if(dueDate !== undefined) todo.dueDate = dueDate;
    await todo.save();  // Save the updated todo
    res.status(200).json(todo);
});

export { getTodos, createTodo, deleteTodo, updateTodo };