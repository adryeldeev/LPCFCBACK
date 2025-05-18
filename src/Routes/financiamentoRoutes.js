import express from 'express'
import { authenticateToken } from '../Middlewares/authMiddleware'
import { checkAdmin } from '../Middlewares/adminMiddleware.js'
import { criarPropostaFinanciamento, deletarPropostaFinanciamento, listarPropostasFinanciamento } from '../Controllers/financiamentoController.js'


const router = express.Router()


router.post('/financiamento', criarPropostaFinanciamento)
router.get('/financiamento', authenticateToken ,checkAdmin,listarPropostasFinanciamento)
 router.delete('/financiamento', authenticateToken ,checkAdmin,deletarPropostaFinanciamento)
