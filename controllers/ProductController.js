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
const getProductByCategory = async (req, res) => {
    try {
        const { categoryId, page = 1, limit = 10 } = req.query;
        let query = {};

        // Add category filter if provided
        if (categoryId) {
            query.categoryId = categoryId;
        }

        // Convert page and limit to numbers
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        // Fetch filtered products with pagination
        const products = await Product.find(query)
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        // Get total count for pagination metadata
        const totalProducts = await Product.countDocuments(query);

        return res.status(200).json({
            success: true,
            products,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalProducts / limitNumber),
            totalProducts
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export { createOrUpdateProduct, getAllProducts, getProductById, deleteProduct ,getProductByCategory};