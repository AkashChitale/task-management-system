import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getTodos } from "../controllers/todo.controller.js";

const TodoRouter = Router();

TodoRouter.get("/", authMiddleware, getTodos);

export default TodoRouter;
