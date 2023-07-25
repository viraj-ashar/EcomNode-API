import express from 'express';
import { loginUser, registerUser, getUserProfile } from '../controllers/users.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const userRoutes = express.Router();

userRoutes.post('/register/', registerUser);
userRoutes.post('/login/', loginUser);
userRoutes.get('/profile/', isLoggedIn, getUserProfile);

export default userRoutes;