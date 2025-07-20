import HorarioService from "../services/horarioService";
import { Request, Response } from "express";

class HorarioController {
  async index(req: Request, res: Response) {
    const { status, erros, data } = await HorarioService.getAllHorarios();
    res.status(status).json({ erros, data });
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    const { status, erros, data } = await HorarioService.getHorarioById(
      Number(id)
    );
    res.status(status).json({ erros, data });
  }

  async create(req: Request, res: Response) {
    const { diaSemana, horario, idLaboratorio } = req.body;
    const { status, erros, data } = await HorarioService.createHorario(
      diaSemana,
      horario,
      idLaboratorio
    );
    res.status(status).json({ erros, data });
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { semestral, idProfessor } = req.body;
    const { status, erros, data } = await HorarioService.updateHorario(
      Number(id),
      idProfessor,
      semestral
    );
    res.status(status).json({ erros, data });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const { status, erros, data } = await HorarioService.deleteHorario(
      Number(id)
    );
    res.status(status).json({ erros, data });
  }
}

export default new HorarioController();
