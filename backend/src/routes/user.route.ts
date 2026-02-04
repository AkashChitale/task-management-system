import { Router } from 'express';
import { registerUser } from '../controllers/user.controller.js';

const UserRouter: Router = Router();

UserRouter.post('/register', registerUser);

export default UserRouter;
