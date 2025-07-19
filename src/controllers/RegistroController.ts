import RegistroService from "../services/registroService";
import { Request, Response } from "express";

class RegistroController {
  async index(req: Request, res: Response) {
    const { status, erros, data } = await RegistroService.getAllRegistros();
    res.status(status).json({ erros, data });
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    const { status, erros, data } = await RegistroService.getRegistroById(
      Number(id)
    );
    res.status(status).json({ erros, data });
  }

  async showByUserId(req: Request, res: Response) {
    const { userId } = req.params;
    const { status, erros, data } = await RegistroService.getRegistroByUserId(
      Number(userId)
    );
    res.status(status).json({ erros, data });
  }

  async create(req: Request, res: Response) {
    const { descricao, idUsuario } = req.body;
    const dataHora: Date = new Date();
    const { status, erros, data } = await RegistroService.createRegistro(
      dataHora,
      descricao,
      idUsuario
    );
    res.status(status).json({ erros, data });
  }
}

export default new RegistroController();
