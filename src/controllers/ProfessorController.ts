import professorService from "../services/professorService.js";
import { Request, Response } from "express";
import codes from "../types/responseCodes.js";

class ProfessorController {
  async index(req: Request, res: Response) {
    const { page, items, nome, ativo } = req.query;
    const ativado = ativo === "true";
    const { erros, data } = await professorService.getAllProfessores(
      Number(page),
      Number(items),
      nome === undefined ? undefined : String(nome),
      ativo === undefined ? undefined : ativado,
    );
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    const { erros, data } = await professorService.getProfessorById(Number(id));
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  async create(req: Request, res: Response) {
    const { nome, email } = req.body;
    const { erros, data } = await professorService.createProfessor(nome, email);
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.CREATED).json({ erros, data });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { nome, email, ativo } = req.body;
    const { erros, data } = await professorService.updateProfessor(
      Number(id),
      nome,
      email,
      ativo
    );
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  async destroy(req: Request, res: Response) {
    const { id } = req.params;
    const { erros, data } = await professorService.deleteProfessor(Number(id));
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  async count(req: Request, res: Response) {
    const { ativo } = req.query;
    let ativado = undefined;
    if (typeof ativo === "undefined") ativado = undefined;
    else {
      ativado = ativo === "true";
    }
    const count = await professorService.getCount(ativado);
    res.status(codes.OK).json({ count });
  }
}

export default new ProfessorController();
