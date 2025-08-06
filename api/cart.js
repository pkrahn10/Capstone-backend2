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

router.route("/:userId").get(async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await getCartByUserId(userId);
        
        if (!cart) {
            return res.status(404).json({
                error: "No Cart Found"
            });
        }
    } catch (error) {
        console.error("Error getting cart");
        res.status(500).json({
            error: "Failed to get cart"
        });
    }
})
