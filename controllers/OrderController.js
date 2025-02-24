

import { paymentStatus } from "../constants/constant.js";
import Cart from "../modals/cartModal.js";
import Order from "../modals/orderModal.js";
import Product from "../modals/productModal.js";
import User from "../modals/userModal.js";
import emailService from "../services/email/sendEmail.js";
import Stripe from "stripe"
import config from "../config/index.js";
const stripe = new Stripe(config.stripeSecret); // Store your secret key in .env


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
            // increase the total sold
            product.totalSold += item.quantity
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

        // const session = await stripe.checkout.sessions.create({
        //     payment_method_types: ['card'],
        //     line_items: orderItems.map(item => ({
        //         price_data: {
        //             currency: 'usd', // Change to your currency
        //             product_data: {
        //                 name: item.name,
        //             },
        //             unit_amount: item.price * 100, // Stripe uses cents
        //         },
        //         quantity: item.quantity,
        //     })),
        //     mode: 'payment',
        //     success_url: `${config.frontendUrl}/order/success?orderId=${order._id}`, // Redirect to success page
        //     cancel_url: `${config.frontendUrl}/order/cancel?orderId=${order._id}`, // Redirect to cancel page
        //     metadata: {
        //         orderId: order._id.toString(),
        //     },
        // });

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
        const { page = 1, pageSize = 10 } = req.query;

        // Convert page and pageSize to numbers
        const pageNumber = parseInt(page, 10);
        const limit = parseInt(pageSize, 10);
        const skip = (pageNumber - 1) * limit;

        // Fetch paginated orders for the user
        const orders = await Order.find({ userId })
            .populate("items.productId")
            .populate("addressId")
            .skip(skip)
            .limit(limit);

        // Get total order count for pagination
        const totalOrders = await Order.countDocuments({ userId });

        if (!orders.length) {
            return res.status(404).json({ status: false, message: "No orders found" });
        }

        // Format orders with items, addresses, and variant details
        const formattedOrders = orders.map(order => {
            const formattedItems = order?.items.map(item => {
                console.log('item', item)
                const product = item.productId;

                // console.log('product', product)
                return {
                    productId: product._id,
                    productName: product.name,
                    quantity: item.quantity,
                    price: item.price,
                    totalPrice: item.totalPrice,
                    variantId: item.variantId,
                    image: product.images,
                    variantDetails: product.variants?.find(variant =>
                        variant._id.toString() === item.variantId.toString()
                    ) || null, // Fetch matching variant details
                };
            });

            return {
                orderId: order._id,
                items: formattedItems,
                totalPrice: order.totalPrice,
                status: order.status,
                paymentStatus: order.paymentStatus,
                createdAt: order.createdAt,
                address: order.addressId, // Include full address details
            };
        });

        res.status(200).json({
            status: true,
            orders: formattedOrders,
            pagination: {
                totalOrders,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalOrders / limit),
                pageSize: limit,
            },
        });
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

const getAllOrders = async (req, res) => {
    try {
        const { page = 1, pageSize = 10 } = req.query;

        // Convert page and pageSize to numbers
        const pageNumber = parseInt(page, 10);
        const limit = parseInt(pageSize, 10);
        const skip = (pageNumber - 1) * limit;

        // Fetch paginated orders and populate necessary fields
        const orders = await Order.find()
            .populate("items.productId")
            .populate("addressId")
            .skip(skip)
            .limit(limit);

        // Get total order count for pagination
        const totalOrders = await Order.countDocuments();

        if (!orders.length) {
            return res.status(404).json({ status: false, message: "No orders found" });
        }

        // Format orders with items, addresses, and variant details
        const formattedOrders = orders.map(order => {
            const formattedItems = order.items.map(item => {
                const product = item.productId;

                return {
                    productId: product?._id,
                    productName: product.name,
                    quantity: item.quantity,
                    image: product.images,
                    price: item.price,
                    totalPrice: item.totalPrice,
                    variantId: item.variantId,
                    variantDetails: product.variants?.find(variant =>
                        variant._id.toString() === item.variantId.toString()
                    ) || null, // Fetch matching variant details
                };
            });

            return {
                orderId: order?._id,
                items: formattedItems,
                totalPrice: order.totalPrice,
                status: order.status,
                paymentStatus: order.paymentStatus,
                createdAt: order.createdAt,
                address: order.addressId, // Include full address details
            };
        });

        res.status(200).json({
            status: true,
            orders: formattedOrders,
            pagination: {
                totalOrders,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalOrders / limit),
                pageSize: limit,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};




// Update Order Status API
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        if (!orderId || !status) {
            return res.status(400).json({ status: false, message: "Order ID and status are required" });
        }

        // Fetch the order with user details
        const order = await Order.findById(orderId).populate('userId', 'email');

        if (!order) {
            return res.status(404).json({ status: false, message: "Order not found" });
        }

        // Update the order status
        const updateData = { status, updatedAt: new Date() };
        const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, { new: true });

        // If the order is canceled, restore inventory
        if (status === 'CANCEL') {
            for (const item of order.items) {
                const { productId, quantity, variantId } = item;

                // Update the specific variant quantity
                await Product.findOneAndUpdate(
                    { _id: productId, "variants._id": variantId },
                    { $inc: { "variants.$.quantity": quantity } } // Increment variant quantity
                );
            }

            // console.log('order.items', order.items)
            // Send cancellation email if user email exists
            if (order.userId.email) {
                await emailService.sendOrderCancellationEmail(order.userId.email, orderId, order.items, order.totalPrice || 0);
            } else {
                console.error("User email not found");
            }
        }

        return res.status(200).json({
            status: true,
            message: "Order status updated successfully",
            // updatedOrder,
        });

    } catch (error) {
        console.error("Error updating order status:", error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
}


const makePayment=async(req,res)=>{
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ status: false, message: 'Order not found' });
        }

        if (order.paymentStatus === paymentStatus.PAID) {
            return res.status(400).json({ status: false, message: 'Order already paid' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: order.items.map(item => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: item.price * 100,
                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            success_url: `${config?.frontendUrl}/order/success?orderId=${order._id}`,
            cancel_url: `${config?.frontendUrl}/order/cancel?orderId=${order._id}`,
            metadata: {
                orderId: order._id.toString(),
            },
        });

        res.status(200).json({ status: true, sessionId: session.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
}



export { getOrders, getOrderDetails, placeOrder, updateOrderStatus, getAllOrders ,makePayment};