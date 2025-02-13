

import Order from "../modals/orderModal.js";
import Product from "../modals/productModal.js";
import User from "../modals/userModal.js";
import emailService from "../services/email/sendEmail.js";



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

           

            orderItems.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                
            });
        }

        // Create order
        const order = new Order({
            userId,
            addressId,
            items: orderItems,
            status: 'PENDING',
            paymentStatus: 'UNPAID',
            totalPrice
        });

        await order.save();

        // Send notifications
        const itemNames = orderItems.map(item => item.name).join(', ');
     

        // // Send email
        await emailService.sendOrderConfirmationEmail(user.email, order._id, orderItems, totalPrice);

        res.status(201).json({ status: true, orderId: order._id });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};



export { placeOrder }