import express from 'express';
import { getDashboard } from '../controller/dashboardController.js';
import verifyToken from '../middleware/verifyToken.js';
const router = express.Router();


router.get('/dashAdmin',verifyToken, getDashboard);

export default router;
