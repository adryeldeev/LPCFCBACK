import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './Routes/authRoutes.js';
import vendedorRoutes from './Routes/vendedorRoutes.js';
import carrosRoutes from './Routes/CarroRoutes.js';
import adminRoutes from './Routes/adminRoutes.js';
import MarcaRoutes from './Routes/MarcaRoutes.js';
import fin from './Routes/financiamentoRoutes.js';
import proposta from './Routes/propostaRoutes.js';
import resetPassword from './Routes/resetPasswordRoutes.js';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Habilita CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para processar JSON
app.use(express.json());

// Middleware para processar dados de formulários
app.use(express.urlencoded({ extended: true }));

// Configura uploads para a pasta 'Uploads'
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));
app.use(authRoutes); // Rotas de autenticação
app.use(vendedorRoutes); // Rotas de vendedores
app.use(carrosRoutes); // Rotas de carros
app.use(adminRoutes); // Rotas de administradores
app.use(MarcaRoutes); // Rotas de marcas
app.use(fin); // Rotas de financiamento
app.use(proposta); // Rotas de propostas
app.use(resetPassword); // Rotas de redefinição de senha


const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});