import { Request, Response } from 'express';
import EmailService from '../services/emailService';

class EmailController {
    // Inicialização direta no campo
    private emailService: EmailService = new EmailService();

    async enviarAdvertencia(req: Request, res: Response): Promise<void> {
        try {
            const { to, subject, text } = req.body;

            if (!to || !subject || !text) {
                res.status(400).json({
                    success: false,
                    message: 'Campos obrigatórios faltando: to, subject, text'
                });
                return;
            }

            const result = await this.emailService.sendMail({
                to,
                subject,
                text
            });

            res.json({
                success: true,
                message: 'Email enviado com sucesso',
                data: result
            });

        } catch (error) {
            console.error('Erro no EmailController:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor ao enviar email'
            });
        }
    }
}

export default EmailController;