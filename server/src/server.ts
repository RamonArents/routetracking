import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

//DB connection
const { Pool } = require("pg");

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
  origin:"http://localhost:5173",
  credentials:true,
}));
app.use(express.json());

//create account for user
app.post("/adduser", async (req, res) => {
  const name:string = req.body["name"];
  const surname:string = req.body["surname"];
  const company:string = req.body["company"];
  const phonenumber:string = req.body["phonenumber"];
  const email:string = req.body["email"];
  const password:string = req.body["password"];

  try{
    const saltRounds:number = 10;
    const hashedPassword:string = await bcrypt.hash(password, saltRounds);

    const insertUser:string = "INSERT INTO users (name, surname, company, phonenumber, email, passwd) VALUES ($1, $2, $3, $4, $5, $6);";

    const params:Array<string> = [name, surname, company, phonenumber, email, hashedPassword];

    const response:object = pool.query(insertUser, params);

    console.log("Query executed");
    console.log(response);

    res.send("User added successfully");
  } catch (err){
    console.error(`There was an error: ${err}`);
    res.status(500).send("Error inserting user");
  }
  
});

//login route
//TODO: Setup frontend for login. Use correct database URL and JWT token (see ChatGpt)
const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = router;
