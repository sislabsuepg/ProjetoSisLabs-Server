import express from 'express';
import EmailController from '../controllers/EmailController';

const router = express.Router();
const emailController = new EmailController();

router.post('/', (req, res) => {
    emailController.enviarAdvertencia(req, res);
});

export default router;