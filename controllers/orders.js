import Order from "../models/Orders.js";
import asyncHandler from "express-async-handler";
import User from "../models/Users.js";
import Product from "../models/Product.js";
import Stripe from "stripe";
import dotenv from 'dotenv';
import Coupon from "../models/Coupon.js";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_KEY);


/**
 * @desc Create Orders
 * @route POST api/v1/orders
 * @access Private
 */
export const createOrder = asyncHandler(async (req, res) => {
    const { coupon } = req.query;
    const couponFound = await Coupon.findOne({
        code: coupon?.toUpperCase()
    });
    if (couponFound?.isExpired)
        throw new Error('Çoupon is expired.');
    if (coupon && !couponFound)
        throw new Error('Coupon does not exists');

    var stripeCoupon;
    if (couponFound) {
        stripeCoupon = await stripe.coupons.create({
            percent_off: couponFound.discount,
            duration: "once",
            name: couponFound.code
        });
    }

    const discount = couponFound?.discount / 100;

    // get payload(customer, orderItems, shippingAddress, totalPrice)
    const { orderItems, shippingAddress, totalPrice } = req.body;
    // find user
    const user = await User.findById(req.userAuthId);

    if (!user?.hasShippingAddress) {
        throw new Error('Please provide shipping address');
    }

    // check if order is not empty
    if (!orderItems || orderItems?.length <= 0) {
        throw new Error('No Order items.');
    }
    // place/create order - saving
    const order = await Order.create({
        user: req.userAuthId,
        orderItems,
        shippingAddress,
        totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice
    });
    // update productQty & quantitySold
    orderItems?.map(async (order) => {
        // const product = products?.find((product) => String(product._id) === String(order?._id));
        const product = await Product.findById(order._id);
        if (product)
            product.totalSold += order.qty
        await product.save();
    });

    //push order into user
    user.orders.push(order?._id);
    await user.save();

    // make payment (stripe)'
    const line_items = orderItems.map(item => {
        return {
            price_data: {
                currency: 'inr',
                product_data: {
                    name: item?.name,
                    description: item?.description
                },
                unit_amount: item?.price * 100
            },
            quantity: item?.qty
        };
    })

    const session = await stripe.checkout.sessions.create(
        {
            line_items,
            metadata: {
                orderId: order?._id.toString()
            },
            discounts: [
                { coupon: stripeCoupon.id },
            ],
            mode: 'payment',
            success_url: 'https://localhost:3000/success',
            cancel_url: 'https://localhost:3000/cancel'
        }
    );
    res.send({ url: session.url });

    // payment webhook
    // update user order

    res.json({
        success: true,
        message: 'Order Created',
        order,
        user
    })
});

/**
 * @desc Get all orders
 * @route GET api/v1/orders
 * @access Public
 */
export const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find();
    res.json({
        status: 'Success',
        message: 'All orders fetched successfully',
        orders
    })
});

/**
 * @desc Get single orders
 * @route GET api/v1/orders/:id
 * @access Public
 */
export const getSingleOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    res.json({
        status: 'Success',
        message: 'Order fetched successfully',
        order
    })
});

/**
 * @desc Update order to be delivered
 * @route PUT api/v1/orders/update/:id/
 * @access Private/Admin
 */
export const updateOrder = asyncHandler(async (req, res) => {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id,
        {
            status: req.body.status.toLowerCase(),
        },
        {
            new: true
        }
    );

    res.json({
        success: true,
        message: 'Order Updated',
        updatedOrder
    });
});

/**
 * @desc get sales sum of all orders
 * @routes GET api/v1/orders/sales/sum
 * @access Public
 */
export const getOrderStats = asyncHandler(async (req, res) => {
    const stats = await Order.aggregate([
        {
            $group: {
                _id: "null",
                minimumSale: {
                    $min: "$totalPrice",
                },
                maximumSale: {
                    $max: "$totalPrice"
                },
                totalSales: {
                    $sum: '$totalPrice',
                },
                avgSale: {
                    $avg: '$totalPrice'
                }
            }
        }
    ]);

    const date = new Date();
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const salesToday = await Order.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: today,
                },
            },
        },
        {
            $group: {
                _id: null,
                totalSales: {
                    $sum: "$totalPrice"
                }
            }
        }
    ])

    res.json({
        success: true,
        message: 'Sum of orders',
        stats,
        salesToday
    })
})