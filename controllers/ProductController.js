import Product from "../modals/productModal.js";
import { uploadToCloudinary } from "../services/upload/fileUpload.js";

const createOrUpdateProduct = async (req, res) => {
    try {
        const { productId, name, categoryId, description, variants } = req.body;
        const { files } = req;
        const imageUrls = [];

        if (files) {
            const urls = await uploadToCloudinary(files);
            imageUrls.push(...urls);
        }

        if (!name || !categoryId || !description || !variants) {
            return res.status(400).json({ message: "All fields are mandatory" });
        }

        let product;
        if (productId) {
            // Update existing product
            product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            product.name = name;
            product.categoryId = categoryId;
            product.description = description;
            product.variants = variants;

            // Append new images if uploaded
            if (imageUrls.length > 0) {
                product.images.push(...imageUrls);
            }

            await product.save();
            return res.status(200).json({ message: "Product updated successfully", product });
        } else {
            // Create a new product
            product = new Product({
                name,
                categoryId,
                description,
                images: imageUrls,
                variants
            });

            await product.save();
            return res.status(201).json({ message: "Product added successfully", product });
        }
    } catch (error) {
        console.error("Error creating/updating product:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
        return res.status(200).json({ products,success:true });
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * @desc Get product by ID
 */
const getProductById = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId).populate("categoryId");

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({ product });
    } catch (error) {
        console.error("Error fetching product:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * @desc Delete product
 */
const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findByIdAndDelete(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export { createOrUpdateProduct, getAllProducts, getProductById, deleteProduct };