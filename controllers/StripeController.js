import Stripe from "stripe";
import config from "../config/index.js";
import Order from "../modals/orderModal.js";

const stripe = new Stripe(config.stripeSecret);

const checkPayment = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const orderId = session.metadata.orderId;

        try {
            await Order.findByIdAndUpdate(orderId, {
                paymentStatus: 'PAID',
                status: 'PROCESSING',
            });
            //send the email
            const order = await Order.findById(orderId).populate('userId', 'email');
            await emailService.sendOrderConfirmationEmail(order.userId.email, order._id, order.items, order.totalPrice);
        } catch (error) {
            console.error('Error updating order:', error);
        }
    }

    res.json({ received: true });
}


export { checkPayment }