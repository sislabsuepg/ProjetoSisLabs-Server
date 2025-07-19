import RecadoService from "../services/recadoService";
import { Request, Response } from "express";

class RecadoController {
  async index(req: Request, res: Response) {
    const { status, erros, data } = await RecadoService.getAllRecados();
    res.status(status).json({ erros, data });
  }

  async show(req: Request, res: Response) {
    const id = req.params.id;
    const { status, erros, data } = await RecadoService.getRecadoById(
      Number(id)
    );
    res.status(status).json({ erros, data });
  }

  async store(req: Request, res: Response) {
    const { texto } = req.body;
    const { status, erros, data } = await RecadoService.createRecado(texto);
    res.status(status).json({ erros, data });
  }

  async update(req: Request, res: Response) {
    const id = req.params.id;
    const { texto } = req.body;
    const { status, erros, data } = await RecadoService.updateRecado(
      Number(id),
      texto
    );
    res.status(status).json({ erros, data });
  }

  async destroy(req: Request, res: Response) {
    const id = req.params.id;
    const { status, erros, data } = await RecadoService.deleteRecado(
      Number(id)
    );
    res.status(status).json({ erros, data });
  }
}

export default new RecadoController();
