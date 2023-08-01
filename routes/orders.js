import express from "express";
import { createOrder, getAllOrders, getOrderStats, getSingleOrder, updateOrder } from "../controllers/orders.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";

const orderRoutes = express.Router();

orderRoutes.post('/', isLoggedIn, isAdmin, createOrder);
orderRoutes.get('/', getAllOrders);
orderRoutes.get('/stats/', getOrderStats);
orderRoutes.put('/update/:id', isLoggedIn, isAdmin, updateOrder);
orderRoutes.get('/:id', getSingleOrder);

export default orderRoutes;