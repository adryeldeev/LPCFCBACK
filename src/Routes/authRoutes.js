import express from 'express';
import { registerUser, loginUser } from '../Controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser); // Para usuários comuns
router.post('/login', loginUser);

export default router;