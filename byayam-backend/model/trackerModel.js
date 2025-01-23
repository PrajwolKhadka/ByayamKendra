// workoutModel.js

import { pool } from '../db/db.js';  // Assuming you're using a connection pool

// Add a workout log for a user
export const addWorkoutLog = async (userId, workoutName, weight, reps, description) => {
  const query = `
    INSERT INTO workouts (user_id, workout_name, weight, reps, description)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const values = [userId, workoutName, weight, reps, description];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error adding workout log:', error);
    throw error;
  }
};

// Get workout logs by userId
export const getWorkoutLogsByUserId = async (userId) => {
  const query = 'SELECT * FROM workouts WHERE user_id = $1;';
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
export const updateWorkoutLog = async (workoutId, userId, workoutName, weight, reps, description) => {
  const query = `
    UPDATE workouts
    SET workout_name = $2, weight = $3, reps = $4, description = $5
    WHERE id = $1 AND user_id = $6
    RETURNING *;
  `;
  const values = [workoutId, workoutName, weight, reps, description, userId];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error updating workout log:', error);
    throw error;
  }
};

// Delete a workout log
export const deleteWorkoutLog = async (workoutId, userId) => {
  const query = 'DELETE FROM workouts WHERE id = $1 AND user_id = $2;';
  const values = [workoutId, userId];
  try {
    await pool.query(query, values);
    return true;
  } catch (error) {
    console.error('Error deleting workout log:', error);
    throw error;
  }
};
export const getWorkoutById = async (workoutId, userId) => {
  try {
    console.log(workoutId,userId)
    const query = `SELECT * FROM workouts WHERE id = $1 AND user_id = $2`;
    const values = [workoutId, userId];
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