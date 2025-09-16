import RegistroService from "../services/registroService.js";
import { Request, Response } from "express";
import codes from "../types/responseCodes.js";

class RegistroController {
  async index(req: Request, res: Response) {
    const { page, items, idUsuario, dataInicio, dataFim } = req.query;
    let data1: Date | undefined;
    let data2: Date | undefined;
    let pagina = Number(page);
    let itens = Number(items);
    if (isNaN(pagina) || pagina < 1) {
      pagina = 1;
    }
    if (isNaN(itens) || itens < 1) {
      itens = 10;
    }
    if (idUsuario !== undefined && isNaN(Number(idUsuario))) {
      res
        .status(codes.BAD_REQUEST)
        .json({ erros: ["idUsuario deve ser um número"], data: null });
      return;
    }
    if (
      isNaN(Date.parse(dataInicio as string)) ||
      isNaN(Date.parse(dataFim as string))
    ) {
      data1 = undefined;
      data2 = undefined;
    } else {
      data1 = new Date(dataInicio as string);
      data2 = new Date(dataFim as string);
    }
    if (data1 && data2 && data1 > data2) {
      res
        .status(codes.BAD_REQUEST)
        .json({ erros: ["dataInicio deve ser menor que dataFim"], data: null });
      return;
    }
    if (idUsuario !== undefined) {
      const { erros, data } = await RegistroService.getRegistroByUserId(
        Number(idUsuario),
        data1,
        data2,
        itens,
        pagina
      );
      if (erros.length > 0) {
        res.status(codes.BAD_REQUEST).json({ erros, data });
      } else {
        res.status(codes.OK).json({ erros, data });
      }
    } else {
      const { erros, data } = await RegistroService.getAllRegistros(
        data1,
        data2,
        pagina,
        itens
      );

      if (erros.length > 0) {
        res.status(codes.BAD_REQUEST).json({ erros, data });
      } else {
        res.status(codes.OK).json({ erros, data });
      }
    }
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    const { erros, data } = await RegistroService.getRegistroById(Number(id));
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  async count(req: Request, res: Response) {
    const { userId } = req.query;
    let id = undefined;
    if (typeof userId === "undefined") id = undefined;
    else {
      id = Number(userId);
    }

    const count = await RegistroService.getCount(id);
    res.status(codes.OK).json({ count });
  }
}

export default new RegistroController();
