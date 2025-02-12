import express from "express";
import {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem,
    clearCart
} from "../controllers/cartController.js";

const cartRouter = new express.Router();

// Add product to cart
cartRouter.post("/cart/add", addToCart);

// Get user's cart
cartRouter.get("/cart/:userId", getCart);

// Update cart item quantity
cartRouter.put("/cart/update", updateCartItem);

// Remove item from cart
cartRouter.delete("/cart/remove", removeCartItem);

// Clear cart
cartRouter.delete("/cart/clear/:userId", clearCart);

export default cartRouter;
