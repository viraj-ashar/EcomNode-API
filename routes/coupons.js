import express from 'express';
import { createCoupon, deleteCoupon, getAllCoupons, getSingleCoupon, updateCoupon } from '../controllers/coupons.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const couponRoutes = express.Router();

couponRoutes.post('/', isLoggedIn ,createCoupon);
couponRoutes.get('/', getAllCoupons);
couponRoutes.get('/:id', getSingleCoupon);
couponRoutes.put('/:id', isLoggedIn, updateCoupon);
couponRoutes.delete('/:id', isLoggedIn, deleteCoupon);

export default couponRoutes;