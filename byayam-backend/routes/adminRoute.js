import express from 'express';
import { addAdminWorkoutController } from '../controller/adminController.js'; 
import verifyToken from '../middleware/verifyToken.js'; 
import upload from '../middleware/upload.js'; // Import the multer upload middleware

const router = express.Router();

// Route to add a new workout (admin only)
router.post('/adminworkouts', upload.single('imageFile'),verifyToken, addAdminWorkoutController); // Use multer middleware

export default router;