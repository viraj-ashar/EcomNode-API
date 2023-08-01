import express from "express";
import { createReview } from "../controllers/reviews.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";

const reviewRoutes = express.Router();

reviewRoutes.post('/:productID', isLoggedIn, isAdmin, createReview);

export default reviewRoutes;