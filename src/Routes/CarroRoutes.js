import express from 'express';

import { checkAdmin } from '../Middlewares/adminMiddleware.js';
import { authenticateToken } from '../Middlewares/authMiddleware.js';
import { createCarros, deleteCarro, getAllCarros, updateCarro } from '../Controllers/carrosControllers.js';

const router = express.Router();

// Público – usado na landing page
router.get('/destaques', getAllCarros)

// Protegidas – apenas ADMIN pode manipular carros
router.post('carro/', authenticateToken, checkAdmin, createCarros);
router.put('carro/:id', authenticateToken, checkAdmin, updateCarro);
router.delete('carro/:id', authenticateToken, checkAdmin, deleteCarro);

export default router;
