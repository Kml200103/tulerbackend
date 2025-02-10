import express from "express";
import multer from "multer";
import { createOrUpdateProduct, deleteProduct, getAllProducts, getProductById } from "../controllers/ProductController.js";

const storage = multer.memoryStorage(); // Store files in memory for Cloudinary
const upload = multer({ storage: storage }).array("images");

const productRouter = express.Router();

// Unified route for creating and updating products
productRouter.post('/product', upload,createOrUpdateProduct);

productRouter.get('/products', getAllProducts);

// Get a product by ID
productRouter.get('/product/:productId', getProductById);

// Delete a product
productRouter.delete('/product/:productId', deleteProduct);

export default productRouter;
