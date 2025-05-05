import express from 'express';
import path from 'path';
import multer from 'multer'
import { fileURLToPath } from 'url';
import { checkAdmin } from '../Middlewares/adminMiddleware.js';
import { authenticateToken } from '../Middlewares/authMiddleware.js';
import { createCarros, deleteCarro, getAllCarros, getByIdCarro, updateCarro } from '../Controllers/carrosControllers.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do armazenamento de arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const folder = path.join(__dirname, "../../", "Uploads/carros");
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
router.get('/destaques', getAllCarros);
router.get('/carro/:id', getByIdCarro);

// Protegidas – apenas ADMIN pode manipular carros
router.post('/carro', authenticateToken, checkAdmin, upload.single('imagem'), createCarros);
router.put('/carro/:id', authenticateToken, checkAdmin, upload.single('imagem'), updateCarro);
router.delete('/carro/:id', authenticateToken, checkAdmin, deleteCarro);

export default router;
