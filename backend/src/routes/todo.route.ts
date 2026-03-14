import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getTodos, createTodo, deleteTodo, updateTodo, toggleTodo } from "../controllers/todo.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createTodoSchema } from "../validators/todo.validator.js";
import { updateTodoParamsSchema } from "../validators/updateTodoParams.validator.js";
import { updateTodoBodySchema } from "../validators/updateTodoBody.validator.js";
import { deleteTodoParamsSchema } from "../validators/deleteTodoParams.validator.js";
import { getTodosQuerySchema } from "../validators/getTodosQuery.validator.js";

const TodoRouter = Router();

TodoRouter.get("/", authMiddleware, validate(getTodosQuerySchema, "query"), getTodos);

TodoRouter.post("/create", authMiddleware, validate(createTodoSchema), createTodo);

TodoRouter.delete("/:id", authMiddleware, validate(deleteTodoParamsSchema, "params"), deleteTodo);

TodoRouter.put("/:id", authMiddleware, validate(updateTodoParamsSchema, "params"), validate(updateTodoBodySchema), updateTodo);

TodoRouter.patch("/:id/toggle", authMiddleware, validate(updateTodoParamsSchema, "params"), toggleTodo);
 
export default TodoRouter;
