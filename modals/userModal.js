import mongoose from "mongoose";
import * as bcrypt from "bcryptjs";
import { ROLES } from "../constants/constant.js";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required."],
            trim: true,
            minlength: [3, "Name must be at least 3 characters long."],
        },
        email: {
            type: String,
            required: [true, "Email is required."],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/\S+@\S+\.\S+/, "Invalid email format."],
        },
        password: {
            type: String,
            required: [true, "Password is required."],
            minlength: [8, "Password must be at least 8 characters long."],
            validate: {
                validator: function (value) {
                    return /^(?=.*[A-Z]).{8,}$/.test(value); // At least 1 uppercase letter & min 8 characters
                },
                message: "Password must be at least 8 characters long and contain at least 1 uppercase letter.",
            },
        },
        role: {
            type: String,
            enum: Object.values(ROLES),
            default: ROLES.BUYER,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },

    },
    { timestamps: true }
);

// 🔒 Hash the password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.default.genSalt(10);
        this.password = await bcrypt.default.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// 🔑 Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.default.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
