import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {
  addWorkoutLog,
  getWorkoutLogsByUserId,
  updateWorkoutLog,
  deleteWorkoutLog,
  getWorkoutById,
} from '../model/trackerModel.js';

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

// Middleware to verify the JWT token and extract the user ID
const verifyTokenAndGetUserId = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    throw new Error('No token provided');
  }
  const decoded = jwt.verify(token, jwtSecret);
  console.log('Decoded JWT:', decoded); // Add this log to check if the user ID is correct
  return decoded.id; // User ID from JWT
};


export const addWorkout = async (req, res) => {
  try {
    const userId = verifyTokenAndGetUserId(req);
    const { workoutName, weight, reps, description } = req.body;

    // Validation checks
    if (!workoutName?.trim() || !weight || !reps || !description?.trim()) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Trim whitespace from text fields
    const trimmedName = workoutName.trim();
    const trimmedDesc = description.trim();

    const newLog = await addWorkoutLog(
      userId, 
      trimmedName, 
      weight, 
      reps, 
      trimmedDesc
    );

    if (!newLog) {
      return res.status(500).json({ error: 'Failed to save workout log' });
    }

    res.status(201).json({ message: 'Workout log saved successfully', newLog });
  } catch (error) {
    console.error('Error saving workout log:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

// Get workout logs for the logged-in user
export const getUserWorkouts = async (req, res) => {
  try {
    const userId = verifyTokenAndGetUserId(req);

    const workouts = await getWorkoutLogsByUserId(userId);

    if (!workouts || workouts.length === 0) {
      return res.status(404).json({ message: 'No workout logs found' });
    }

    res.status(200).json({ workouts });
  } catch (error) {
    console.error('Error fetching workouts:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

export const updateWorkout = async (req, res) => {
  try {
    const  workoutId = req.params.id;
    const userId = verifyTokenAndGetUserId(req);
    const {workoutName, weight, reps, description } = req.body;

    // Validation checks
    if (!workoutName?.trim() || !weight || !reps || !description?.trim()) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Trim whitespace from text fields
    const trimmedName = workoutName.trim();
    const trimmedDesc = description.trim();

    const updatedLog = await updateWorkoutLog(
      workoutId,
      userId,
      trimmedName,
      weight,
      reps,
      trimmedDesc
    );

    if (!updatedLog) {
      return res.status(404).json({ error: 'Workout log not found or unauthorized' });
    }

    res.status(200).json({ message: 'Workout log updated successfully', updatedLog });
  } catch (error) {
    console.error('Error updating workout log:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

// Delete a workout log
export const deleteWorkout = async (req, res) => {
  try {
    
    console.log('Received request with params:', req.params);
    const { workoutId } = req.params;

    const userId = verifyTokenAndGetUserId(req);

    const workout = await getWorkoutById(workoutId, userId);
    console.log(workout)
    if (!workout) {
      return res.status(404).json({ error: 'Workout log not found or unauthorized' });
    }

    const result = await deleteWorkoutLog(workoutId, userId);
    if (!result) {
      return res.status(500).json({ error: 'Failed to delete workout log' });
    }

    res.status(200).json({ message: 'Workout log deleted successfully' });
  } catch (error) {
    console.error('Error deleting workout log:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};
