

import Cart from "../modals/cartModal.js";
import Order from "../modals/orderModal.js";
import Product from "../modals/productModal.js";
import User from "../modals/userModal.js";
import emailService from "../services/email/sendEmail.js";



const placeOrder = async (req, res) => {
    try {
        const { userId, items, addressId, totalPrice } = req.body;

        // Validate user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: false, message: 'User not found' });
        }

        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ status: false, message: `Product ${item.productId} not found` });
            }

            // Find the correct variant
            const variant = product.variants.find(v => v._id.toString() === item.variantId.toString());
            if (!variant) {
                return res.status(404).json({ status: false, message: `Variant ${item.variantId} not found for product ${product.name}` });
            }

            // Check if the variant has enough stock
            if (variant.quantity < item.quantity) {
                return res.status(400).json({
                    status: false,
                    message: `Insufficient stock for ${product.name} (Variant: ${variant.weight})`
                });
            }

            // Deduct quantity from the correct variant
            variant.quantity -= item.quantity;
            await product.save();

            // Prepare order item
            orderItems.push({
                productId: product._id,
                name: product.name,
                quantity: item.quantity,
                price: variant.price,  // Ensure correct variant price is stored
                totalPrice: variant.price * item.quantity,
                variantId: item.variantId
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


        await Cart.findOneAndDelete({ userId });
        // Send email notification
        await emailService.sendOrderConfirmationEmail(user.email, order._id, orderItems, totalPrice);

        res.status(201).json({ status: true, orderId: order._id });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};



const getOrders = async (req, res) => {
    try {
        const { userId } = req.params;

        // Fetch all orders for the user and populate necessary fields
        const orders = await Order.find({ userId })
            .populate("items.productId")
            .populate("addressId");

        if (!orders.length) {
            return res.status(404).json({ status: false, message: "No orders found" });
        }

        // Group orders by addressId
        const groupedOrders = orders.reduce((acc, order) => {
            const addressId = order.addressId._id.toString();

            if (!acc[addressId]) {
                acc[addressId] = {
                    address: order.addressId,
                    orders: [],
                };
            }

            // Format order items with full details
            const formattedItems = order.items.map(item => {
                const product = item.productId;

                return {
                    productId: product._id,
                    productName: product.name,
                    quantity: item.quantity,
                    price: item.price,
                    totalPrice: item.totalPrice,
                    variantId: item.variantId,
                    variantDetails: product.variants?.find(variant =>
                        variant._id.toString() === item.variantId.toString()
                    ) || null, // Fetch matching variant details
                };
            });

            acc[addressId].orders.push({
                orderId: order._id,
                items: formattedItems,
                totalPrice: order.totalPrice,
                status: order.status,
                paymentStatus: order.paymentStatus,
                createdAt: order.createdAt,
            });

            return acc;
        }, {});

        res.status(200).json({ status: true, groupedOrders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};



const getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Fetch order details along with product and address information
        const order = await Order.findById(orderId)
            .populate("addressId")
            .populate({
                path: "items.productId",
                select: "name description images categoryId variants"
            });

        if (!order) {
            return res.status(404).json({ status: false, message: "Order not found" });
        }

        // Filter items to only include products whose variantId matches the stored variantId
        const filteredItems = order.items.map(item => {
            const product = item.productId;
            if (!product) return null;

            // Find the matching variant
            const matchingVariant = product.variants.find(variant =>
                variant._id.toString() === item.variantId.toString()
            );

            if (matchingVariant) {
                return {
                    ...item.toObject(),
                    productId: {
                        _id: product._id,
                        name: product.name,
                        description: product.description,
                        images: product.images,
                        categoryId: product.categoryId,
                        variant: matchingVariant // Include only the matching variant
                    }
                };
            }
            return null;
        }).filter(item => item !== null);

        // Construct the final response
        const orderResponse = {
            ...order.toObject(),
            items: filteredItems
        };

        res.status(200).json({ status: true, order: orderResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};




// Update Order Status API
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        // paymentStatus, payment_intent, invoiceUrl
        // Validate request body
        if (!orderId || !status) {
            return res.status(400).json({ status: false, message: "Order ID and status are required" });
        }

        // Check if the order exists
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ status: false, message: "Order not found" });
        }

        // Prepare update data
        const updateData = {
            status,
            updatedAt: new Date(),
        };

        // if (paymentStatus) {
        //     updateData.paymentStatus = paymentStatus;
        // }

        // if (payment_intent) {
        //     updateData.paymentIntent = payment_intent;
        // }

        // if (invoiceUrl) {
        //     updateData.invoiceUrl = invoiceUrl;
        // }

        // Update the order in MongoDB
        const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, { new: true });

        return res.status(200).json({
            status: true,
            message: "Order status updated successfully",
            updatedOrder,
        });

    } catch (error) {
        console.error("Error updating order status:", error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};




export { getOrders, getOrderDetails, placeOrder, updateOrderStatus };