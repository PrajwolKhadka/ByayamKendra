import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { addStatusLog,getStateByUserId,deleteStatusLog,updateStatusLog,getStatusById } from '../model/workoutModel.js';

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


// Add a workout log for the user
export const addStatus = async (req, res) => {
  try {
    const userId = verifyTokenAndGetUserId(req);
    const { age, height, weight, gender,fitness_level } = req.body;
    const existingLogs = await getStateByUserId(userId);
    if (existingLogs && existingLogs.length > 0) {
      return res.status(400).json({ error: 'Only one workout log is allowed per user.' });
    }
    const newLog = await addStatusLog(userId, age, height, weight, gender,fitness_level);

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
export const getUserStatus = async (req, res) => {
  try {
    const userId = verifyTokenAndGetUserId(req);

    const status = await getStateByUserId(userId);

    if (!status || status.length === 0) {
      return res.status(404).json({ message: 'No workout logs found' });
    }

    res.status(200).json({ status });
  } catch (error) {
    console.error('Error fetching workouts:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

// Update a workout log
export const updateStatus = async (req, res) => {
  try {
    const userId = verifyTokenAndGetUserId(req);
    const { StatusId,age, height, weight, gender,fitness_level} = req.body;
    console.log("updating with"+ StatusId,age, height, weight, gender,fitness_level)
    const updatedLog = await updateStatusLog(StatusId,userId,age, height, weight, gender,fitness_level);
    console.log(StatusId);
    if (!updatedLog) {
      return res.status(404).json({ error: 'Status not found or unauthorized' });
    }

    res.status(200).json({ message: 'Status updated successfully', updatedLog });
  } catch (error) {
    console.error('Error updating status log:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

// Delete a workout log
export const deleteStatus = async (req, res) => {
  try {
    
    console.log('Received request with params:', req.params);
    const { StatusId } = req.params;

    const userId = verifyTokenAndGetUserId(req);

    const status = await getStatusById(StatusId, userId);
    console.log(status)
    if (!status) {
      return res.status(404).json({ error: 'Status not found or unauthorized' });
    }

    const result = await deleteStatusLog(StatusId, userId);
    if (!result) {
      return res.status(500).json({ error: 'Failed to delete status log' });
    }
  } catch (error) {
    console.error('Error deleting workout log:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};
