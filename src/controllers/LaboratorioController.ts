import laboratorioService from "../services/laboratorioService.js";
import { Request, Response } from "express";
import codes from "../types/responseCodes.js";
class LaboratorioController {
  async index(req: Request, res: Response) {
    const { restrito, page, items, ativo, nome } = req.query;
    let restritoTest: boolean | undefined;
    let ativado: boolean | undefined;

    if (restrito === undefined) {
      restritoTest = undefined;
    } else {
      restritoTest = restrito === "true";
    }
    if (ativo === undefined) {
      ativado = undefined;
    } else {
      ativado = ativo === "true";
    }
    const { erros, data } = await laboratorioService.getAllLaboratorios(
      restritoTest,
      Number(page),
      Number(items),
      nome === undefined ? undefined : String(nome),
      ativo === undefined ? undefined : ativado
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
    const { numero, nome, restrito, gerarHorarios } = req.body;
    // Aceita gerarHorarios como string "true"/"false", boolean, 1/0
    const gerarFlag = ((): boolean => {
      if (typeof gerarHorarios === "boolean") return gerarHorarios;
      if (typeof gerarHorarios === "number") return gerarHorarios === 1;
      if (typeof gerarHorarios === "string") {
        const val = gerarHorarios.trim().toLowerCase();
        return val === "true" || val === "1" || val === "yes";
      }
      return false;
    })();
    const { erros, data } = await laboratorioService.createLaboratorio(
      numero,
      nome,
      restrito,
      gerarFlag,
      req.body.idUsuario
    );
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.CREATED).json({ erros, data });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { numero, nome, restrito, ativo } = req.body;
    const { erros, data } = await laboratorioService.updateLaboratorio(
      Number(id),
      numero,
      nome,
      restrito,
      ativo,
      req.body.idUsuario
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
      Number(id),
      req.body.idUsuario
    );
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
    const count = await laboratorioService.getCount(ativado);
    res.status(codes.OK).json({ count });
  }
}

export default new LaboratorioController();
