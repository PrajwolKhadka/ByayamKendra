import express from'express';
import {getChallenge,updateChallenges,deleteChallenges,addChallenges,getDayChallenge} from  '../controller/challengesController.js'
import verifyToken from '../middleware/verifyToken.js'; 
const router = express.Router();
// Routes for challenges
router.get('/challenges', verifyToken, getChallenge);
router.post('/challenges', verifyToken, addChallenges);
router.put('/challenges', verifyToken,updateChallenges);
router.delete('/challenges/:id', verifyToken, deleteChallenges);
router.get('/daily',verifyToken, getDayChallenge);
export default router;
