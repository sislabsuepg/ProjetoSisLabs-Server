import EmprestimoService from "../services/emprestimoService.js";
import { Request, Response } from "express";
import codes from "../types/responseCodes.js";

class EmprestimoController {
  async index(req: Request, res: Response) {
    const { page, items } = req.query;
    const { data, erros } = await EmprestimoService.getAllEmprestimos(
      Number(page),
      Number(items)
    );
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ data, erros });
    } else {
      res.status(codes.OK).json({ data, erros });
    }
  }

  async show(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { data, erros } = await EmprestimoService.getEmprestimoById(id);
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ data, erros });
    } else {
      res.status(codes.OK).json({ data, erros });
    }
  }

  async create(req: Request, res: Response) {
    const { idLaboratorio, idAluno, idUsuario } = req.body;
    const { data, erros } = await EmprestimoService.createEmprestimo(
      idLaboratorio,
      idAluno,
      idUsuario,
      req.body.idUsuario
    );
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ data, erros });
    } else {
      res.status(codes.CREATED).json({ data, erros });
    }
  }

  async close(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { idUsuario } = req.body;
    const { data, erros } = await EmprestimoService.closeEmprestimo(
      id,
      parseInt(idUsuario),
      req.body.idUsuario
    );
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ data, erros });
    } else {
      res.status(codes.OK).json({ data, erros });
    }
  }

  async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { advertencia } = req.body;
    const { data, erros } = await EmprestimoService.updateAdvertencia(
      id,
      advertencia,
      req.body.idUsuario
    );
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ data, erros });
    } else {
      res.status(codes.OK).json({ data, erros });
    }
  }

  async count(req: Request, res: Response) {
    const { ativo } = req.query;
    let ativado = undefined;
    if (typeof ativo === "undefined") ativado = undefined;
    else {
      ativado = ativo === "true";
    }
    const count = await EmprestimoService.getCount(ativado);
    res.status(codes.OK).json({ count });
  }
}
export default new EmprestimoController();
