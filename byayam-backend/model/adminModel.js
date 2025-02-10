import { pool } from '../db/db.js';  // Assuming you're using a connection pool

// Add a new workout
export const addAdminWorkout = async (workoutData) => {
  const query = `
    INSERT INTO adminworkouts (name, description, min_age, max_age, min_weight, max_weight, min_height, max_height, fitness_level, image_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;
  `;
  const values = [
    workoutData.name,
    workoutData.description,
    workoutData.minAge,
    workoutData.maxAge,
    workoutData.minWeight,
    workoutData.maxWeight,
    workoutData.minHeight,
    workoutData.maxHeight,
    workoutData.fitnessLevel,
    workoutData.imageUrl // Assuming you will handle image upload separately
  ];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error adding admin workout:', error);
    throw error;
  }
};