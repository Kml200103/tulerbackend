import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    description: { type: String },
 images: { type: [String], default: [] },

    variants: [
        {
            weight: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
        },
    ],
    isAvailable: { type: Boolean, default: true },
    isDisabled: { type: Boolean, default: false },
    isPermanentDeleted: { type: Boolean, default: false },
    totalSold: { type: Number, default: 0 },
});

productSchema.pre("save", function (next) {
    if (typeof this.imageUrls === "string") {
        this.imageUrls = [this.imageUrls]; // Convert single string to array
    }
    next();
});

const Product = mongoose.model("Product", productSchema);
export default Product;
