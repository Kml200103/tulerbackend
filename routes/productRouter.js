import express from "express";
import multer from "multer";
import { createOrUpdateProduct, deleteProduct, getAllProducts, getProductByCategory, getProductById } from "../controllers/ProductController.js";

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
}).array("images", 5); // Allow up to 5 images

const productRouter =new express.Router();

// Unified route for creating/updating products
productRouter.post('/product', upload, createOrUpdateProduct);



productRouter.get('/products', getAllProducts);

// Get a product by ID
productRouter.get('/product/:productId', getProductById);

// Delete a product
productRouter.delete('/product/:productId', deleteProduct);


productRouter.get('/product', getProductByCategory);

export default productRouter;
