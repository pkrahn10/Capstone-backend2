import db from "#db/client";
// creates a new order
export async function createOrder(date, note, user_id) {
  const sql = `
  INSERT INTO orders
    (date, note, user_id)
  VALUES
    ($1, $2, $3)
  RETURNING *
  `;
  const {
    rows: [order],
  } = await db.query(sql, [date, note, user_id]);
  return order;
}
// gets an order from a specific user
export async function getOrdersByUserId(id) {
  const sql = `
  SELECT *
  FROM orders
  WHERE user_id = $1
  `;
  const { rows: orders } = await db.query(sql, [id]);
  return orders;
}
// gets a specific order
export async function getOrderById(id) {
  const sql = `
  SELECT *
  FROM orders
  WHERE id = $1
  `;
  const {
    rows: [order],
  } = await db.query(sql, [id]);
  return order;
}