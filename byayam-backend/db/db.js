import pkg from 'pg';
const { Pool } = pkg;

import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'byayamkendra',
  password: '1415', 
  port: 5432, 
});

// Function to create users table
export const createUsersTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        gender VARCHAR(10) NOT NULL
      );
    `;
    await pool.query(query);
    console.log("Users table is ready");
  } catch (err) {
    console.error("Error creating table", err);
  }
};
export const createTrackTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS workouts (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        workout_name VARCHAR(255) NOT NULL,
        weight VARCHAR(50),
        reps INT NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(query);
    console.log("Workouts table is ready");
  } catch (err) {
    console.error("Error creating workouts table", err);
  }
};

export { pool };
