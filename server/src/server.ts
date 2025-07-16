import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { UserCreatePayload } from './types/user';

const cookieParser = require("cookie-parser");
dotenv.config();

//DB connection
const { Pool } = require("pg");

//JWT
const jwt = require("jsonwebtoken");

//Routes
const authRoutes = require("./routes/auth");

//data from .env file
const pool = new Pool({
  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: process.env.PORT,
  database: process.env.DATABASE,
});

const app = express();
const router = express.Router();
const port = 4000;

app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

//authmiddleware (for routes that are not accessable when user is not logged in)
function authMiddleWare(req: any, res: any, next: any) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" })
  }
}

//create account for user
app.post("/adduser", async (req: any, res: any) => {
  const payload: UserCreatePayload = req.body;

  if (!payload.passwd || payload.passwd.trim() === "" || typeof payload.passwd !== "string") {
    console.error('Invalid password input: ', payload.passwd);
    return res.status(400).json({ error: "Password is required" });
  }

  try {

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(payload.passwd, saltRounds);

    const insertUser = "INSERT INTO users (name, surname, company, phonenumber, email, passwd) VALUES ($1, $2, $3, $4, $5, $6);";

    const params = [payload.name, payload.surname, payload.company, payload.phonenumber, payload.email, hashedPassword];

    const response = await pool.query(insertUser, params);

    console.log("Query executed");
    console.log(response);

    res.status(201).json({ message: "User created" });
  } catch (err: any) {
    console.error(`There was an error: ${err}`);

    if (err.code === "23505") { // Email not unique
      return res.status(409).json({ error: "Email already exists" });
    }

    return res.status(500).json({ error: "Internal server error" });
  }

});

//login route
app.use("/api", authRoutes);

//Useroverview route
app.get("/api/useroverview", authMiddleWare, (req:any, res:any) => {
  res.json({ user: req.user })
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = router;
