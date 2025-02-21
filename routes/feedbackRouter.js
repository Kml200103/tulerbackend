import express from "express"
import { sendFeedBack, subscribe } from "../controllers/FeedbackController.js"

const feedBackRouter=express.Router()


feedBackRouter.post('/subscribe',subscribe)


feedBackRouter.post('/feedback',sendFeedBack)
export default feedBackRouter