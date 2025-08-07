import express from "express";
const router = express.Router();
export default router;

import { createUser } from "#db/queries/users";
import { getUserByEmailAndPassword } from "#db/queries/users";
import { createToken } from "#utils/jwt";
import requireBody from "#middleware/requireBody";
// user can register an account
// router
//   .route("/register")
//   .post(requireBody(["email", "password"]), async (req, res) => {
//     const { email, password } = req.body;
//     const user = await createUser(email, password);
//     if (!email) {
//       return res.status(400).send("User not found");
//     }
//     if (!password) {
//       return res.status(400).send("Password not found");
//     }
//     res.status(201).send(token);
//   });
// user can loggin to an existing account
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
  
  
  
  router.post("/register", async (req,res) => {
    const { email, password } = req.body
    
    if(!email || !password) {
      return res.status(400).json({error: "Missing required fields"});
    }
    try {
      const existingUser = await db.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
      if (existingUser.rows.length > 0) {
        return res.status(409).json({ error: "User already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const {
        rows: [newUser],
      } = await db.query(
        `
        INSERT INTO users (email, password)
        VALUES ($1, $2)
        RETURNING id, email
        `,
        [email, hashedPassword]
      );
      
      res.status(201).json({ user: newUser });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Server error" });
    }
  });