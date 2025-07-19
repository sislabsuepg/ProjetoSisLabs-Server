import professorService from "../services/professorService";
import { Request, Response } from "express";

class ProfessorController {
  async index(req: Request, res: Response) {
    const { status, erros, data } = await professorService.getAllProfessores();
    res.status(status).json({ erros, data });
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    const { status, erros, data } = await professorService.getProfessorById(
      Number(id)
    );
    res.status(status).json({ erros, data });
  }

  async create(req: Request, res: Response) {
    const { nome, email } = req.body;
    const { status, erros, data } = await professorService.createProfessor(
      nome,
      email
    );
    res.status(status).json({ erros, data });
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { nome, email, ativo } = req.body;
    const { status, erros, data } = await professorService.updateProfessor(
      Number(id),
      nome,
      email,
      ativo
    );
    res.status(status).json({ erros, data });
  }

  async destroy(req: Request, res: Response) {
    const { id } = req.params;
    const { status, erros, data } = await professorService.deleteProfessor(
      Number(id)
    );
    res.status(status).json({ erros, data });
  }
}

export default new ProfessorController();
