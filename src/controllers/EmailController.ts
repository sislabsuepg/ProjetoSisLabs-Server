import { Request, Response } from "express";
import EmailService from "../services/emailService.js";
import EmprestimoService from "../services/emprestimoService.js";

class EmailController {
  // Inicialização direta no campo
  private emailService: EmailService = new EmailService();

  async enviarAdvertencia(req: Request, res: Response): Promise<void> {
    try {
      const { to, subject, text, emprestimoId, idUsuario } = req.body;

      if (!to || !subject || !text || !emprestimoId || !idUsuario) {
        res.status(400).json({
          success: false,
          message:
            "Campos obrigatórios faltando: to, subject, text, emprestimoId, idUsuario",
        });
        return;
      }

      const advertenciaData = await EmprestimoService.updateAdvertencia(
        emprestimoId,
        subject.splice(0, 100), // Limita a 100 caracteres, trocar depois caso altere a logica
        idUsuario
      );

      const result = await this.emailService.sendMail({
        to,
        subject,
        text,
      });

      res.json({
        success: true,
        message: "Email enviado com sucesso",
        data: result,
      });
    } catch (error) {
      console.error("Erro no EmailController:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor ao enviar email",
      });
    }
  }
}

export default EmailController;
