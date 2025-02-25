import express from "express"
import { checkSession, checkSessionId, getAllOrders, getOrderDetails, getOrders, handleStripeWebhook, makePayment, placeOrder, updateOrderStatus } from "../controllers/OrderController.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"


const orderRouter = express.Router()
// orderRouter.use(authMiddleware)

orderRouter.post('/order/create', placeOrder)

orderRouter.get('/order/allOrders/:userId', getOrders)
orderRouter.get('/order/all', getAllOrders)
orderRouter.post('/order/status', updateOrderStatus)
orderRouter.get('/order/:orderId', getOrderDetails)


orderRouter.post('/order/makePayment/:orderId', makePayment)

orderRouter.get('/order/checkSession/:sessionId', checkSessionId)

orderRouter.post("/webhook", express.raw({ type: 'application/json' }), handleStripeWebhook);
export default orderRouter