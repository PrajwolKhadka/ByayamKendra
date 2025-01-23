// trackerRoutes.js
import express from 'express';
import verifyToken from '../middleware/verifyToken.js'; // Import the verifyToken middleware
import { getUserWorkouts, addWorkout, updateWorkout, deleteWorkout } from '../controller/trackerController.js'; 

const router = express.Router();

// Route to get all workouts for the logged-in user
router.get('/workouts', verifyToken, getUserWorkouts); // Apply verifyToken

// Route to add a new workout
router.post('/workouts', verifyToken, addWorkout); // Apply verifyToken

// Route to update an existing workout
router.put('/workouts/:id', verifyToken, updateWorkout); // Apply verifyToken

// Route to delete a workout
router.delete('/workouts/:workoutId',verifyToken, deleteWorkout); // Apply verifyToken

export default router;
