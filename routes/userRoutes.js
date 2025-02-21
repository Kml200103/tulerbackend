import express from "express"
import { forgotPassword, registerOrUpdateUser, removeUser, resetPassword, validateUser } from "../controllers/UserController.js"
import multer from "multer";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const storage = multer.memoryStorage(); // Store files in memory for Cloudinary
const upload = multer({ storage: storage }).array("images");

const userRouter = express.Router()

// userRouter.get('/', getAllUser)

userRouter.post('/registerUpdate', registerOrUpdateUser)

userRouter.get('/verify', authMiddleware, validateUser)

// userRouter.post('/upload', upload, createProduct)

userRouter.post('/forgot-password',forgotPassword)

userRouter.post('/reset-password', resetPassword)

userRouter.delete('/remove/:userId',removeUser)


export default userRouter