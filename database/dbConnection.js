import mongoose from "mongoose";
import config from "../config/index.js";

const db=config.mongo

const dbConnection=async()=>{


    try{
        const connect= await mongoose.connect(db,{
            // useUniFiedTopology:true,
            // useNewUrlParser:true
        })  
        console.log("Database Connected Successfully",connect.connection.host, connect.connection.name)
    }
    catch(err){
        console.log(err)
        process.exit(0)
    }

}

export default dbConnection