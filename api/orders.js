import express from "express";
const router = express.Router();
export default router;

import {
  createProduct,
  getProductsById,
  getOrdersByProductId,
  getProductsByOrderId
} from "#db/queries/products";

import { createOrderProduct } from "#db/queries/orders_products";
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";
import {
  createOrder,
  getOrderById,
  getOrdersByUserId
} from "#db/queries/orders";

router.use(requireUser);
// creates a new order
router.route("/").post(requireBody(["date"]), async (req, res) => {
  try {
    const { date, note } = req.body;
    const order = await createOrder(date, note, req.user.id);
    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).send("Internal server error");
  }
});
// gets all orders by a specific user
router.route("/").get(async (req, res) => {
  try {
    const orders = await getOrdersByUserId(req.user.id);
    res.json(orders);
  } catch (error) {
    console.error("Error getting orders:", error);
    res.status(500).send("Internal server error");
  }
});
// finds a specific order by its id
router.param("id", async (req, res, next, id) => {
  try {
    const order = await getOrderById(parseInt(id));
    if (!order) return res.status(404).send("Order not found.");

    if (order.user_id !== req.user.id)
      return res
        .status(403)
        .send("You do not have permission to access this order.");

    req.order = order;
    next();
  } catch (error) {
    console.error("Error in order param middleware:", error);
    res.status(500).send("Internal server error");
  }
});

// gets all products related to a specific order
router.route("/:id/products").get(async (req, res) => {
  try {
    const products = await getProductsByOrderId(req.order.id);
    res.json(products);
  } catch (error) {
    console.error("Error getting order products:", error);
    res.status(500).send("Internal server error");
  }
});
// add a product to an already existing order
router
  .route("/:id/products")
  .post(requireBody(["productId", "quantity"]), async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const orderId = req.order.id;

      // Check if product exists
      const product = await getProductsById(productId);
      if (!product) {
        return res.status(400).send("Product not found");
      }
      let price_at_purchase = product.price * quantity
      // Add product to order
      const orderProduct = await createOrderProduct(
        orderId,
        productId,
        quantity,
        price_at_purchase
      );

      res.status(201).json(orderProduct);
    } catch (error) {
      console.error("Error adding product to order:", error);
      res.status(500).send("Internal server error");
    }
  });
  
  // returns the specific order
router.route("/:id").get(async (req, res) => {
  res.json(req.order);
});