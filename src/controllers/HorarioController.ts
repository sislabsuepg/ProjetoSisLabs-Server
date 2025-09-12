import HorarioService from "../services/horarioService.js";
import { Request, Response } from "express";
import codes from "../types/responseCodes.js";

class HorarioController {
  async index(req: Request, res: Response) {
    const { erros, data } = await HorarioService.getAllHorarios();
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    const { erros, data } = await HorarioService.getHorarioById(Number(id));
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  async showDiaSemana(req: Request, res: Response) {
    const { diaSemana } = req.params;
    if (isNaN(Number(diaSemana)) || Number(diaSemana) < 1 || Number(diaSemana) > 6) {
      res.status(codes.BAD_REQUEST).json({ erros: ["diaSemana deve ser um número entre 1 e 6"], data: null });
    }else{
      const { erros, data } = await HorarioService.getHorariosByDiaSemana(Number(diaSemana));
      if (erros.length > 0) {
        res.status(codes.BAD_REQUEST).json({ erros, data });
      } else {
        res.status(codes.OK).json({ erros, data });
      }
    }
  }

  async showLaboratorio(req: Request, res: Response) {
    const { id } = req.params;
    const { erros, data } = await HorarioService.getHorariosByLaboratorio(
      Number(id)
    );
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  async create(req: Request, res: Response) {
    const { diaSemana, horario, idLaboratorio } = req.body;
    const { erros, data } = await HorarioService.createHorario(
      diaSemana,
      horario,
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
    const { semestral, idProfessor } = req.body;
    const { erros, data } = await HorarioService.updateHorario(
      Number(id),
      idProfessor,
      semestral
    );
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const { erros, data } = await HorarioService.deleteHorario(Number(id));
    if (erros.length > 0) {
      res.status(codes.BAD_REQUEST).json({ erros, data });
    } else {
      res.status(codes.OK).json({ erros, data });
    }
  }
}

export default new HorarioController();
