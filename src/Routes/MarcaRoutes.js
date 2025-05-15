import express from 'express';
import path from 'path';
import multer from 'multer'
import { fileURLToPath } from 'url';
import { checkAdmin } from '../Middlewares/adminMiddleware.js';
import { authenticateToken } from '../Middlewares/authMiddleware.js';

import convertTypesMiddleware from '../Middlewares/convertMiddleware.js';
import { createMarca, deleteMarca, getMarcas, updateMarca } from '../Controllers/marcaController.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do armazenamento de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      const folder = path.join(__dirname, "../", "Uploads/logos"); // Ajustado para refletir que está dentro de src
      console.log('Diretório de destino:', folder);
      cb(null, folder);
  },
  filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
  },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "image/jpeg", "image/png", "image/jpg", // Imagens
            "application/pdf", // PDFs
            "application/msword", // .doc
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // .docx
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Tipo de arquivo não suportado. Apenas JPEG, PNG, JPG, PDF, DOC e DOCX são permitidos."), false);
        }
    },
});
const router = express.Router();

// Público – usado na landing page
// Público
router.get('/marcas',  authenticateToken, checkAdmin,getMarcas);

// Protegidas – apenas ADMIN pode manipular carros
router.post('/marca', authenticateToken ,checkAdmin, upload.single('imagem'), convertTypesMiddleware, createMarca);
router.put('/marca/:id', authenticateToken, checkAdmin, upload.single('imagem'), updateMarca)
router.delete('/marca/:id', authenticateToken, checkAdmin, deleteMarca);

export default router;
