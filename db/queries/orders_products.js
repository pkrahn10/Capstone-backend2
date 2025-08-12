import db from "#db/client";
// creates the specific order with a product
export async function createOrderProduct(orderId, productId, quantity, price_at_purchase) {
  const sql = `
    INSERT INTO orders_products 
    (order_id, product_id, quantity, price_at_purchase)
    VALUES
    ($1, $2, $3, $4)
    RETURNING *
    `;
  const {
    rows: [orderProduct]
  } = await db.query(sql, [orderId, productId, quantity, price_at_purchase]);
  return orderProduct;
}