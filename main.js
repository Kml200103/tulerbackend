import express from "express"
import HttpStatus from "http-status-codes"
import expressFunc from "./setup/express.js"
import routeConfig from "./setup/routeConfig.js"



const app = express()


app.get('/', (req, res) => {
    return res.status(200).json("HEllo from server")
})

expressFunc(app)
routeConfig(app)


app.use((req, res, next) => {
    const error = { message: "Not Found", status: HttpStatus.NOT_FOUND }
    next(error)
})

app.use((err, res, next) => {
    next.local.message = err.message
    next.status(err.status || HttpStatus.INTERNAL_SERVER_ERROR)
    next.render('error')
})

// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    
//     if (req.method === "OPTIONS") {
//       return res.status(200).json({});
//     }
    
//     next();
//   });
  


export default app