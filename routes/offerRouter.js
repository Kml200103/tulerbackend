import express from "express"
import { addOffer, addOffers, applyDiscount, deleteOffer, getOffers, updateOffer } from "../controllers/OfferController.js"
import { authMiddleware } from "../middlewares/authMiddleware.js";

const offerRouter = express.Router()

offerRouter.post('/offer/add',authMiddleware, addOffer)

offerRouter.post("/offer/bulk-add", addOffers);

offerRouter.get("/offer", getOffers);

offerRouter.post("/apply-discount", applyDiscount); // Apply a discount

offerRouter.post('/offer/:offerId', updateOffer)

offerRouter.delete('/offer/:offerId', deleteOffer)

export default offerRouter