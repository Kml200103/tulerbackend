import express from "express"
import { checkSession, checkSessionId, getAllOrders, getOrderDetails, getOrders, handleStripeWebhook, makePayment, placeOrder, updateOrderStatus } from "../controllers/OrderController.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"


const orderRouter = express.Router()
// orderRouter.use(authMiddleware)

orderRouter.post('/order/create',authMiddleware, placeOrder)

orderRouter.get('/order/allOrders/:userId',authMiddleware, getOrders)
orderRouter.get('/order/all',authMiddleware, getAllOrders)
orderRouter.post('/order/status',authMiddleware, updateOrderStatus)
orderRouter.get('/order/:orderId',authMiddleware, getOrderDetails)


orderRouter.post('/order/makePayment/:orderId',authMiddleware, makePayment)

orderRouter.get('/order/checkSession/:sessionId',authMiddleware, checkSessionId)

orderRouter.post("/webhook", express.raw({ type: 'application/json' }), handleStripeWebhook);
export default orderRouter