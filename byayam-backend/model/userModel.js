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
  try{
  const result = await pool.query('SELECT * FROM users');
  return result.rows;
  } catch (error) {
    console.error('Error fetching all users:', error);
  }
};

export const updateUser  = async (id, userData) => {
  const { username, email, password, gender, role } = userData;
  const result = await pool.query(
    'UPDATE users SET username = $1, email = $2, password = $3, gender = $4, role = $5 WHERE id = $6 RETURNING *',
    [username, email, password, gender, role, id]
  );
  return result.rows[0];
};

export const deleteUser  = async (id) => {
  const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};