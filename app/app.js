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
import Stripe from 'stripe';
import dotenv from 'dotenv';
import Order from '../models/Orders.js';
import couponRoutes from '../routes/coupons.js';
dotenv.config();

dbConnect();
const app = express();

// Stripe Webhook
// The library needs to be configured with your account's secret key.
// Ensure the key is kept out of any version control system you might be using.

const stripe = new Stripe(process.env.STRIPE_KEY)

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_152c3732545f22745bd358fa4fae7a071d1b5443083f8216c999a3f436b338fd";

app.post('/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
        // console.log(event);
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        //update order
        const session = event.data.object;
        const { orderId } = session.metadata;
        const paymentStatus = session.payment_status;
        const paymentMethod = session.payment_method_types[0];
        const totalAmount = session.amount_total;
        const currency = session.currency;

        const order = await Order.findByIdAndUpdate(orderId,
            {
                totalPrice: totalAmount / 100,
                currency,
                paymentMethod,
                paymentStatus
            },
            {
                new: true
            }
        );
        console.log(order);
    } else {
    }
    response.send();
});

app.use(express.json())

// routes
app.use('/api/v1/users/', userRoutes)
app.use('/api/v1/products/', productRoutes);
app.use('/api/v1/categories/', categoryRoutes);
app.use('/api/v1/brands/', brandRoutes);
app.use('/api/v1/colors/', colorRoutes);
app.use('/api/v1/reviews/', reviewRoutes);
app.use('/api/v1/orders/', orderRoutes);
app.use('/api/v1/coupons/', couponRoutes);

app.use(notFound);
app.use(globalErrHandler);
app.use(notFound);

export default app;