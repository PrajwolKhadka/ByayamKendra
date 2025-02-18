import express from 'express';
import { addAdminWorkoutController,updateAdminWorkoutController,deleteAdminWorkoutController,getAllAdminWorkoutsController,fetchUserWorkouts } from '../controller/adminController.js'; 
import verifyToken from '../middleware/verifyToken.js'; 
import upload from '../middleware/upload.js'; // Import the multer upload middleware

const router = express.Router();

// Route to add a new workout (admin only)
router.post('/adminworkouts', upload.single('imageFile'),verifyToken, addAdminWorkoutController); // Use multer middleware
router.put('/adminworkouts/:id', upload.single('imageFile'), verifyToken,updateAdminWorkoutController);
router.delete('/adminworkouts/:id', verifyToken,deleteAdminWorkoutController);
router.get('/adminworkouts', verifyToken,getAllAdminWorkoutsController);
router.get('/filter', verifyToken, fetchUserWorkouts);
export default router;