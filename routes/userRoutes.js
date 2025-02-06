import express from "express"
import { getAllUser, registerUser } from "../controllers/UserController.js"
import multer from "multer";
import { uploadFile } from "../controllers/uploadController.js";
import { createProduct } from "../controllers/ProductController.js";

const storage = multer.memoryStorage(); // Store files in memory for Cloudinary
const upload = multer({ storage: storage }).array("images"); 



const userRouter = express.Router()
userRouter.get('/', getAllUser)
userRouter.post('/register', registerUser)
// userRouter.post('/login',loginUser)


userRouter.post('/upload', upload,createProduct )


export default userRouter