import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { UserCreatePayload } from './types/user';

//DB connection
const { Pool } = require("pg");

//Routes
const authRoutes = require("./routes/auth");

dotenv.config();

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

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

//create account for user
app.post("/adduser", async (req: any, res: any) => {
  const payload: UserCreatePayload = req.body;

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
      res.status(409).json({ error: "Email already exists" });
    }

    res.status(500).json({ error: "Internal server error" });
  }

});

//login route
app.use("/api", authRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = router;
