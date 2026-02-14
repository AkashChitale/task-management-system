import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import UserRouter from './routes/user.route.js';
import TodoRouter from './routes/todo.route.js';
import { errorHandler } from './middlewares/error.middleware.js';

dotenv.config();

const app: Express = express();

// initialize port in ts
const PORT: number = parseInt(process.env.PORT || "3000", 10); 
// parseInt to convert string to number, 10 is the radix parameter
// radix parameter specifies the base of the numeral system to be used.

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Todo API');
});

app.use('/api/users', UserRouter);

app.use('/todos', TodoRouter);

app.use(errorHandler);

export { app, PORT };
