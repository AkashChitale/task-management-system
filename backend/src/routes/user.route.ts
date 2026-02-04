import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/user.controller.js';

const UserRouter: Router = Router();

UserRouter.post('/register', registerUser);

UserRouter.post('/login', loginUser);

export default UserRouter;
