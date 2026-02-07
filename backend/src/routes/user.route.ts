import { Router } from 'express';
import { registerUser, loginUser, refreshToken } from '../controllers/user.controller.js';

const UserRouter: Router = Router();

UserRouter.post('/register', registerUser);

UserRouter.post('/login', loginUser);

UserRouter.post('/refresh-token', refreshToken);

export default UserRouter;
