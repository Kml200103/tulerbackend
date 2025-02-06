import express from "express"
import { createProduct } from "../controllers/ProductController.js";
import multer from "multer";
const storage = multer.memoryStorage(); // Store files in memory for Cloudinary
const upload = multer({ storage: storage }).array("images");
const productRouter = express.Router();


productRouter.post('/createProduct',upload,createProduct)
// Add a new product
// router.post("/", async (req, res) => {
//     try {
//         const { name, categoryId, description, imageUrls, variants, isAvailable } = req.body;

//         // Validate category existence
//         const category = await Category.findById(categoryId);
//         if (!category) return res.status(404).json({ message: "Category not found" });

//         const newProduct = new Product({ name, categoryId, description, imageUrl, variants, isAvailable });
//         await newProduct.save();

//         res.status(201).json({ message: "Product added successfully", product: newProduct });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// // Get all products
// router.get("/", async (req, res) => {
//     try {
//         const products = await Product.find().populate("categoryId", "name");
//         res.json(products);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// // Get a product by ID
// router.get("/:id", async (req, res) => {
//     try {
//         const product = await Product.findById(req.params.id).populate("categoryId", "name");
//         if (!product) return res.status(404).json({ message: "Product not found" });

//         res.json(product);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// // Update product price based on weight selection
// router.get("/:id/price", async (req, res) => {
//     try {
//         const { weight } = req.query; // Example: /products/:id/price?weight=500g
//         const product = await Product.findById(req.params.id);
//         if (!product) return res.status(404).json({ message: "Product not found" });

//         const variant = product.variants.find((v) => v.weight === weight);
//         if (!variant) return res.status(404).json({ message: "Variant not found for selected weight" });

//         res.json({ price: variant.price });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

export default productRouter
