import express from "express"
import { placeOrder } from "../controllers/OrderController.js"


const orderRouter=new express.Router()


orderRouter.post('/order/create',placeOrder)


export default orderRouter