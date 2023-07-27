import express from 'express';
import { createProduct } from '../controllers/products.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const productRoutes = express.Router();

productRoutes.post('/', isLoggedIn, createProduct);

export default productRoutes;