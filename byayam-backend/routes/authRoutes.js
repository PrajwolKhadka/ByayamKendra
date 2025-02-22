import express from 'express';
import { signup, login,getAllUser,updateUsers,deleteUsers,getEmailUser} from '../controller/authController.js';
import verifyToken from '../middleware/verifyToken.js';
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/users',getAllUser);
router.get('/email',verifyToken,getEmailUser);
router.put('/users/:id', updateUsers );
router.delete('/users/:id',deleteUsers );


export default router;
