
import Cart from "../modals/cartModal.js";
import Product from "../modals/productModal.js";


const addToCart = async (req, res) => {
    try {
        const { productId, variantId, quantity, userId } = req.body;

        // Fetch product and specific variant
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const variant = product.variants.find(v => v._id.toString() === variantId); 
        // console.log('variant', variant)
        if (!variant) {
            return res.status(404).json({ success: false, message: "Variant not found" });
        }

        // Find or create user's cart
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // console.log('cart', cart)
        // Check if the item (same product + variant) is already in the cart
        const existingItem = cart.items.find(item => 
            item.productId.toString() === productId && 
            item.variantId.toString() === variantId
        );
        // console.log('existing', existingItem)

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                productId,
                variantId: variant._id, 
                weight: variant.weight,
                quantity,
                price: variant.price
            });
        }

        await cart.save();
        return res.status(200).json({ success: true, message: "Item added to cart", cart });
    } catch (error) {
        console.error("Error adding to cart:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



const getCart = async (req, res) => {
    try {
        const { userId } = req.params;

        const cart = await Cart.findOne({ userId }).populate("items.productId");

        if (!cart) {
            return res.status(200).json({ message: "Cart is empty", cart: { items: [], totalPrice: 0 } });
        }

        // Process cart items to return only the relevant product and variant
        const populatedCartItems = cart.items.map(item => {
            const product = item.productId;

            if (!product) return item; // If product is missing, return item as is

            const variant = product.variants.find(v => v._id.toString() === item.variantId.toString());

            return {
                _id: item._id,
                productId: product._id,
                productName: product.name,
                categoryId: product.categoryId,
                description: product.description,
                images: product.images,
                variant: variant ? {
                    _id: variant._id,
                    weight: variant.weight,
                    price: variant.price
                } : null,
                quantity: item.quantity,
                totalPrice: item.quantity * (variant ? variant.price : 0)
            };
        });

        return res.status(200).json({ cart: { items: populatedCartItems, totalPrice: cart.totalPrice } });
    } catch (error) {
        console.error("Error fetching cart:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};




const updateCartItem = async (req, res) => {
    try {
        const { userId, productId, weight, quantity } = req.body;

        // console.log('req.body:', req.body);
        
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const item = cart.items.find(item => 
            item.productId.toString() === productId && item.weight === weight
        );

        if (!item) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        if (quantity < 1) {
            return res.status(400).json({ message: "Quantity cannot be less than 1" });
        }

        item.quantity = quantity;

        await cart.save();
        return res.status(200).json({ message: "Cart updated successfully", cart });
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
