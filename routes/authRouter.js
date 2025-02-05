import express from "express"
import { loginUser } from "../controllers/AuthController.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"


const authRouter = express.Router()

authRouter.post('/auth/login',loginUser)

export default authRouter