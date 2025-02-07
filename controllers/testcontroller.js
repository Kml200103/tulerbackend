import mongoose from "mongoose";
import { indianPincodeRegex } from "../constants/constant.js";
import express from "express";
const addressRouter = express.Router();

const addressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true, default: "India" },
    pincode: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                return indianPincodeRegex.test(value.toString()); // Convert number to string and validate
            },
            message: "Invalid Indian Pincode. It should be a 6-digit number starting from 1-9."
        }
    }
});

const Address = mongoose.model("Address", addressSchema);

// Create or Update Address
const createOrUpdateAddress = async (req, res) => {
    try {
        const { userId } = req.params;
        const { _id, name, city, state, country, pincode } = req.body;

        if (!name || !city || !state || !country || !pincode) {
            return res.status(400).json({ message: "All Fields are required" });
        }

        if (_id) {

            const updatedAddress = await Address.findByIdAndUpdate(
                _id,
                { userId, name, city, state, country, pincode },
                { new: true, runValidators: true }
            );

            if (!updatedAddress) {
                return res.status(404).json({ message: "Address not found" });
            }

            return res.status(200).json({ message: "Address updated successfully", updatedAddress });
        } else {

            const newAddress = new Address({ userId, name, city, state, country, pincode });
            await newAddress.save();
            return res.status(201).json({ message: "Address added successfully", newAddress });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Define route
addressRouter.post("/address/add-or-update/:userId?", createOrUpdateAddress);

export default addressRouter;
