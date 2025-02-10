import mongoose from "mongoose";
import { addressType, indianPincodeRegex } from "../constants/constant.js";



const addressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true, default: "India" },
    addressType: {
        type: String, enum: Object.values(addressType),
        default: addressType.HOME,
    },
    streetAddress: { type: String, required: true },

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
},
    { timestamps: true });

const Address = mongoose.model("Address", addressSchema);
export default Address;
