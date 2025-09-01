import laboratorioService from "../services/laboratorioService.js";
import { Request, Response } from "express";
import codes from "../types/responseCodes.js";
class LaboratorioController {
  async index(req: Request, res: Response) {
    const { page, items } = req.query;
    const { erros, data } = await laboratorioService.getAllLaboratorios(
      Number(page),
      Number(items)
    );
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    const { erros, data } = await laboratorioService.getLaboratorioById(
      Number(id)
    );
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  async create(req: Request, res: Response) {
    const { numero, nome, restrito } = req.body;
    const { erros, data } = await laboratorioService.createLaboratorio(
      numero,
      nome,
      restrito
    );
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.CREATED).json({ erros, data });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { numero, nome, restrito } = req.body;
    const { erros, data } = await laboratorioService.updateLaboratorio(
      Number(id),
      numero,
      nome,
      restrito
    );
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  async destroy(req: Request, res: Response) {
    const { id } = req.params;
    const { erros, data } = await laboratorioService.deleteLaboratorio(
      Number(id)
    );
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  async count(req: Request, res: Response) {
    const count = await laboratorioService.getCount();
    res.status(codes.OK).json({ count });
  }
}

export default new LaboratorioController();
