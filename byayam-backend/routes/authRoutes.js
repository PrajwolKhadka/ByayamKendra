import express from 'express';
import { signup, login,getAllUser,updateUsers,deleteUsers} from '../controller/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/users',getAllUser);
router.put('/users/:id', updateUsers );
router.delete('/users/:id',deleteUsers );


export default router;
