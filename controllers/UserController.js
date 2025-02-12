import config from "../config/index.js";
import User from "../modals/userModal.js";
import emailService from "../services/email/sendEmail.js";
import jwt from "jsonwebtoken"
const registerOrUpdateUser = async (req, res) => {

    try {
        const { id, name, email, password, phone } = req.body;

        // Validate required fields
        if (!name || !email) {
            return res.status(400).json({ error: "Name and email are required." });
        }

        // Check if user exists
        let existingUser = await User.findOne({ email });

        if (existingUser) {
            // If user exists and a userId is provided, update the user
            if (id && existingUser._id.toString() === id) {

                existingUser.name = name;
                existingUser.email = email;
                existingUser.phone = phone
                if (password) {
                    existingUser.password = password;
                }

                await existingUser.save();
                return res.status(200).json({ message: "User updated successfully!", success: true });
            }
            return res.status(400).json({ error: "User with this email already exists.", success: false });
        }

        // If user does not exist, create a new user
        const newUser = new User({ name, email, password,phone });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully!", success: true });
    } catch (error) {
        console.error("Registration/Update Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


const validateUser = async (req, res) => {
    const { userId } = req
    const user = await User.findOne({ _id: userId })
    if (!user) {
        return res.status(400).json({ message: "User Not Found" })
    }
    else {
        const newUser = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isAdmin: user.isAdmin,
            phone:user.phone||null
        }
        return res.status(200).json({ message: "User Found Successfully", user: newUser })
    }
}



const getUserById = async (req, res) => {

    const { userId } = req
    const user = await User.findOne({ _id: userId })
    if (!user) {
        return res.status(400).json({ message: "User Not Found" })
    }
    else {
        const newUser = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isAdmin: user.isAdmin
        }
        return res.status(200).json({ message: "User Found Successfully", user: newUser })
    }
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: false, message: 'User not found' });
        }

        // Generate token & expiry (valid for 1 hour)
        const resetToken = jwt.sign({ email }, config.jwtsecret, { expiresIn: '1h' });

        user.resetPasswordToken = resetToken;
        user.tokenExpiry = Date.now() + 3600000; // 1 hour
        await user.save();

        // Send email
        await emailService.sendResetPasswordEmail(email, resetToken);

        res.json({ status: true, message: 'Password reset link sent to email' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
}

const resetPassword = async (req, res) => {
    // console.log('req.body', req.body)
    // console.log('req.params', req.params)
    const { password, token, email } = req.body;
    // const { token, email } = req.params
    if (!password) {
        return res.status(400).json({ status: false, message: 'Password is required' });
    }

    try {
        const user = await User.findOne({ email, resetPasswordToken: token });


        if (!user || !user.tokenExpiry || user.tokenExpiry < Date.now()) {
            return res.status(400).json({ status: false, message: 'Invalid or expired token' });
        }


        user.password = password;
        user.resetPasswordToken = null;
        user.tokenExpiry = null;
        await user.save();

        res.json({ status: true, message: 'Password reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Failed to reset password' });
    }
}
export { registerOrUpdateUser, getUserById, resetPassword, forgotPassword, validateUser }