import pkg from 'pg';
const { Pool } = pkg;

import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD, 
  port: process.env.DB_PORT, 
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
        gender VARCHAR(10) NOT NULL,
        role VARCHAR(10) NOT NULL DEFAULT 'user'
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

export const createUserStateTable = async () => {
  try{
    const query = `
    CREATE TABLE IF NOT EXISTS userstate(
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE  CASCADE,
    age INT,  
    height VARCHAR,
    weight INT,
    gender VARCHAR(10),
    fitness_level VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`;
  await pool.query(query);
  console.log("Status table is ready");
  }catch (err){
    console.error("Error creating status table", err);
  }
}

export { pool };
