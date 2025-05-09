// filepath: c:\Users\adrye\Desktop\BackLPFC\src\app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './Routes/authRoutes.js';
import vendedorRoutes from './Routes/vendedorRoutes.js';
import carrosRoutes from './Routes/CarroRoutes.js';
import adminRoutes from './Routes/adminRoutes.js';

const app = express();

// Habilita CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Configura uploads para a pasta 'uploads'
app.use('./Uploads', express.static('Uploads'));

// Registra as rotas
app.use(authRoutes); // Rotas de autenticação
app.use(vendedorRoutes); // Rotas de vendedores
app.use(carrosRoutes); // Rotas de carros
app.use(adminRoutes); // Rotas de administradores

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});