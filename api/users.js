import express from "express";
const router = express.Router();
export default router;

import { createUser } from "#db/queries/users";
import { getUserByEmailAndPassword } from "#db/queries/users";
import { createToken } from "#utils/jwt";
import requireBody from "#middleware/requireBody";

// router
//   .route("/login")
//   .post(requireBody(["email", "password"]), async (req, res) => {
//     const { email, password } = req.body;
//     const user = await getUserByEmailAndPassword(email, password);
//     if (!user) return res.status(401).send("Invalid email or password");
//     if (!email) {
//       return res.status(400).send("User not found");
//     }
//     if (!password) {
//       return res.status(400).send("Password not found");
//     }
//     const token = createToken({ id: user.id });
//     res.send(token);
//   });
  
  
  
  router.post("/register", requireBody(["name", "email", "password"]), async (req, res) => {
    const { name, email, password } = req.body;
    try {
          const user = await createUser(name, email, password);
          const token = createToken({id: user.id})
          res.status(201).json({user: {id: user.id, name: user.name, email: user.email}, token})
    if (!email) {
      return res.status(400).send("User not found");
    }
    if (!password) {
      return res.status(400).send("Password not found");
    }
    res.status(201).send(token);
    } catch (error) {
      console.error("User already exists");
    }

  });
  
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