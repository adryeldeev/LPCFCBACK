import express from 'express';
import { registerUser, loginUser } from '../controllers/authController';

const router = express.Router();

router.post('/register', registerUser); // Para usuários comuns
router.post('/login', loginUser);

export default router;