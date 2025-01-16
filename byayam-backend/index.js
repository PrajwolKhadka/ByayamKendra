import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.js'; // Import the auth routes
import { createUsersTable } from './routes/db.js'; // Create users table function
import { pool } from './routes/db.js'; // Import pool for db connection

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Create the users table (you can also check if it exists before creating)
createUsersTable();

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse JSON data

// Routes
app.use('/api/auth', authRoutes); // Use the authentication routes

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
