
import { generateJwt } from "../middlewares/authMiddleware.js"
import User from "../modals/userModal.js"

const loginUser = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }
    const userValid = await User.findOne({ email: email })
    if (!userValid) {
        return res.status(400).json({ error: "User not exists." });
    }
    const user = { id: userValid._id, name: userValid.name, email: userValid.email, role: userValid.role, isAdmin: userValid.isAdmin }

    
    if (userValid && (await userValid.comparePassword(password))) {
        const token = await generateJwt(user)
        return res.status(200).json({ token: token, user: user })
    } else {
        return res.status(400).json({message:"Invalid credentials"})
    }
}

export { loginUser }