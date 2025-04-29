import Curso from "../models/Curso";

import CursoService from "../services/cursoService";
import { Request, Response } from "express";

class CursoController {
  async index(req: Request, res: Response) {
    if (!req.query.nome) {
      const { status, erros, data } = await CursoService.getAllCursos();
      res.status(status).json({ erros, data });
    } else {
      const { status, erros, data } = await CursoService.getCursoByNome(
        req.query.nome as string
      );
      res.status(status).json({ erros, data });
    }
  }

  async show(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { status, erros, data } = await CursoService.getCursoById(id);
    res.status(status).json({ erros, data });
  }

  async store(req: Request, res: Response) {
    const { nome } = req.body;
    const { status, erros, data } = await CursoService.createCurso(nome);
    res.status(status).json({ erros, data });
  }

  async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { nome } = req.body;
    const { status, erros, data } = await CursoService.updateCurso(id, nome);
    res.status(status).json({ erros, data });
  }

  async destroy(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { status, erros, data } = await CursoService.deleteCurso(id);
    res.status(status).json({ erros, data });
  }
}

export default new CursoController();
