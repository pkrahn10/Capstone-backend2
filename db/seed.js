import db from "#db/client";

import { createProduct } from "./queries/products.js";
import { createUser } from "./queries/users.js";
import { createOrder } from "./queries/orders.js";
import { createOrderProduct } from "./queries/orders_products.js";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // Create a test user
  const user = await createUser("parker", "testuser", "password123");
  console.log("Created user:", user.username);

  // Create at least 10 products
  const products = [];
  for (let i = 1; i <= 15; i++) {
    const product = await createProduct(
      `Product ${i}`,
      `Description for product ${i}`,
      Math.floor(Math.random() * 100) + 1
    );
    products.push(product);
    console.log(`Created product: ${product.title}`);
  }

  // Create an order for the user
  const order = await createOrder("2024-01-15", "Test order", user.id);
  console.log("Created order:", order.id);

  // Add at least 5 distinct products to the order
  for (let i = 0; i < 5; i++) {
    await createOrderProduct(
      order.id,
      products[i].id,
      Math.floor(Math.random() * 5) + 1,
      10
    );
    console.log(`Added product ${products[i].id} to order ${order.id}`);
  }
}