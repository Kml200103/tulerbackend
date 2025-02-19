import express from "express"
import { addOffer, addOffers, applyDiscount, getOffers } from "../controllers/OfferController.js"

const offerRouter = express.Router()

offerRouter.post('/offer/add', addOffer)
offerRouter.post("/offer/bulk-add", addOffers);
offerRouter.get("/offer", getOffers);
       
offerRouter.post("/apply-discount", applyDiscount); // Apply a discount
export default offerRouter