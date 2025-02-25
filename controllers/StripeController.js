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


const createPaymentSession = async (req, res) => {
    try {
        const { orderId } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ status: false, message: 'Order not found' });
        }

        // Create a Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: order.items.map(item => ({
                price_data: {
                    currency: 'usd', // Change this as needed
                    product_data: { name: item.name },
                    unit_amount: item.price * 100,
                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            success_url: `${config.frontendUrl}/order/success?orderId=${order._id}`,
            cancel_url: `${config.frontendUrl}/order/cancel?orderId=${order._id}`,
            metadata: { orderId: order._id.toString() },
        });

        return res.status(200).json({ status: true, sessionUrl: session.url });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};


export { checkPayment,createPaymentSession }