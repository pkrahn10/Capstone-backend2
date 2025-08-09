import express from 'express';
const router = express.Router();
export default router;

import {
    createCart,
    getUserCart,
    getCartByUserId,
    addItemToCart,
    updateCartItemQuantity,
    removeItemFromCart 
} from "#db/queries/cart";
// get cart
router.route("/").get(async (req,res) => {
    const cart = await createCart(req.user.id);
    res.send(cart);
});


// update the quantity of an item in cart
router.route("/:userId/items/:productId").put(async (req,res) => {
    
    try {
        const { userId, productId } = req.params;
        const { quantity } = req.body;
        
        if(quantity < 0) {
            return res.status(404).json({
                error: "Invalid quantity"
            });
        }
        
        const updatedItem = await updateCartItemQuantity(userId, productId, quantity);
        
        if(!updatedItem) {
            return res.status(404).json({
                error: "Item not in cart"
            });
        }
        
        res.status(200).json({
            message: "Quantity updated"    
        })
    } catch (error) {
        console.error("Error updating item", error);
        res.status(500).json({
            error: "Failed to updated quantity"
        });
    }
});

// DELETE item from cart
router.route("/:userId/items/:productId").delete(async (req,res) => {
    try {
       const { userId, productId } = req.params;
       const removedItem = await removeItemFromCart(userId, productId);
       
       if(!removedItem) {
        return res.status(404).json({
            error: "Item not in cart"
        });
       }
       
       res.status(200).json({
        message: "Item removed"
       })
    } catch (error) {
        console.error("Error removing item");
        res.status(500).json({
            error: "Failed to delete item from cart"
        });
    }
});

// add item to cart
router.route("/:userId/items/:productId").post(async (req,res) => {
    try {
        const { userId, productId } = req.params;
        const { productId: newProduct } = await addItemToCart(userId, productId);
        
        if (!newProduct) {
            return res.status(404).json({
                error: "No item in cart"
            });
        }
        res.json(newProduct)
    } catch (error) {
        console.error("error adding item to cart", error);
        res.status(500).json({
            error: "Failed to add item to cart"
        });
    }
});

// get user cart
router.route("/:userId").get(async (req, res) => {
    try {
        const { userId } = req.params;
        const cart  = await getCartByUserId(userId);
        if (!cart) {
            return res.status(404).json({
                error: "No Cart Found"
            });
        }
        res.json(cart);
    } catch (error) {
        console.error("Error getting cart");
        res.status(500).json({
            error: "Failed to get cart"
        });
    }
});