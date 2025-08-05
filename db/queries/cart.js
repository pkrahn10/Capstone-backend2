import db from "#db/client";
// creates a new cart
export async function createCart(userId) {
    const sql = `
    INSERT INTO carts (user_id)
    VALUES ($1)
    RETURNING *
    `;
    const { rows: [cart] } = await db.query(sql, [userId]);
    return cart;
}
// gets a cart associated with a specific user
export async function getUserCart(userId) {
    const sql = `
    SELECT *
    FROM carts
    WHERE user_id = $1
    `;
    const { rows: [cart] } = await db.query(sql, [userId]);
    return cart;
}

export async function getCartByUserId(userId) {
    let cart = await getUserCart(userId);
    if (!cart) {
        cart = await createCart(userId);
    }
    const sql = `
    SELECT *
    FROM cart_items
    JOIN products ON cart_items.product_id
    WHERE cart_items.cart_id = $1
    `;
    const { rows: [user] } = await db.query(sql, [id]);
    return user;
}
// adds the same item again to the cart
export async function addItemToCart(userId, productId, quantity) {
    quantity = 1
    const cart = await getCartByUserId(userId);
    if (existingItem) {
        // update quantity if item already exists
        const sql = `
        UPDATE cart_items
        SET quantity = quantity + 1
        WHERE cart_id = $2 AND product_id=$3
        RETURNING *
        `;
        const { rows: [updatedItem] } = await db.query(sql, [cart.id, productId, quantity]);
        return updatedItem;
    } else {
        // insert new item to order
        const sql = `
        INSERT INTO cart_items (cart_id, product_id, quantity)
        VALUES ($1, $2, $3)
        RETURNING *
        `;
        const { rows: [newItem] } = await db.query(sql, [cart.id, productId, quantity]);
        return newItem;
    }
}
// adds item to cart
export async function updateCartItemQuantity(userId, productId, quantity) {
    const cart = await getCartByUserId(userId)
    
    if(quantity <= 0) {
        return await removeItemFromCart(userId, productId);
    }
    const sql = `
    UPDATE cart_items
    SET quantity = $1
    WHERE cart_id = $2 AND product_id = $3
    RETURNING *
    `;
    const { rows: [updatedItem] } = await db.query(sql, [cart.id, productId, quantity]);
    return updatedItem;
}
// removes item from cart
export async function removeItemFromCart(userId, productId) {
    const cart = await getCartByUserId(userId)
    
    const sql = `
    DELETE FROM cart_items
    WHERE cart_id = $1 AND product_id = $2
    RETURNING *
    `;
    const { rows: [removedItem] } = await db.query(sql, [cart.id, productId]);
    return removedItem;
}

