import express from "express";
import multer from "multer";
import { createOrUpdateProduct, deleteProduct, disableProduct, getAllProducts, getProductByCategory, getProductById, isDisabledProducts } from "../controllers/ProductController.js";

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
}).fields([
    { name: "coverImage", maxCount: 1 }, 
    { name: "images", maxCount: 5 } 
]);


const productRouter =new express.Router();

// Unified route for creating/updating products
productRouter.post('/product', upload, createOrUpdateProduct);



productRouter.get('/products', getAllProducts);

// Get a product by ID
productRouter.get('/product/:productId', getProductById);

// Delete a product
productRouter.delete('/product/:productId', deleteProduct);


productRouter.post('/product/disable/:productId',disableProduct)

productRouter.get('/product', getProductByCategory);

productRouter.get('/products/disabled',isDisabledProducts)


export default productRouter;
