import express from "express";
const app = express();
export default app;

import usersRouter from "#api/users";
import getUserFromToken from "#middleware/getUserFromToken";
import handlePostgresErrors from "#middleware/handlePostgresErrors";
import cors from "cors";
import morgan from "morgan";
import getUserFromToken from "#middleware/getUserFromToken";
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";
import { createUser, getUserByUsernameAndPassword } from "#db/queries/users";
import { signToken } from "#utils/jwt";
import ordersRouter from "#api/orders";
import productsRouter from "#api/products";

app.use(cors({ origin: process.env.CORS_ORIGIN ?? /localhost/ }));

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(getUserFromToken);

app.get("/", (req, res) => res.send("Hello, World!"));

app.use("/users", usersRouter);

app.use(handlePostgresErrors);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});


// User routes
app.post(
  "/users/register",
  requireBody(["email", "password"]),
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await createUser(email, password);
      const token = signToken({ id: user.id });
      res.status(201).send(token);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).send("Internal server error");
    }
  }
);

app.post(
  "/users/login",
  requireBody(["email", "password"]),
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await getUserByUsernameAndPassword(email, password);
      if (!user) {
        return res.status(401).send("Invalid credentials");
      }
      const token = signToken({ id: user.id });
      res.send(token);
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).send("Internal server error");
    }
  }
);

// API routes
app.use("/orders", ordersRouter);
app.use("/products", productsRouter);