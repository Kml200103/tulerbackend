import User from "../modals/userModal.js";

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        //  Check if all fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required." });
        }

        //  Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists." });
        }

        //  Create new user
        const newUser = new User({ name, email, password });

        //  Save user to database (password is hashed in pre-save hook)
        await newUser.save();

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// const loginUser = async (req, res) => {
//     const { email, password } = req.body
//     if (!email || !password) {
//         return res.status(400).json({ error: "All fields are required." });
//     }
//     const userValid = await User.findOne({ email: email })
//     console.log('userValid', userValid)
//     if (!userValid) {
//         return res.status(400).json({ error: "User not exists." });
//     }
//     const user = { id: userValid._id, name: userValid.name, email: userValid.email, role: userValid.role, isAdmin: userValid.isAdmin }
//     // const user = await User.findOne({ email });
//     if (userValid && (await userValid.comparePassword(password))) {
//         return res.status(201).json({ message: "User Login Successfully", userValid })
//     } else {
//         console.log("Invalid credentials");
//     }

// }
const getAllUser = (req, res) => {

}
export { registerUser, getAllUser }