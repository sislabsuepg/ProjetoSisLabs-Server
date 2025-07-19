import laboratorioService from "../services/laboratorioService";
import { Request, Response } from "express";

class LaboratorioController {
  async index(req: Request, res: Response) {
    const { status, erros, data } =
      await laboratorioService.getAllLaboratorios();
    res.status(status).json({ erros, data });
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    const { status, erros, data } = await laboratorioService.getLaboratorioById(
      Number(id)
    );
    res.status(status).json({ erros, data });
  }

  async create(req: Request, res: Response) {
    const { numero, nome, restrito } = req.body;
    const { status, erros, data } = await laboratorioService.createLaboratorio(
      numero,
      nome,
      restrito
    );
    res.status(status).json({ erros, data });
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { numero, nome, restrito } = req.body;
    const { status, erros, data } = await laboratorioService.updateLaboratorio(
      Number(id),
      numero,
      nome,
      restrito
    );
    res.status(status).json({ erros, data });
  }

  async destroy(req: Request, res: Response) {
    const { id } = req.params;
    const { status, erros, data } = await laboratorioService.deleteLaboratorio(
      Number(id)
    );
    res.status(status).json({ erros, data });
  }
}

export default new LaboratorioController();
