import express from "express";
const router = express.Router();
export default router;

import { getProducts, getProductsById } from "#db/queries/products";
import { getOrdersByProductId } from "#db/queries/products";
import requireUser from "#middleware/requireUser";

router.route("/").get(async (req, res) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).send("Internal server error");
  }
});

router.param("id", async (req, res, next, id) => {
  try {
    const product = await getProductsById(parseInt(id));
    if (!product) return res.status(404).send("Product not found");
    req.product = product;
    next();
  } catch (error) {
    console.error("Error in product param middleware:", error);
    res.status(500).send("Internal server error");
  }
});

router.route("/:id").get(async (req, res) => {
  res.json(req.product);
});

router.route("/:id/orders").get(requireUser, async (req, res) => {
  try {
    const orders = await getOrdersByProductId(req.product.id, req.user.id);
    res.json(orders);
  } catch (error) {
    console.error("Error getting product orders:", error);
    res.status(500).send("Internal server error");
  }
});