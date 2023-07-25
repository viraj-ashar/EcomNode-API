import express from 'express';
import { loginUser, registerUser } from '../controllers/users.js';

const userRoutes = express.Router();

userRoutes.post('/api/v1/users/register', registerUser);
userRoutes.post('/api/v1/users/login', loginUser);

export default userRoutes;