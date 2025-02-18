import addressRouter from "../routes/addressRouter.js"
import authRouter from "../routes/authRouter.js"
import cartRouter from "../routes/cartRouter.js"
import categoryRouter from "../routes/categoryRouter.js"
import feedBackRouter from "../routes/feedbackRouter.js"
import orderRouter from "../routes/orderRouter.js"
import productRouter from "../routes/productRouter.js"
import userRouter from "../routes/userRoutes.js"



const apiPath='/api'
const routeConfig=(app)=>{
    app.use(apiPath,userRouter,authRouter,productRouter,addressRouter,categoryRouter,cartRouter,orderRouter,feedBackRouter)

}

export default routeConfig