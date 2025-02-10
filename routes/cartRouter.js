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
cartRouter.post("/add", addToCart);

// Get user's cart
cartRouter.get("/:userId", getCart);

// Update cart item quantity
cartRouter.put("/update", updateCartItem);

// Remove item from cart
cartRouter.delete("/remove", removeCartItem);

// Clear cart
cartRouter.delete("/clear/:userId", clearCart);

export default cartRouter;
