import express from 'express'

import { checkAdmin } from '../Middlewares/adminMiddleware.js';
import { authenticateToken } from '../Middlewares/authMiddleware.js';
import { createVendedor, deleteVendedor, getAllVendedores, updateVendedor } from '../Controllers/vendedorController.js';


const router = express.Router();

// Público – usado na landing page
router.get('/vendedores', getAllVendedores)
router.post('/vendedores', authenticateToken, checkAdmin, createVendedor);
router.put('/vendedores/:id', authenticateToken, checkAdmin, updateVendedor);
router.delete('/vendedores/:id', authenticateToken, checkAdmin, deleteVendedor);