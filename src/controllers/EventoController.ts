import EventoService from "../services/eventoService";
import { Request, Response } from "express";

class EventoController {
  async index(req: Request, res: Response) {
    const { status, erros, data } = await EventoService.getAllEventos();
    res.status(status).json({ erros, data });
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    const { status, erros, data } = await EventoService.getEventoById(
      Number(id)
    );
    res.status(status).json({ erros, data });
  }

  async create(req: Request, res: Response) {
    const { nome, dataEvento, duracao, responsavel, idLaboratorio } = req.body;
    const { status, erros, data } = await EventoService.createEvento(
      nome,
      new Date(dataEvento),
      duracao,
      responsavel,
      idLaboratorio
    );
    res.status(status).json({ erros, data });
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { nome, dataEvento, duracao, responsavel, idLaboratorio } = req.body;
    const {
      status,
      erros,
      data,
    } = await EventoService.updateEvento(
      Number(id),
      nome,
      new Date(dataEvento),
      duracao,
      responsavel,
      idLaboratorio
    );
    res.status(status).json({ erros, data });
  }

  async destroy(req: Request, res: Response) {
    const { id } = req.params;
    const { status, erros, data } = await EventoService.deleteEvento(
      Number(id)
    );
    res.status(status).json({ erros, data });
  }
}
export default new EventoController();
