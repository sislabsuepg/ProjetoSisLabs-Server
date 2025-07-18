import CursoService from "../services/cursoService";
import { Request, Response } from "express";

class CursoController {
  async index(req: Request, res: Response) {
    if (!req.query.nome) {
      const { status, erros, data } = await CursoService.getAllCursos();
      res.status(status).json({ erros, data });
    } else {
      const { status, erros, data } = await CursoService.getCursosByNome(
        req.query.nome as string
      );
      res.status(status).json({ erros, data });
    }
  }

  async show(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);
    const { status, erros, data } = await CursoService.getCursoById(id);
    res.status(status).json({ erros, data });
  }

  async store(req: Request, res: Response) {
    const { nome, anosMax } = req.body;
    const { status, erros, data } = await CursoService.createCurso(
      nome,
      anosMax
    );
    res.status(status).json({ erros, data });
  }

  async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { nome, anosMax } = req.body;
    const { status, erros, data } = await CursoService.updateCurso(
      id,
      nome,
      anosMax
    );
    res.status(status).json({ erros, data });
  }

  async destroy(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { status, erros, data } = await CursoService.deleteCurso(id);
    res.status(status).json({ erros, data });
  }
}

export default new CursoController();
