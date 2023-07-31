import express from 'express';
import dbConnect from '../config/dbConnect.js';
import userRoutes from '../routes/users.js';
import { globalErrHandler, notFound } from '../middlewares/globalErrHandler.js';
import productRoutes from '../routes/products.js';
import categoryRoutes from '../routes/categories.js';
import brandRoutes from '../routes/brands.js';
import colorRoutes from '../routes/colors.js';
import reviewRoutes from '../routes/reviews.js';
import orderRoutes from '../routes/order.js';

dbConnect();
const app = express();
app.use(express.json())

// routes
app.use('/api/v1/users/', userRoutes)
app.use('/api/v1/products/', productRoutes);
app.use('/api/v1/categories/', categoryRoutes);
app.use('/api/v1/brands/', brandRoutes);
app.use('/api/v1/colors/', colorRoutes);
app.use('/api/v1/reviews/', reviewRoutes);
app.use('/api/v1/orders/', orderRoutes);

app.use(notFound);
app.use(globalErrHandler);
app.use(notFound);

export default app;