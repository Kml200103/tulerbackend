import jwt from "jsonwebtoken"
import config from "../config/index.js";
import User from "../modals/userModal.js";
const generateJwt = async (user) => {
    const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
    };

    const token = await jwt.sign(payload, config.jwtsecret, { expiresIn: "1h" });
    return token
};
const authMiddleware = async (req, res, next) => {

    try {
        const header = req.headers['authorization'];
        // console.log('header', header)

      
        if (typeof header !== 'undefined') {
            const bearer = header.split(' ');
            const token = bearer[1];

            const verifytoken = jwt.verify(token, config.jwtsecret)

            console.log('verifytoken', verifytoken)
            const rootUser = await User.findOne({ _id: verifytoken.id });
            if (!rootUser) {
                throw new Error("user not found")
            }

            req.token = token
            req.rootUser = rootUser

            req.userId = rootUser._id
            next();
        }
        else{
            res.status(401).json({success:false, status: 401, message: "Not Authorize" })
        }
    }
    catch (error) {
        res.status(401).json({success:false, status: 401, message: "Not Authorize" })
    }

}


const checktoken = (req, res, next) => {
    const header = req.headers['authorization'];

    if (typeof header !== 'undefined') {
        const bearer = header.split(' ');
        const token = bearer[1];

        req.token = token;
        next();
    } else {
        //If header is undefined return Forbidden (403)
        res.sendStatus(403)
    }
}




export { authMiddleware, checktoken, generateJwt }