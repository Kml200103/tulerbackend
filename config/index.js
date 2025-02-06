import dotenv  from "dotenv";
dotenv.config();



const envfound =dotenv.config();
if(!envfound){
    throw new Error("Files Not Found")
}

export default{
    port:process.env.PORT,
    mongo:process.env.MONGO_URL,
    jwtsecret:process.env.JWT_SECRET_KEY,
    cloudinary_name:process.env.CLOUDINARY_NAME,
    cloudinary_api_key:process.env.CLOUDINARY_API_KEY,
    cloudinary_secret_key:process.env.CLOUDINARY_SECRET_KEY
}