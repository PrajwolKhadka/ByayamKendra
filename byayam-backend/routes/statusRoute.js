
import express from 'express';
import verifyToken from '../middleware/verifyToken.js'; // Import the verifyToken middleware
import {addStatus,updateStatus,getUserStatus,deleteStatus} from '../controller/workoutController.js'; 

const router = express.Router();

// Route to get all workouts for the logged-in user
router.get('/Status', verifyToken, getUserStatus); // Apply verifyToken

// Route to add a new workout
router.post('/Status', verifyToken, addStatus); // Apply verifyToken

// Route to update an existing workout
router.put('/Status/:id', verifyToken, updateStatus); // Apply verifyToken

// Route to delete a workout
router.delete('/Status/:StatusId',verifyToken, deleteStatus); // Apply verifyToken

export default router;
