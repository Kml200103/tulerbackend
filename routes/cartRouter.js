import express from "express";
import {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    addToCartMultiple
} from "../controllers/cartController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const cartRouter = new express.Router();

// cartRouter.use(authMiddleware)
// Add product to cart
cartRouter.post("/cart/add", authMiddleware, addToCart);

// Get user's cart
cartRouter.get("/cart/:userId", authMiddleware, getCart);

// Update cart item quantity
cartRouter.put("/cart/update", authMiddleware, updateCartItem);

// Remove item from cart
cartRouter.delete("/cart/remove", authMiddleware, removeCartItem);

// Clear cart
cartRouter.delete("/cart/clear/:userId", authMiddleware, clearCart);

cartRouter.post("/cart/multiple",authMiddleware,addToCartMultiple)
export default cartRouter;
