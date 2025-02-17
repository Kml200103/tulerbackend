import express from "express"
import { getOrderDetails, getOrders, placeOrder, updateOrderStatus } from "../controllers/OrderController.js"


const orderRouter=new express.Router()


orderRouter.post('/order/create',placeOrder)

orderRouter.get('/order/allOrders/:userId',getOrders)

orderRouter.post('/order/status',updateOrderStatus)
orderRouter.get('/order/:orderId',getOrderDetails)

export default orderRouter