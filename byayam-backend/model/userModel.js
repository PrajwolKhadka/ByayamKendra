import { pool } from '../db/db.js';

export const createUser = async (username, email, password, gender, role) => {
  try {
    const query = 'INSERT INTO users (username, email, password, gender, role) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [username, email, password, gender, role];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating user:', error); // Log the full error for debugging
    throw new Error(process.env.NODE_ENV === 'production' ? 'Database error during user creation' : error.message);
  }
};

export const findUserByEmailOrUsername = async (email, username) => {
  try {
    const query = 'SELECT * FROM users WHERE email = $1 OR username = $2';
    const values = [email, username];
    const result = await pool.query(query, values);
    return result.rows;  // Returns an array
  } catch (error) {
    console.error('Error finding user:', error);
    throw new Error('Database error during user lookup');
  }
};

export const findUserByEmail = async (email) => {
  const query = `
    SELECT * FROM users 
    WHERE email = $1;
  `;
  const { rows } = await pool.query(query, [email]);
  return rows[0]; // Ensure this returns the user object including the role
};

export const getAllUsers = async () => {
  try {
    const result = await pool.query('SELECT id, username, email, gender, role FROM users');
    return result.rows;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};

// In userModel.js
export const updateUser = async (id, userData) => {
  const fields = [];
  const values = [];
  let paramIndex = 1;

  Object.entries(userData).forEach(([key, value]) => {
    if (value !== undefined) {
      fields.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
  });

  if (fields.length === 0) throw new Error("No fields to update");

  values.push(id);
  const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const deleteUser  = async (id) => {
  const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};