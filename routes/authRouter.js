import express from "express"
import { loginUser } from "../controllers/AuthController.js"



const authRouter = express.Router()

authRouter.post('/auth/login',loginUser)

export default authRouter