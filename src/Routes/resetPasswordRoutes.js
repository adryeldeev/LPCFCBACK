
import express from 'express';
import ResertPasswordController from '../Controllers/ResertPasswordController.js';


const router = express.Router();



router.post('/requestpassword', ResertPasswordController.requestPasswordReset); 
router.post('/resetpassword', ResertPasswordController.resetPassword); 



export default router;