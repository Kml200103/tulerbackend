import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
    option: { type: String, required: true },
    type: { type: String, enum: ["percentage", "fixed"], required: true },
    value: { type: Number, required: true }
}, { timestamps: true });

const Offer = mongoose.model("Offer", offerSchema);
export default Offer;
