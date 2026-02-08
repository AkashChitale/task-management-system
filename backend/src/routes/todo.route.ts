import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getTodos, createTodo, deleteTodo, updateTodo } from "../controllers/todo.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createTodoSchema } from "../validators/todo.validator.js";


const TodoRouter = Router();

TodoRouter.get("/", authMiddleware, getTodos);

TodoRouter.post("/create", authMiddleware, validate(createTodoSchema), createTodo);

TodoRouter.delete("/:id", authMiddleware, deleteTodo);

TodoRouter.put("/:id", authMiddleware, validate(createTodoSchema), updateTodo);

export default TodoRouter;
