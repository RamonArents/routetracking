const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

//login
router.post("/", async (req:any, res:any) => {
  const { email, password } = req.body;

  if(!email || !password){
    return res.status(400).json({ error: "Email and password are required" });
  }

  try{
    const result = await pool.query(
      "SELECT id, email, passwd FROM users WHERE email = $1",
      [email]
    );

    if(result.rows.length === 0){
      return res.status(401).json({ error: "User account not found." });
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.passwd);

    if(!passwordMatch){
      return res.status(401).json({ error: "Wrong password" });   
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });

  } catch(err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;