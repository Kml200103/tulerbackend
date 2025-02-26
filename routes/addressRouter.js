import express from "express"
import { createOrUpdateAddress, deleteAddress, getAllAddressForUser } from "../controllers/AddressController.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"

const addressRouter=express.Router()

addressRouter.post('/address/add/:userId/:id?',authMiddleware,createOrUpdateAddress)
addressRouter.get('/address/:userId',authMiddleware,getAllAddressForUser)
addressRouter.delete('/address/:addressId',authMiddleware,deleteAddress)
export default addressRouter