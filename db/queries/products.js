import db from "#db/client";

export async function createProduct(title, description, price) {
  const sql = `
    INSERT INTO products
    (title,description,price)
    VALUES 
    ($1, $2, $3)
    RETURNING *
    `;
  const {
    rows: [product]
  } = await db.query(sql, [title, description, price]);
  return product;
}

export async function getProducts() {
  const sql = `
    SELECT *
    FROM products
    `;
  const { rows: products } = await db.query(sql);
  return products;
}

export async function getProductsById(id) {
  const sql = `
    SELECT *
    FROM products
    WHERE id = $1
    `;
  const {
    rows: [product]
  } = await db.query(sql, [id]);
  return product;
}

export async function getProductsByOrderId(id) {
  const sql = `
    SELECT products.*
    FROM 
        products
        JOIN orders_products ON orders_products.product_id = products.id
    WHERE orders_products.order_id = $1
    `;
  const { rows: products } = await db.query(sql, [id]);
  return products;
}

export async function getOrdersByProductId(productId, userId) {
  const sql = `
    SELECT o.*
    FROM orders AS o
    JOIN orders_products AS op ON o.id = op.order_id
    WHERE op.product_id = $1 AND o.user_id = $2
  `;
  const { rows: orders } = await db.query(sql, [productId, userId]);
  return orders;
}