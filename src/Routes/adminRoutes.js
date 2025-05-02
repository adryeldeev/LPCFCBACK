import express from 'express';
import { checkAdmin } from '../Middlewares/adminMiddleware.js';
import { createAdmin } from '../Controllers/adminController.js';
import { authenticateToken } from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create-admin', authenticateToken, checkAdmin, createAdmin);

export default router;