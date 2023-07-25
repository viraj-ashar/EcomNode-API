import express from 'express';
import { registerUser } from '../controllers/users.js';

const userRoutes = express.Router();

userRoutes.post('/api/v1/users/register', registerUser);

export default userRoutes;