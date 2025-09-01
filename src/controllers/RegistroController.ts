import RegistroService from "../services/registroService.js";
import { Request, Response } from "express";
import codes from "../types/responseCodes.js";

class RegistroController {
  async index(req: Request, res: Response) {
    const { page, items } = req.query;
    const { erros, data } = await RegistroService.getAllRegistros(
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
    const { erros, data } = await RegistroService.getRegistroById(Number(id));
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  async showByUserId(req: Request, res: Response) {
    const { userId } = req.params;
    const { erros, data } = await RegistroService.getRegistroByUserId(
      Number(userId)
    );
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  async create(req: Request, res: Response) {
    const { descricao, idUsuario } = req.body;
    const dataHora: Date = new Date();
    const { erros, data } = await RegistroService.createRegistro(
      dataHora,
      descricao,
      idUsuario
    );
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
