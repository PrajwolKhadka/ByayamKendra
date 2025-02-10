import multer from 'multer';
import path from 'path';
import { addAdminWorkout } from '../model/adminModel.js';

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