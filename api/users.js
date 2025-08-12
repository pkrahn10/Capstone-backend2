import express from "express";
const router = express.Router();
export default router;

import { createUser } from "#db/queries/users";
import { getUserByEmailAndPassword } from "#db/queries/users";
import { createToken } from "#utils/jwt";
import requireBody from "#middleware/requireBody";

  // creates a new login attempt by an existing user
  router.post("/login", requireBody(["email", "password"]), async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmailAndPassword(email, password);
    if (!user) {
      return res.status(401).send("Invalid credentials");
    }
    const token = createToken({ id: user.id }); 
    res.send(token);
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send("Internal server error");
  }
})
// creates a new register attempted by a new user
router.post("/register", requireBody(["name", "email", "password"]), async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await createUser(name, email, password);
        const token = createToken({id: user.id});
        res.status(201).json({user: {id: user.id, name: user.name, email: user.email}, token});
    } catch (error) {
        console.error("Registration error:", error);
        res.status(400).json({error: "User registration failed"});
    }
});