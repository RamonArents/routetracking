import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'routetracking',
  password: '',
  port: 5432,
});

app.post('/api/create-account', async (req, res) => {
  const { name, surname, company, phonenumber, email, password } = req.body;

  try {
    await pool.query(
      'INSERT INTO users (name, surname, company, phonenumber, email, passwd) VALUES ($1, $2, $3, $4, $5, $6)',
      [name, surname, company, phonenumber, email, password]
    );
    res.status(200).json({ message: 'Account created' });
  } catch (error) {
    console.error('DB error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
