import express from "express"
import { getOrderDetails, getOrders, placeOrder } from "../controllers/OrderController.js"


const orderRouter=new express.Router()


orderRouter.post('/order/create',placeOrder)

orderRouter.get('/order/allOrders/:userId',getOrders)


orderRouter.get('/order/:orderId',getOrderDetails)

export default orderRouter