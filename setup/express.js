import bodyParser from "body-parser";
import cors from "cors";
import compression from "compression";
import helmet from "helmet"
import express from "express"
import cookieParser from "cookie-parser"

const expressFunc = (app) => {
    app.use(express.json())
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json({ limit: '2048mb' }))
    app.use(
        cors({
          origin: ["http://localhost:5173", "http://localhost:5174","https://tuler-frontend-u8bo.vercel.app/"], 
          credentials: true,
        })
      );
      
    app.use(cookieParser())
    app.use(compression())
    app.use(helmet())
  
}


export default expressFunc