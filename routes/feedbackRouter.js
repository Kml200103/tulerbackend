import express from "express"
import { subscribe } from "../controllers/FeedbackController.js"

const feedBackRouter=express.Router()


feedBackRouter.post('/subscribe',subscribe)
export default feedBackRouter