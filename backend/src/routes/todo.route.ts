import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getTodos, createTodo, deleteTodo } from "../controllers/todo.controller.js";
import Todo from "../models/todo.model.js";

const TodoRouter = Router();

TodoRouter.get("/", authMiddleware, getTodos);

TodoRouter.post("/create", authMiddleware, createTodo);

TodoRouter.delete("/:id", authMiddleware, deleteTodo);

export default TodoRouter;
