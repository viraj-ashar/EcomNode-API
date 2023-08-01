import express from "express";
import { createOrder, getAllOrders, getSingleOrder, updateOrder } from "../controllers/orders.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const orderRoutes = express.Router();

orderRoutes.post('/', isLoggedIn, createOrder);
orderRoutes.get('/', isLoggedIn, getAllOrders);
orderRoutes.get('/:id', isLoggedIn, getSingleOrder);
orderRoutes.put('/update/:id', isLoggedIn, updateOrder);

export default orderRoutes;