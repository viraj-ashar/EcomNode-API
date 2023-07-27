import express from 'express';
import dbConnect from '../config/dbConnect.js';
import userRoutes from '../routes/users.js';
import { globalErrHandler, notFound } from '../middlewares/globalErrHandler.js';
import productRoutes from '../routes/products.js';

dbConnect();
const app = express();
app.use(express.json())

// routes
app.use('/api/v1/users/', userRoutes)
app.use('/api/v1/products/', productRoutes);

app.use(notFound);
app.use(globalErrHandler);
app.use(notFound);

export default app;