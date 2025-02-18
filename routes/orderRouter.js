import express from "express"
import { getAllOrders, getOrderDetails, getOrders, placeOrder, updateOrderStatus } from "../controllers/OrderController.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"


const orderRouter =  express.Router()
// orderRouter.use(authMiddleware)

orderRouter.post('/order/create', placeOrder)

orderRouter.get('/order/allOrders/:userId', getOrders)
orderRouter.get('/order/all', getAllOrders)
orderRouter.post('/order/status', updateOrderStatus)
orderRouter.get('/order/:orderId', getOrderDetails)

export default orderRouter