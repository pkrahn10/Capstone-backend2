import express from "express";
const router = express.Router();
export default router;

import { createUser } from "#db/queries/users";
import { getUserByEmailAndPassword } from "#db/queries/users";
import { createToken } from "#utils/jwt";

router
  .route("/register")
  .post(requireBody(["email", "password"]), async (req, res) => {
    const { email, password } = req.body;
    const user = await createUser(email, password);
    if (!email) {
      return res.status(400).send("User not found");
    }
    if (!password) {
      return res.status(400).send("Password not found");
    }
    res.status(201).send(token);
  });

router
  .route("/login")
  .post(requireBody(["email", "password"]), async (req, res) => {
    const { email, password } = req.body;
    const user = await getUserByEmailAndPassword(email, password);
    if (!user) return res.status(401).send("Invalid email or password");
    if (!email) {
      return res.status(400).send("User not found");
    }
    if (!password) {
      return res.status(400).send("Password not found");
    }
    const token = createToken({ id: user.id });
    res.send(token);
  });