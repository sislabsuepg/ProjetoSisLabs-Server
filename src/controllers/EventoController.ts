import EventoService from "../services/eventoService";
import { Request, Response } from "express";
import codes from "../types/responseCodes";
class EventoController {
  async index(req: Request, res: Response) {
    const { page, items } = req.query;
    const { erros, data } = await EventoService.getAllEventos(
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
    const { erros, data } = await EventoService.getEventoById(Number(id));
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  async create(req: Request, res: Response) {
    const { nome, dataEvento, duracao, responsavel, idLaboratorio } = req.body;
    const { erros, data } = await EventoService.createEvento(
      nome,
      new Date(dataEvento),
      duracao,
      responsavel,
      idLaboratorio
    );
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.CREATED).json({ erros, data });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { nome, dataEvento, duracao, responsavel, idLaboratorio } = req.body;
    const { erros, data } = await EventoService.updateEvento(
      Number(id),
      nome,
      new Date(dataEvento),
      duracao,
      responsavel,
      idLaboratorio
    );
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  async destroy(req: Request, res: Response) {
    const { id } = req.params;
    const { erros, data } = await EventoService.deleteEvento(Number(id));
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
    const count = await EventoService.getCount(ativado);
    res.status(codes.OK).json({ count });
  }
}
export default new EventoController();
