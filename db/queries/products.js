import db from "#db/client";
// creates a new product
export async function createProduct(title, description, image, price) {
  const sql = `
    INSERT INTO products
    (title,description,image,price)
    VALUES 
    ($1, $2, $3, $4)
    RETURNING *
    `;
  const {
    rows: [product]
  } = await db.query(sql, [title, description, image, price]);
  return product;
}
// gets all products
export async function getProducts() {
  const sql = `
    SELECT *
    FROM products
    `;
  const { rows: products } = await db.query(sql);
  return products;
}
// gets a specific product from its id
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
// gets products that relate to a specific order
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
// gets orders that relate to a specific product
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