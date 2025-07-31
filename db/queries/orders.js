import db from "../../../db/client.js";

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

export async function getOrdersByUserId(id) {
  const sql = `
  SELECT *
  FROM orders
  WHERE user_id = $1
  `;
  const { rows: orders } = await db.query(sql, [id]);
  return orders;
}

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