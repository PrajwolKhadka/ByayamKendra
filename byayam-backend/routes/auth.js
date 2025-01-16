import express from 'express';
import { pool } from './db.js'; // Import the database pool
import bcrypt from 'bcrypt';

const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
  const { username, email, password, gender } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if username or email already exists
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1 OR username = $2', [email, username]);

    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Username or Email already exists' });
    }

    // Insert new user into the database
    const result = await pool.query(
      'INSERT INTO users (username, email, password, gender) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, email, hashedPassword, gender]
    );

    res.status(201).json({ message: 'User created successfully', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    // Check if user exists
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Compare the hashed password with the provided password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // If the password is correct, return a success message
    res.status(200).json({ message: 'Login successful', user: { username: user.username, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
