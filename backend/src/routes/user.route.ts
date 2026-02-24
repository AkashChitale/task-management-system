import { Router } from 'express';
import { registerUser, loginUser, refreshToken, getMe } from '../controllers/user.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { registerUserBodySchema } from '../validators/registerUser.validator.js';
import { loginUserBodySchema } from '../validators/loginUser.validator.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const UserRouter: Router = Router();

UserRouter.post('/register', validate(registerUserBodySchema), registerUser);

UserRouter.post('/login', validate(loginUserBodySchema), loginUser);

UserRouter.post('/refresh-token', refreshToken);

UserRouter.get('/me', authMiddleware, getMe);

export default UserRouter;
