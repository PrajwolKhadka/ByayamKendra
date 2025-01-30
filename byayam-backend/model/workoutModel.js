import { pool } from '../db/db.js';  // Assuming you're using a connection pool

// Add a workout log for a user
export const addStatusLog = async (userId, age, height, weight, gender, fitness_level) => {
  const query = `
    INSERT INTO userstate (user_id, age, height, weight, gender,fitness_level)
    VALUES ($1, $2, $3, $4, $5,$6)
    RETURNING *;
  `;
  const values = [userId, age, height, weight, gender,fitness_level];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error adding workout log:', error);
    throw error;
  }
};

// Get workout logs by userId
export const getStateByUserId = async (userId) => {
  const query = 'SELECT * FROM userstate WHERE user_id = $1;';
  const values = [userId];

  try {
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error('Error getting workout logs:', error);
    throw error;
  }
};

// Update a workout log
export const updateStatusLog = async (StatusId, userId, age, height, weight, gender, fitness_level) => {
  const query = `
    UPDATE userstate
    SET age = $2, height = $3, weight = $4, gender = $5, fitness_level = $6
    WHERE id = $1 AND user_id = $7
    RETURNING *;
  `;
  console.log("Updating status with values:", { StatusId, age, height, weight, gender, fitness_level, userId });
  const values = [StatusId, age, height, weight, gender, fitness_level, userId];
  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error updating workout log:', error);
    throw error;
  }
};

// Delete a workout log
export const deleteStatusLog = async (StatusId, userId) => {
  const query = 'DELETE FROM userstate WHERE id = $1 AND user_id = $2;';
  const values = [StatusId, userId];
  try {
    await pool.query(query, values);
    return true;
  } catch (error) {
    console.error('Error deleting workout log:', error);
    throw error;
  }
};
export const getStatusById = async (StatusId, userId) => {
  try {
    console.log(StatusId,userId)
    const query = `SELECT * FROM userstate WHERE id = $1 AND user_id = $2`;
    const values = [StatusId, userId];
    const result = await pool.query(query, values);
    if (result.rows.length > 0) {
      return result.rows[0];
    }
    return null;  // No workout found
  } catch (error) {
    console.error('Error fetching workout:', error);
    throw error;
  }
};