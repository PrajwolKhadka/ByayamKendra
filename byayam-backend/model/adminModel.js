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
    workoutData.imageUrl // This will now contain the path from multer
  ];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error adding admin workout:', error);
    throw error;
  }
};

// Update an existing workout
export const updateAdminWorkout = async (id, workoutData) => {
  const query = `
    UPDATE adminworkouts
    SET name = $1, description = $2, min_age = $3, max_age = $4, min_weight = $5, max_weight = $6, min_height = $7, max_height = $8, fitness_level = $9, image_url = $10
    WHERE id = $11
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
    workoutData.imageUrl, // This will now contain the updated path from multer
    id
  ];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error updating admin workout:', error);
    throw error;
  }
};

// Delete a workout
export const deleteAdminWorkout = async (id) => {
  const query = `
    DELETE FROM adminworkouts
    WHERE id = $1
    RETURNING *;
  `;
  const values = [id];

  try {
    const result = await pool.query(query, values);
    return result.rows[0]; // Return the deleted workout details
  } catch (error) {
    console.error('Error deleting admin workout:', error);
    throw error;
  }
};

// Get all workouts
export const getAllAdminWorkouts = async () => {
  const query = `
    SELECT * FROM adminworkouts;
  `;

  try {
    const result = await pool.query(query);
    return result.rows; // Return all workouts
  } catch (error) {
    console.error('Error retrieving admin workouts:', error);
    throw error;
  }
};

// Get a workout by ID
export const getAdminWorkoutById = async (id) => {
  const query = `
    SELECT * FROM adminworkouts
    WHERE id = $1;
  `;
  const values = [id];

  try {
    const result = await pool.query(query, values);
    return result.rows[0]; // Return the workout if found
  } catch (error) {
    console.error('Error retrieving admin workout by ID:', error);
    throw error;
  }
};

export const getWorkoutsByUserStatus = async ({ age, weight, height, fitness_level }) => {
  const query = `
       SELECT * FROM adminworkouts 
        WHERE min_age <= $1::integer AND max_age >= $1::integer
        AND min_weight <= $2::decimal AND max_weight >= $2::decimal
        AND min_height <= $3::decimal AND max_height >= $3::decimal
        AND fitness_level = $4;
  `;

  const values = [age, weight, height, fitness_level];

  try {
      const result = await pool.query(query, values);
      return result.rows;
  } catch (error) {
      console.error('Error fetching workouts:', error);
      throw error;
  }
};