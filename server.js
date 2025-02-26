import http from "http"
import app from "./main.js"

import config from "./config/index.js";
import dbConnection from "./database/dbConnection.js";

dbConnection();


const port =config.port

app.set(port)

const server=http.createServer(app)

app.get('/',(req,res)=>{
    res.status(200).json("HEllo from server")
})

server.listen(port,()=>{
    console.log(`Server Started at ${port}`)
})
