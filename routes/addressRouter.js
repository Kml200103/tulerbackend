import express from "express"
import { createOrUpdateAddress, deleteAddress, getAllAddressForUser } from "../controllers/AddressController.js"

const addressRouter=express.Router()

addressRouter.post('/address/add/:userId',createOrUpdateAddress)
addressRouter.get('/address/:userId',getAllAddressForUser)
addressRouter.delete('/address/:addressId',deleteAddress)
export default addressRouter