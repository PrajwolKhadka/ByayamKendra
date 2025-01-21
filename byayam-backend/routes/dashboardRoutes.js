import express from 'express';
import verifyToken from '../middleware/verifyToken.js'; // Adjust path if necessary

const router = express.Router();

router.get('/dashboard', verifyToken, (req, res) => {
  res.json({ message: 'Welcome to your dashboard' });
});

export default router;
