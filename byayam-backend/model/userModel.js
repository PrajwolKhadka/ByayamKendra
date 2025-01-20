import { pool } from '../db/db.js';

export const createUser = async (username, email, hashedPassword, gender) => {
  const query = `
    INSERT INTO users (username, email, password, gender) 
    VALUES ($1, $2, $3, $4) RETURNING *;
  `;
  const values = [username, email, hashedPassword, gender];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const findUserByEmailOrUsername = async (email, username) => {
  const query = `
    SELECT * FROM users 
    WHERE email = $1 OR username = $2;
  `;
  const values = [email, username];
  const { rows } = await pool.query(query, values);
  return rows;
};

export const findUserByEmail = async (email) => {
  const query = `
    SELECT * FROM users 
    WHERE email = $1;
  `;
  const { rows } = await pool.query(query, [email]);
  return rows[0];
};
