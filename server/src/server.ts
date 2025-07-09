import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

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
const port = 4000;

app.use(cors());
app.use(express.json());

const executeQuery = (query:string) => {
  try{
    const response:object = pool.query(query);

    console.log("Query executed");
    console.log(response);
  } catch(err){
    console.error(err);
  }
}

const createDB = "CREATE DATABASE IF NOT EXISTS routetracking;";

const createTable = "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT (50), surname TEXT (50), company TEXT (50), phonenumber INTEGER (20), email TEXT (50), passwd TEXT (200));";

//executeQuery(createDB);
executeQuery(createTable);

//create account for user
app.post("/adduser", async (req, res) => {
  const name:string = req.body["name"];
  const surname:string = req.body["surname"];
  const company:string = req.body["company"];
  const phonenumber:number = req.body["phonenumber"];
  const email:string = req.body["email"];
  const password:string = req.body["password"];

  try{
    const saltRounds:number = 10;
    const hashedPassword:string = await bcrypt.hash(password, saltRounds);

    const insertUser:string = "INSERT INTO users (name, surname, company, phonenumber, email, passwd) VALUES ($1, $2, $3, $4, $5, $6);";

    const params:Array<string | number> = [name, surname, company, phonenumber, email, hashedPassword];

    const response:object = pool.query(insertUser, params);

    console.log("Query executed");
    console.log(response);

    res.send("User added successfully");
  } catch (err){
    console.error(`There was an error: ${err}`);
    res.status(500).send("Error inserting user");
  }
  
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
