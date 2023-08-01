import asyncHandler from 'express-async-handler'
import Coupon from '../models/Coupon.js';

/**
 * @desc Create new coupon
 * @route POST api/v1/coupons
 * @access Private/Admin
 */
export const createCoupon = asyncHandler(async (req, res) => {
    const { code, startDate, endDate, discount } = req.body;
    // check if admin
    // check if coupon already exist
    const couponExist = await Coupon.findOne({
        code: code.toUpperCase()
    });

    if (couponExist)
        throw new Error('Coupon already exist');

    if (isNaN(discount))
        throw new Error('Discount value must be a number');

    const coupon = await Coupon.create({
        code: code.toUpperCase(),
        startDate,
        endDate,
        discount,
        user: req.userAuthId
    });

    res.json({
        status: 'success',
        message: 'Coupon created successfully',
        coupon
    })
});

/**
 * @desc Get all coupons
 * @route GET api/v1/coupons
 * @access Public
 */
export const getAllCoupons = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find();
    res.json({
        status: 'Success',
        message: 'All coupons fetched successfully',
        coupons
    })
});

/**
 * @desc Get single coupons
 * @route GET api/v1/coupons/:id
 * @access Public
 */
export const getSingleCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findById(req.params.id);
    res.json({
        status: 'Success',
        message: 'Coupon fetched successfully',
        coupon
    })
});

/**
 * @desc Update coupon
 * @route PUT api/v1/coupons/:id
 * @access Private/Admin
 */
export const updateCoupon = asyncHandler(async (req, res) => {
    const { code, startDate, endDate, discount } = req.body;
    const coupon = await Coupon.findByIdAndUpdate(req.params.id,
        {
            code: code?.toUpperCase(),
            startDate,
            endDate,
            discount
        },
        {
            new: true
        }
    );

    res.json({
        status: 'Success',
        message: 'Coupon updated successfully',
        coupon
    });
})

/**
 * @desc Delete coupon
 * @route DELETE api/v1/coupons/:id
 * @access Private/Admin
 */
export const deleteCoupon = asyncHandler(async (req, res) => {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({
        status:'Success',
        message: 'Coupon deleted successfully'
    })
});