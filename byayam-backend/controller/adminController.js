import multer from 'multer';
import path from 'path';
import { addAdminWorkout,updateAdminWorkout,deleteAdminWorkout,getAllAdminWorkouts } from '../model/adminModel.js';
 
// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Append file extension
  }
});

const upload = multer({ storage: storage });

// Add a new workout for admin
export const addAdminWorkoutController = async (req, res) => {
  try {
    const workoutData = req.body;
    const imageUrl = req.file ? req.file.path : null; // Get the file path

    workoutData.imageUrl = imageUrl; // Add image URL to workout data

    const newWorkout = await addAdminWorkout(workoutData);

    if (!newWorkout) {
      return res.status(500).json({ error: 'Failed to save workout' });
    }

    res.status(201).json({ message: 'Workout added successfully', newWorkout });
  } catch (error) {
    console.error('Error adding workout:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

export const updateAdminWorkoutController =async (req, res) => {
  const { id } = req.params; // Get the workout ID from the URL parameters
  const workoutData = req.body; // Get the updated workout data from the request body

  if (req.file) {
    workoutData.imageUrl = req.file.path; // Update image URL if a new file is uploaded
  }

  try {
    const updatedWorkout = await updateAdminWorkout(id, workoutData);
    if (!updatedWorkout) {
      return res.status(404).json({ error: 'Workout not found' });
    }
    res.json({ message: 'Workout updated successfully', updatedWorkout });
  } catch (error) {
    console.error('Error updating workout:', error);
    res.status(500).json({ error: 'Failed to update workout' });
  }
};

export const deleteAdminWorkoutController = async (req, res) => {
  const { id } = req.params; // Get the workout ID from the URL parameters

  try {
    const deletedWorkout = await deleteAdminWorkout(id);
    if (!deletedWorkout) {
      return res.status(404).json({ error: 'Workout not found' });
    }
    res.json({ message: 'Workout deleted successfully', deletedWorkout });
  } catch (error) {
    console.error('Error deleting workout:', error);
    res.status(500).json({ error: 'Failed to delete workout' });
  }
};

export const getAllAdminWorkoutsController = async (req, res) => {
  try {
    const workouts = await getAllAdminWorkouts();
    const workoutsWithFullImageUrl = workouts.map(workout => ({
      ...workout,
      imageUrl: workout.imageUrl ? `http://localhost:3000/${workout.imageUrl}` : null
    }));
    res.json(workoutsWithFullImageUrl); // Respond with the list of workouts
  } catch (error) {
    console.error('Error retrieving workouts:', error);
    res.status(500).json({ error: 'Failed to retrieve workouts' });
  }
};

import { getWorkoutsByUserStatus } from '../model/adminModel.js';

export const fetchUserWorkouts = async (req, res) => {
    try {
        const { age, weight, height, fitness_level } = req.query;

        if (!age || !weight || !height || !fitness_level) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const workouts = await getWorkoutsByUserStatus({ age, weight, height, fitness_level });
        res.json({ workouts });
    } catch (error) {
        res.status(500).json({ message: "Error fetching workouts" });
    }
};