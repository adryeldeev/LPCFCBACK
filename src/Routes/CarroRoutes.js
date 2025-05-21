import express from 'express';
import path from 'path';
import multer from 'multer'
import { fileURLToPath } from 'url';
import { checkAdmin } from '../Middlewares/adminMiddleware.js';
import { authenticateToken } from '../Middlewares/authMiddleware.js';
import { createCarros, deleteCarro, getAllCarros, getAllCarrosDestaque, getByIdCarro, updateCarro } from '../Controllers/carrosControllers.js';
import convertTypesMiddleware from '../Middlewares/convertMiddleware.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do armazenamento de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      const folder = path.join(__dirname, "../", "Uploads/carros"); // Ajustado para refletir que está dentro de src
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
            "image/jpeg", "image/png", "image/jpg","image/webp", // Imagens
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
router.get('/destaques', getAllCarrosDestaque);
router.get('/carros',  authenticateToken, checkAdmin,getAllCarros);
router.get('/carros-all' ,getAllCarros);

router.get('/carro/:id', getByIdCarro);

// Protegidas – apenas ADMIN pode manipular carros
router.post('/carro', authenticateToken ,checkAdmin, upload.array('imagens', 10), convertTypesMiddleware, createCarros);
router.put('/carro/:id', authenticateToken, checkAdmin, upload.array('imagens', 10), updateCarro)
router.delete('/carro/:id', authenticateToken, checkAdmin, deleteCarro);

export default router;
