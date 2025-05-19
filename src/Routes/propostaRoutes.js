import express from 'express'
import { authenticateToken } from '../Middlewares/authMiddleware.js'
import { checkAdmin } from '../Middlewares/adminMiddleware.js'
import { criarPropostaVenda, deletarProposta, listarPropostas } from '../Controllers/propostaController.js'


const router = express.Router()

router.post('/proposta',criarPropostaVenda)
router.get('/proposta', authenticateToken ,checkAdmin,listarPropostas)
router.delete('/proposta', authenticateToken ,checkAdmin,deletarProposta)

export default router
