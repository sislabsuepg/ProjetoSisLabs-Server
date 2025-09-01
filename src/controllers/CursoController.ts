import CursoService from "../services/cursoService.js";
import { Request, Response } from "express";
import codes from "../types/responseCodes.js";

class CursoController {
  async index(req: Request, res: Response) {
    const { page, items } = req.query;
    if (!req.query.nome) {
      const { erros, data } = await CursoService.getAllCursos(
        Number.parseInt(page as string),
        Number.parseInt(items as string)
      );
      if (erros.length > 0) {
        res.status(codes.BAD_REQUEST).json({ erros, data });
      } else {
        res.status(codes.OK).json({ erros, data });
      }
    } else {
      const { erros, data } = await CursoService.getCursosByNome(
        req.query.nome as string,
        Number.parseInt(page as string),
        Number.parseInt(items as string)
      );
      if (erros.length > 0) {
        res.status(codes.BAD_REQUEST).json({ erros, data });
      } else {
        res.status(codes.OK).json({ erros, data });
      }
    }
  }

  async show(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);
    const { erros, data } = await CursoService.getCursoById(id);
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  async store(req: Request, res: Response) {
    const { nome, anosMaximo } = req.body;
    const { erros, data } = await CursoService.createCurso(nome, anosMaximo);
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.CREATED).json({ erros, data });
    }
  }

  async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { nome, anosMaximo } = req.body;
    const { erros, data } = await CursoService.updateCurso(
      id,
      nome,
      anosMaximo
    );
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  async destroy(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { erros, data } = await CursoService.deleteCurso(id);
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  async count(req: Request, res: Response) {
    const count = await CursoService.getCount();
    res.status(codes.OK).json({ count });
  }
}

export default new CursoController();
