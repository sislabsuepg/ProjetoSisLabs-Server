import laboratorioService from "../services/laboratorioService.js";
import { Request, Response } from "express";
import codes from "../types/responseCodes.js";

const parseBooleanFlag = (value: unknown): boolean | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const normalizedValue = value.trim().toLowerCase();
    if (["true", "1", "yes"].includes(normalizedValue)) {
      return true;
    }
    if (["false", "0", "no"].includes(normalizedValue)) {
      return false;
    }
  }

  return undefined;
};

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
    const { erros, data } = await laboratorioService.getLaboratorioById(
      Number(id),
    );
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  async create(req: Request, res: Response) {
    const { numero, nome, restrito, gerarHorarios } = req.body;
    const gerarFlag = parseBooleanFlag(gerarHorarios) ?? false;
    const { erros, data } = await laboratorioService.createLaboratorio(
      numero,
      nome,
      restrito,
      gerarFlag,
      req.body.idUsuario,
    );
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.CREATED).json({ erros, data });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { numero, nome, restrito, ativo, temHorarios, gerarHorarios } =
      req.body;
    const temHorariosFlag =
      parseBooleanFlag(temHorarios) ?? parseBooleanFlag(gerarHorarios);
    const { erros, data } = await laboratorioService.updateLaboratorio(
      Number(id),
      numero,
      nome,
      restrito,
      ativo,
      temHorariosFlag,
      req.body.idUsuario,
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
      req.body.idUsuario,
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
