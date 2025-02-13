

import Order from "../modals/orderModal.js";
import Product from "../modals/productModal.js";
import User from "../modals/userModal.js";



const placeOrder = async (req, res) => {
    try {
        const { userId, items, addressId,totalPrice } = req.body;

        // Validate user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: false, message: 'User not found' });
        }

        // Validate stock for each product
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ status: false, message: `Product ${item.productId} not found` });
            }

            if (product.quantity < item.quantity) {
                return res.status(400).json({ status: false, message: `Insufficient stock for ${product.name}` });
            }
        }

        // Update stock & create order
        const orderItems = [];
       

        for (const item of items) {
            const product = await Product.findById(item.productId);
            product.quantity -= item.quantity;
            await product.save();

            // const totalPrice = product.price * item.quantity;
            // grandTotal += totalPrice;

            orderItems.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                totalPrice
            });
        }

        // Create order
        const order = new Order({
            userId,
            addressId,
            items: orderItems,
            status: 'PENDING',
            paymentStatus: 'UNPAID',
        });

        await order.save();

        // Send notifications
        const itemNames = orderItems.map(item => item.name).join(', ');
        // await NotificationService.sendNotification('BUYER', `Order Placed: ${itemNames}`);
        // await NotificationService.sendNotification('SELLER', `New Order Received: ${itemNames}`);

        // // Send email
        // await EmailService.sendOrderConfirmationEmail(user.email, order._id, orderItems, grandTotal);

        res.status(201).json({ status: true, orderId: order._id });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};



export { placeOrder }