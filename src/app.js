import express from 'express'

import cors from "cors";
import {router} from './Routes/Routes.js'
import dotenv from 'dotenv'
dotenv.config()

const app = express();


// Habilita CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Configura CORS Headers


// Configura uploads para a pasta 'uploads'
app.use('./Uploads', express.static('Uploads'));
app.use(router);


const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});