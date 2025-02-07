import addressRouter from "../routes/addressRouter.js"
import authRouter from "../routes/authRouter.js"
import productRouter from "../routes/productRouter.js"
import userRouter from "../routes/userRoutes.js"



const apiPath='/api'
const routeConfig=(app)=>{
    app.use(apiPath,userRouter,authRouter,productRouter,addressRouter)

}

export default routeConfig