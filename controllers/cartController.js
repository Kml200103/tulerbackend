import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";


const addToCart = async (req, res) => {
    try {
        const { userId, productId, weight, quantity } = req.body;

        if (!userId || !productId || !weight || quantity <= 0) {
            return res.status(400).json({ message: "Invalid data provided" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const variant = product.variants.find(v => v.weight === weight);
        if (!variant) {
            return res.status(400).json({ message: "Invalid product variant" });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const existingItem = cart.items.find(item => item.productId.toString() === productId && item.weight === weight);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ productId, weight, quantity, price: variant.price });
        }

        await cart.save();
        return res.status(200).json({ message: "Product added to cart", cart });
    } catch (error) {
        console.error("Error adding to cart:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const getCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await Cart.findOne({ userId }).populate("items.productId");

        if (!cart) {
            return res.status(200).json({ message: "Cart is empty", cart: { items: [], totalPrice: 0 } });
        }

        return res.status(200).json({ cart });
    } catch (error) {
        console.error("Error fetching cart:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


const updateCartItem = async (req, res) => {
    try {
        const { userId, productId, weight, quantity } = req.body;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const item = cart.items.find(item => item.productId.toString() === productId && item.weight === weight);
        if (!item) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        item.quantity = quantity;

        await cart.save();
        return res.status(200).json({ message: "Cart updated", cart });
    } catch (error) {
        console.error("Error updating cart:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


const removeCartItem = async (req, res) => {
    try {
        const { userId, productId, weight } = req.body;

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter(item => !(item.productId.toString() === productId && item.weight === weight));

        await cart.save();
        return res.status(200).json({ message: "Product removed from cart", cart });
    } catch (error) {
        console.error("Error removing item:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


const clearCart = async (req, res) => {
    try {
        const { userId } = req.params;

        await Cart.findOneAndDelete({ userId });
        return res.status(200).json({ message: "Cart cleared" });
    } catch (error) {
        console.error("Error clearing cart:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export { addToCart, getCart, updateCartItem, removeCartItem, clearCart };
