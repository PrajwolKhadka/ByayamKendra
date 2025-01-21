import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { getDashboard } from '../controller/ProtectedController.js';

const router = express.Router();

router.get('/dashboard', verifyToken, getDashboard);

export default router;
