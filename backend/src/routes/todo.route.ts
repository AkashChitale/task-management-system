import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getTodos, createTodo } from "../controllers/todo.controller.js";

const TodoRouter = Router();

TodoRouter.get("/", authMiddleware, getTodos);

TodoRouter.post("/create", authMiddleware, createTodo);

export default TodoRouter;
